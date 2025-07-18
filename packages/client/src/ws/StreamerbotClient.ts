import type { WebSocket as WebSocketNode } from 'ws';
import { defaultLogger, Logger, LogLevel } from '../utils/logger';
import { StreamerbotAction, StreamerbotInfo, StreamerbotPlatform, StreamerbotVariableValue } from './types';
import { StreamerbotEvents } from './types/events';
import { StreamerbotHelloRequest } from './types/streamerbot-auth.types';
import {
  StreamerbotEventName,
  StreamerbotEventPayload,
  StreamerbotEventSource,
  StreamerbotEventsSubscription,
  StreamerbotEventsTypeWriteable
} from './types/streamerbot-event.types';
import { StreamerbotRequest, StreamerbotRequestName } from './types/streamerbot-request.types';
import {
  ClearCreditsResponse,
  DoActionResponse,
  ExecuteCodeTriggerResponse,
  GetActionsResponse,
  GetActiveViewersResponse,
  GetBroadcasterResponse,
  GetCodeTriggersResponse,
  GetCommandsResponse,
  GetCreditsResponse,
  GetEventsResponse,
  GetGlobalResponse,
  GetGlobalsResponse,
  GetInfoResponse,
  GetMonitoredYouTubeBroadcastsResponse,
  GetUserGlobalResponse,
  GetUserGlobalsResponse,
  GetUserPronounsResponse,
  SendMessageResponse,
  StreamerbotErrorResponse,
  StreamerbotResponseTypes,
  SubscribeResponse,
  TestCreditsResponse,
  TwitchGetEmotesResponse,
  UnsubscribeResponse,
  YouTubeGetEmotesResponse
} from './types/streamerbot-response.types';
import { generateId, getCloseEventReason, sha256base64, withCustomEventResponse, withTimeout } from './util/websocket.util';

export type StreamerbotClientOptions = {
  scheme: 'ws' | 'wss' | string;
  host: string;
  port: number;
  endpoint: string;
  password?: string;
  immediate: boolean;
  autoReconnect: boolean;
  retries: number;
  subscribe:
    | StreamerbotEventsSubscription
    | '*';
  onConnect?: (data: StreamerbotInfo) => void;
  onDisconnect?: () => void;
  onError?: (error: Error) => void;
  onData?: (data: any) => void;
  logger?: Logger | null;
  logLevel?: LogLevel;
};

export const DefaultStreamerbotClientOptions: StreamerbotClientOptions = {
  scheme: 'ws',
  host: '127.0.0.1',
  port: 8080,
  endpoint: '/',
  immediate: true,
  autoReconnect: true,
  retries: -1,
  subscribe: {},
  logger: defaultLogger,
  logLevel: 'info',
} as const;

/**
 * The `StreamerbotClient` class provides an interface to connect and interact with a Streamer.bot WebSocket server.
 * It allows for authentication, event subscription, and various requests to control and retrieve information from the Streamer.bot instance.
 *
 * @example
 * ```typescript
 * const client = new StreamerbotClient({
 *   host: 'localhost',
 *   port: 8080,
 *   password: 'your_password',
 *   immediate: true,
 *   autoReconnect: true,
 *   retries: 5,
 *   onConnect: (info) => console.log('Connected to Streamer.bot', info),
 *   onError: (error) => console.error('Error:', error),
 * });
 *
 * client.on('Twitch.ChatMessage', (data) => {
 *   console.log('Chat message received:', data);
 * });
 * ```
 *
 * @remarks
 * The client supports both browser and Node.js environments. In a Node.js environment, it uses the `ws` package for WebSocket connections.
 *
 * @param options - Configuration options for the StreamerbotClient instance.
 * @param options.host - The host of the Streamer.bot WebSocket server.
 * @param options.port - The port of the Streamer.bot WebSocket server.
 * @param options.password - The password for authentication with the Streamer.bot WebSocket server.
 * @param options.scheme - The scheme to use for the WebSocket connection (e.g., 'ws' or 'wss').
 * @param options.endpoint - The endpoint path for the WebSocket connection.
 * @param options.immediate - Whether to immediately connect to the WebSocket server upon instantiation.
 * @param options.autoReconnect - Whether to automatically reconnect to the WebSocket server if the connection is lost.
 * @param options.retries - The number of reconnection attempts before giving up. A negative value means infinite retries.
 * @param options.subscribe - Initial subscriptions to events upon connection.
 * @param options.onConnect - Callback function to be called when the client successfully connects to the WebSocket server.
 * @param options.onDisconnect - Callback function to be called when the client disconnects from the WebSocket server.
 * @param options.onError - Callback function to be called when an error occurs.
 * @param options.onData - Callback function to be called when data is received from the WebSocket server.
 *
 * @public
 */
export class StreamerbotClient {
  private readonly options: StreamerbotClientOptions;
  private logger: Logger | null;

  protected socket?: WebSocket | WebSocketNode;

  protected info?: StreamerbotInfo;
  protected version?: string;
  protected supportedEvents?: StreamerbotEventsTypeWriteable;

  private _authEnabled: boolean = false;
  private _authenticated: boolean = false;

  private listeners: Array<{
    events: Array<StreamerbotEventName | '*'>;
    callback: (data: any) => void;
  }> = [];
  private subscriptions: StreamerbotEventsSubscription = {};

  private _explicitlyClosed = false;
  private _retried = 0;

  private _connectController = new AbortController();
  private _reconnectTimeout: ReturnType<typeof setTimeout> | undefined = undefined;

  public constructor(options: Partial<StreamerbotClientOptions> = DefaultStreamerbotClientOptions) {
    this.options = { ...DefaultStreamerbotClientOptions, ...options };

    // Configure logger
    this.logger = this.options.logger || null;
    if (this.logger && this.options.logLevel) {
      this.logger.setLevel(this.options.logLevel);
    }

    if (true === this.options.immediate) {
      this.connect().catch(e => this.logger?.warn('Failed to connect:', e));
    }
  }

  /**
   * Check if the WebSocket connection is authenticated
   */
  public get authenticated(): boolean {
    return !!this.socket && this.socket.readyState === this.socket.OPEN && this._authenticated;
  }

  /**
   * Check if the WebSocket connection is fully ready to make requests
   *
   * - Socket connection is open
   * - If authentication is enabled, it checks if the client is authenticated.
   * - Client has received the version and instance details from the Streamer.bot instance.
   *
   * @returns {boolean} - Returns true if the client is ready, false otherwise.
   */
  public get ready(): boolean {
    if (!this.socket || this.socket.readyState !== this.socket.OPEN) return false;
    if (this._authEnabled && !this._authenticated) return false;
    return !!this.info && !!this.version;
  }

  /**
   * Connect to a Streamer.bot WebSocket server
   */
  public async connect(timeout: number = 10_000): Promise<void> {
    if (this.socket?.readyState !== this.socket?.CLOSED) {
      try {
        await this.disconnect();
      } catch (e) {}
    }

    this._explicitlyClosed = false;

    this._connectController.abort();
    this._connectController = new AbortController();
    const controller = new AbortController();

    this._connectController.signal.addEventListener('abort', () => {
      controller.abort();
    }, { once: true });

    return await withTimeout(new Promise<void>(async (res, rej) => {
      try {
        if (this.options.password) this._authEnabled = true;

        const uri = `${this.options.scheme}://${this.options.host}:${this.options.port}${this.options.endpoint}`;
        this.logger?.debug('Connecting to Streamer.bot WebSocket server at', uri, this._authEnabled ? 'with authentication' : '');

        this.socket = !!globalThis?.process?.versions?.node ? new (await import('ws')).WebSocket(uri) : new WebSocket(uri);

        this.socket.onmessage = this.onMessage.bind(this);
        this.socket.onopen = this.onOpen.bind(this);
        this.socket.onclose = this.onClose.bind(this);
        this.socket.onerror = this.onError.bind(this);

        this.socket.addEventListener('open', () => {
          if (!this.socket) return rej(new Error('WebSocket not initialized'));
          res();
        }, { signal: controller.signal });

        this.socket.addEventListener('close', () => {
          return rej(new Error('WebSocket closed'));
        }, { once: true });
      } catch (error) {
        try {
          await this.disconnect();
          this?.options?.onError?.(error as Error);
        } catch (e) {
          this.logger?.warn('Error invoking onError handler', e);
        }
        rej(error);
      }
    }), {
      timeout,
      message: 'WebSocket connection timeout exceeded',
      controller,
    });
  }

  /**
   * Disconnect Streamer.bot WebSocket
   */
  public async disconnect(code: number = 1000, timeout: number = 1_000): Promise<void> {
    this._explicitlyClosed = true;
    this._connectController.abort();
    this._reconnectTimeout && clearTimeout(this._reconnectTimeout);
    if (!this.socket || this.socket.readyState === this.socket.CLOSED) return;

    const controller = new AbortController();
    const signal = controller.signal;

    return await withTimeout(new Promise<void>((res, rej) => {
      this.socket?.addEventListener('close', () => {
        this.logger?.debug('Disconnected from Streamer.bot WebSocket server');
        res();
      }, { signal });

      if (this.socket?.readyState !== this.socket?.CLOSING) {
        try {
          this.socket?.close(code);
        } catch (error) {
          rej(error);
        }
      }
    }), {
      timeout,
      message: 'Timeout exceeded while closing connection',
      controller,
    });
  }

  private async handshake(): Promise<void> {
    if (!this.socket) throw new Error('WebSocket not initialized');

    const controller = new AbortController();
    const { signal } = controller;

    this._connectController.signal.addEventListener('abort', () => {
      controller.abort();
    }, { once: true, signal });

    const response = await withTimeout(
      new Promise<StreamerbotHelloRequest | StreamerbotInfo>((res, rej) => {
        this.socket?.addEventListener('message', async (event: any) => {
          if (!('data' in event) || !event.data || typeof event.data !== 'string') {
            this.logger?.debug('Unknown message received', event);
            return;
          }

          try {
            const payload = JSON.parse(event.data);
            if (payload && 'info' in payload) {
              res(payload);
            }
          } catch (e) {
            this.logger?.warn('Invalid JSON payload received', event.data);
            rej(e);
          }
        }, { signal });
      }),
      {
        timeout: 5_000,
        message: 'Handshake timeout exceeded',
        controller,
      }
    );

    if (!response || !('info' in response)) throw new Error('Handshake failed (invalid payload)');

    if ('request' in response && response?.request === 'Hello' && response.authentication) {
      return await this.authenticate(response as StreamerbotHelloRequest);
    }
    else if (response.info && !response.authentication) {
      this.logger?.debug('Connected to Streamer.bot WebSocket server', response.info);
      this.info = response.info;
      this.version = response.info.version;
      return;
    }

    throw new Error('Handshake failed (unknown)');
  }

  private async authenticate(data: StreamerbotHelloRequest): Promise<void> {
    if (!this._authEnabled || !this.options.password) {
      this.logger?.debug('No password provided for authentication. Checking if auth is enforced for all requests...');
      const res = await this.getInfo();
      if (res.status === 'ok') {
        this._authenticated = false;
        this.version = data.info.version;
        this.info = data.info;
        return;
      }
      await this.disconnect();
      throw new Error('Authentication required');
    }

    if (!data.authentication) {
      this.logger?.debug('Missing authentication payload');
      await this.disconnect();
      throw new Error('Invalid authentication payload');
    }

    this.logger?.debug('Authenticating with Streamer.bot WebSocket server...');

    const { salt, challenge } = data?.authentication;
    const secret = await sha256base64(`${this.options.password}${salt}`);
    const authentication = await sha256base64(`${secret}${challenge}`);

    const response = await this.request({
      request: 'Authenticate',
      authentication,
    });

    if (response.status === 'ok') {
      this._authenticated = true;
      this.version = data.info.version;
      this.info = data.info;
    } else {
      await this.disconnect();
      throw new Error('Authentication failed');
    }
  }

  protected async onOpen(): Promise<void> {
    this._retried = 0;
    this._reconnectTimeout && clearTimeout(this._reconnectTimeout);

    try {
      // Force a getInfo call for backwards compat with Streamer.bot v0.2.4 and older
      if (!this._authEnabled) {
        void this.getInfo().catch(() => this.logger?.debug('Failed to fetch Streamer.bot instance info'));
      }
      await this.handshake();

      if (this.version && this.info) {
        this.logger?.debug(`Connected to Streamer.bot: v${this.version} (${this.info.name})`);
        await this.updateSupportedEvents();
        this?.options?.onConnect?.(this.info);
      }
    } catch (err) {
      this.logger?.warn('Failed handshake with Streamer.bot', err);
      this.options?.onError?.(err instanceof Error ? err : new Error('Failed handshake with Streamer.bot'));
      return await this.disconnect();
    }

    try {
      // Subscribe to initial subscriptions requested in client options
      if (this.options.subscribe === '*' || (typeof this.options.subscribe === 'object' && !Array.isArray(this.options.subscribe) && Object.keys(this.options.subscribe ?? {}).length)) {
        this.logger?.debug('Subscribing to initial events from options:', this.options.subscribe);
        await this.subscribe(this.options.subscribe);
      } else if (typeof this.options.subscribe === 'string' || Array.isArray(this.options.subscribe)) {
        this.logger?.debug('Subscribing to initial events from options:', this.options.subscribe);
        const subscriptions = await this.getSubscriptionsFromEventStrings(this.options.subscribe);
        this.logger?.debug('Parsed subscriptions from options:', subscriptions);
        if (subscriptions) {
          await this.subscribe(subscriptions);
        }
      }

      // Subscribe to any events from listeners added with .on
      if (this.listeners.length) {
        const subscriptions = await this.getSubscriptionsFromListeners();
        await this.subscribe(subscriptions);
      }

      this.logger?.verbose('Subscribed to requested events', this.subscriptions, this.listeners);
    } catch (e) {
      this.logger?.warn('Error subscribing to requested events', e);
    }
  }

  protected onClose(event: CloseEvent): void {
    this._connectController.abort();

    try {
      if ((event.type === 'error' || !event.wasClean) && this.options.onError)
        this?.options?.onError(new Error(getCloseEventReason(event)));
      this?.options?.onDisconnect?.();
    } catch (e) {
      this.logger?.warn('Error invoking user-provided onDisconnect handler', e);
    }

    // No auto-reconnect, clean up
    if (this._explicitlyClosed || !this.options.autoReconnect) {
      this.logger?.debug('Cleaning up...');
      return this.cleanup();
    }

    // Handle auto-reconnect
    this._retried += 1;
    if (
      typeof this.options.retries === 'number' &&
      (this.options.retries < 0 || this._retried < this.options.retries)
    ) {
      if (this._reconnectTimeout) clearTimeout(this._reconnectTimeout);
      this._reconnectTimeout = setTimeout(async () => {
        if (!!this.socket && this.socket.readyState !== this.socket.CLOSED) return;
        this.logger?.debug(`Reconnecting... (attempt ${this._retried})`);
        try {
          await this.connect(10_000);
        } catch (e) {
          if (this._retried) this.logger?.warn(`Failed to reconnect (attempt ${this._retried - 1})`, e);
        }
      }, Math.min(30_000, this._retried * 1_000));
    }
    else {
      this.logger?.debug('Auto-reconnect limit reached. Cleaning up...');
      this.cleanup();
    }
  }

  protected async onMessage(event: MessageEvent): Promise<void> {
    if (!event.data || typeof event.data !== 'string') {
      this.logger?.debug('Unknown message received', event);
      return;
    }

    let payload;
    try {
      payload = JSON.parse(event.data);
    } catch (e) {
      this.logger?.warn('Invalid JSON payload received', event.data, e);
      return;
    }

    this.logger?.verbose(`RECV`, payload);

    // onData handler
    try {
      if (this.options.onData) this?.options?.onData(payload);
    } catch (e) {
      this.logger?.warn('Error occurred within user-provided onData callback', e);
    }

    // any listeners called from `.on`
    if (payload?.event?.source && payload?.event?.type) {
      for (const listener of this.listeners) {
        if (!listener.events?.length) continue;
        if (
          !listener.events.find((event) => {
            return (
              event === '*' ||
              event === `${payload?.event?.source}.${payload?.event?.type}` ||
              (event.split('.', 2)?.[1] === '*' &&
                event.split('.', 2)?.[0] === payload?.event?.source)
            );
          })
        )
          continue;

        try {
          listener.callback(payload);
        } catch (e) {
          this.logger?.warn(`Error occurred within user-provided event callback (${listener.events})`, e);
        }
      }
    }
  }

  protected onError(event: Event): void {
    this.logger?.debug('WebSocket onError', event);
    if (!!this.socket && this.socket.readyState !== this.socket.OPEN) {
      this._connectController.abort();
    }
    try {
      this?.options?.onError?.(new Error('WebSocket Error'));
    } catch (e) {
      this.logger?.warn('Error occurred within user-provided onError callback', e);
    }
  }

  protected cleanup(): void {
    if (this.socket) {
      this.socket.onopen = null;
      this.socket.onclose = null;
      this.socket.onerror = null;
      this.socket.onmessage = null;
      this.socket = undefined;
    }
    this.listeners = [];
    this._retried = 0;
    this._connectController.abort();
    if (this._reconnectTimeout) clearTimeout(this._reconnectTimeout);
  }

  /**
   * Send a raw object to the Streamer.bot WebSocket
   */
  public send(data: Object): void {
    this.socket?.send(JSON.stringify(data));
  }

  /**
   * Make a request to the Streamer.bot WebSocket,
   * wait for the response, and return the response data
   */
  public async request<T extends StreamerbotResponseTypes>(
    request: StreamerbotRequest,
    id: string = '',
    timeout: number = 10_000
  ): Promise<T> {
    if (!this.socket || this.socket.readyState !== this.socket.OPEN) {
      throw new Error('WebSocket is not connected');
    }

    if (!id) id = generateId();

    const controller = new AbortController();
    const signal = controller.signal;

    this._connectController.signal.addEventListener('abort', () => {
      controller.abort();
    }, { once: true, signal });

    const response = await withTimeout(new Promise<T>((res, rej) => {
      this.socket?.addEventListener('message', (event: any) => {
        if (!('data' in event) || !event.data || typeof event.data !== 'string') {
          this.logger?.debug('Unknown message received', event.data);
          return;
        }

        try {
          const payload = JSON.parse(event?.data);
          if (payload?.id === id) {
            this.logger?.verbose(`RECV :: ${request.request}`, payload);
            return res(payload);
          }
        } catch (e) {
          this.logger?.warn('Invalid JSON payload received', event.data);
          rej(e);
        }
      }, { signal });
      this.logger?.verbose(`SEND :: ${request.request}`, { ...request, id });
      this.send({ ...request, id });
    }), {
      timeout,
      message: 'Request timed out',
      controller,
      signal,
    });

    if (response?.status === 'ok') {
      // onData handler
      try {
        if (this.options.onData) {
          this?.options?.onData(response);
        }
      } catch (e) {
        this.logger?.warn('Error invoking onData handler', e);
      }

      return {
        event: {
          source: 'Request',
          type: request.request ?? 'Unknown',
        },
        ...response,
      };
    }

    throw new Error('Request failed');
  }

  /**
   * Helper method to handle custom event subscriptions
   *
   * This method allows you to subscribe to a specific event, source, or all events
   * and provides a listener callback that will be invoked when the event occurs.
   *
   * @param event - The event name to subscribe to. Can be a specific event, source, or wildcard '*'.
   *              - e.g. 'Twitch.ChatMessage', 'YouTube.*', '*'
   * @param listener - The callback function that will be invoked when the event occurs.
   *                    It receives the event data as an argument.
   */
  public async on<TEvent>(
    event: TEvent extends StreamerbotEventName ? TEvent : StreamerbotEventName | '*',
    listener: (data: StreamerbotEventPayload<TEvent extends StreamerbotEventName ? TEvent : StreamerbotEventName>) => void
  ): Promise<void> {
    try {
      if (!event) return;

      // Keep track of the requested subscription string internally
      const listenerConfig = {
        events: [event],
        callback: listener,
      };
      this.listeners.push(listenerConfig);

      // If the client is ready, subscribe to the event immediately
      if (this.ready) {
        const subscriptions = await this.getSubscriptionsFromListeners([listenerConfig]);
        await this.subscribe(subscriptions);
      }

      this.logger?.debug(`Added event listener for "${event}"`);
    } catch (e) {
      this.logger?.warn(`Failed adding event listener for "${event}"`, e);
    }
  }

  /**
   * Update the supported events from the Streamer.bot instance.
   *
   * This will ensure the client has an accurate list of events
   * which can be subscribed to from the connected Streamer.bot instance.
   */
  private async updateSupportedEvents(): Promise<void> {
    if (!this.ready) return;

    try {
      const eventsResponse = await this.getEvents();
      if (eventsResponse.status !== 'ok' || !eventsResponse.events) {
        throw new Error(eventsResponse.status);
      }
      this.supportedEvents = eventsResponse.events as StreamerbotEventsTypeWriteable;
      this.logger?.debug(`Successfully fetched supported event types for Streamer.bot v${this.version}`);
    } catch(error) {
      this.logger?.warn('Failed to fetch supported events from Streamer.bot, falling back to stored events type.', error);
      this.supportedEvents = StreamerbotEvents as StreamerbotEventsTypeWriteable;
    }
  }

  /**
   * Get the supported events from the Streamer.bot instance.
   *
   * @returns The GetEvents method response from the connected instance.
   */
  private async getSupportedEvents(): Promise<StreamerbotEventsTypeWriteable> {
    if (!this.supportedEvents) {
      this.logger?.warn('Supported event types not yet initialized, fetching from Streamer.bot instance...');
      await this.updateSupportedEvents();
    }
    return this.supportedEvents ?? StreamerbotEvents as StreamerbotEventsTypeWriteable;
  }


  /**
   * Extract events from the configured listeners
   *
   * @param listeners - Optional array of listeners to extract events from. If not provided, it uses the current instance's listeners.
   * @return A record mapping event names to their corresponding listener callbacks.
   */
  private getEventsFromListeners(listeners?: typeof this.listeners) {
    return (listeners ?? this.listeners).reduce((acc, listener) => {
      listener.events.forEach(event => {
        if (!acc[event]) {
          acc[event] = [];
        }
        acc[event].push(listener.callback);
      });
      return acc;
    }, {} as Record<StreamerbotEventName | '*', Array<(data: any) => void>>);
  }

  /**
   * Parse the configured listeners and return a subscription object
   *
   * @param listeners - Optional array of listeners to parse. If not provided, it uses the current instance's listeners.
   * @returns A StreamerbotEventsSubscription object ready to be used for subscribing to events.
   */
  private async getSubscriptionsFromListeners(listeners?: typeof this.listeners): Promise<StreamerbotEventsSubscription> {
    const events = this.getEventsFromListeners(listeners);
    return this.getSubscriptionsFromEventStrings(Object.keys(events));
  }

  /**
   * Parse an array of event strings and return a structured subscription object
   *
   * @param events - An array of event strings to parse, e.g. ['Twitch.ChatMessage', 'YouTube.*', '*']
   * @returns A StreamerbotEventsSubscription object mapping event sources to their types.
   */
  private async getSubscriptionsFromEventStrings(events: string | string[]): Promise<StreamerbotEventsSubscription> {
    const subscriptions: StreamerbotEventsSubscription = {};

    if (typeof events === 'string') {
      events = [events];
    }

    for (const event of events) {
      const result = await this.parseEventString(event);
      if (!result) continue;

      const { source, eventTypes } = result;
      const set = new Set([...(subscriptions[source] ?? []), ...eventTypes]);
      subscriptions[source] = [...set] as any;
    }

    return subscriptions;
  }

  /**
   * Parse a string event subscription into a structured object
   *
   * @param event - The event string to parse, e.g. 'Twitch.ChatMessage', 'YouTube.*', '*'
   * @returns An object containing the event source and types, or undefined if the event is invalid
   */
  private async parseEventString(event: string): Promise<{ source: StreamerbotEventSource; eventTypes: string[]; } | undefined> {
    const supportedEvents = await this.getSupportedEvents();
    if (!event || typeof event !== 'string') {
      this.logger?.warn(`Invalid event subscription requested "${event}"`);
      return;
    }

    if (event === '*') {
      for (const key in supportedEvents) {
        if (key === undefined) continue;
        if (!Object.keys(supportedEvents).includes(key)) continue;

        const eventSource = key as keyof typeof supportedEvents;
        const eventTypes = supportedEvents[eventSource] ?? [];

        return { source: eventSource, eventTypes };
      }
    }
    else {
      const [source, type] = event.split('.', 2);
      if (!source || !type || !(source in supportedEvents)) {
        this.logger?.warn(`Invalid event subscription requested "${event}"`);
        return;
      }

      const eventSource = source as keyof StreamerbotEventsTypeWriteable;
      const eventType = type as
        | StreamerbotEventsTypeWriteable[keyof StreamerbotEventsTypeWriteable][number]
        | '*';
      if (eventType) {
        return { source: eventSource, eventTypes: eventType === '*' ? supportedEvents[eventSource] : [eventType] };
      } else {
        this.logger?.warn(`Invalid event type requested "${event}"`);
        return;
      }
    }
  }

  /**
   * Subscribe to events from your connected Streamer.bot instance
   */
  public async subscribe(events: StreamerbotEventsSubscription | '*'): Promise<SubscribeResponse> {
    const supportedEvents = await this.getSupportedEvents();

    // subscribe to all if = '*'
    if (events === '*') {
      events = supportedEvents;
    }

    for (const key in events) {
      if (!key || key === 'err') continue;

      // Skip unknown keys
      if (!(key in supportedEvents)) {
        this.logger?.warn(`Attempted to subscribe to empty or unknown event source: "${key}"`, Object.keys(events));
        continue;
      }

      const eventSource = key as keyof typeof events;
      const eventTypes = events[eventSource] ?? [];

      if (eventTypes && eventTypes.length) {
        const set = new Set([...(this.subscriptions[eventSource] ?? []), ...eventTypes]);
        this.subscriptions[eventSource] = [...set] as any[];
      }
    }

    // Short circuit invalid subscription request
    if (Object.keys(this.subscriptions).length === 0) {
      this.logger?.warn('No valid events to subscribe to. Please provide valid event sources and types.');
      return { id: 'invalid', status: 'error', error: 'No valid events to subscribe to' };
    }

    return await this.request<SubscribeResponse>({
      request: 'Subscribe',
      events: this.subscriptions,
    });
  }

  /**
   * Unsubscribe from events you are currently subscribed to
   */
  public async unsubscribe(
    events: StreamerbotEventsSubscription | '*'
  ): Promise<UnsubscribeResponse> {
    const supportedEvents = await this.getSupportedEvents();

    // unsubscribe from all if = '*'
    if (events === '*') events = supportedEvents;

    // remove subscriptions from state
    for (const key in events) {
      if (key === undefined) continue;
      if (!Object.keys(supportedEvents).includes(key)) continue;

      const eventSource = key as StreamerbotEventSource;
      const eventTypes = events[eventSource];

      if (eventTypes && eventTypes.length) {
        for (const eventType of eventTypes) {
          if (eventType) {
            if (this.subscriptions[eventSource]?.filter) {
              (this.subscriptions[eventSource] = this.subscriptions[eventSource] as any[])?.filter(
                (evt: any) => eventType !== evt
              );
            }
          }
        }
      }
    }

    // send request to streamer.bot
    return await this.request<UnsubscribeResponse>({
      request: 'UnSubscribe',
      events,
    });
  }

  /**
   * Get all possible events that may be subscribed to
   */
  public async getEvents(): Promise<GetEventsResponse> {
    return await this.request<GetEventsResponse>({
      request: 'GetEvents',
    });
  }

  /**
   * Get all actions from your connected Streamer.bot instance
   */
  public async getActions(): Promise<GetActionsResponse> {
    return await this.request<GetActionsResponse>({
      request: 'GetActions',
    });
  }

  /**
   * Get all actions from your connected Streamer.bot instance
   */
  public async doAction<T = Record<string, any>>(
    action: string | Partial<Pick<StreamerbotAction, 'id' | 'name'>>,
    args?: Record<string, any>,
    options?: Partial<{
      customEventResponse: boolean;
    }>
  ): Promise<DoActionResponse<T>> {
    if (options?.customEventResponse) return this.doActionWithCustomEventResponse(action, args);

    let id, name;

    if (typeof action === 'string') {
      id = action;
    } else {
      id = action.id;
      name = action.name;
    }

    return await this.request<DoActionResponse<T>>({
      request: 'DoAction',
      action: {
        id,
        name,
      },
      args,
    });
  }

  /**
   * Executes an action and waits for a matching Custom event response
   *
   * @param action The action ID or object with ID/name to execute
   * @param args Optional arguments to pass to the action
   * @param timeout Maximum time to wait for response in milliseconds
   * @returns Promise resolving to the Custom event data
   */
  private async doActionWithCustomEventResponse<T = Record<string, any>>(
    action: string | Partial<Pick<StreamerbotAction, 'id' | 'name'>>,
    args: Record<string, any> = {},
    timeout: number = 10_000
  ): Promise<DoActionResponse<T>> {
    if (!this.socket || this.socket.readyState !== this.socket.OPEN) {
      throw new Error('WebSocket is not connected');
    }

    const { responseId: sbClientResponse, promise, controller } = withCustomEventResponse<T>({
      timeout,
      addEventListener: (event, handler) => this.on(event as any, handler as any),
      removeEventListener: predicate => {
        this.listeners = this.listeners.filter(l => !predicate(l));
      }
    });

    const actionArgs = {
      ...args,
      sbClientResponse
    };

    try {
      const response = await this.doAction(action, actionArgs);
      const customEventResponseArgs = await promise;
      return {
        ...response,
        customEventResponseArgs,
      };
    } catch (error) {
      if (!controller.signal.aborted) {
        controller.abort();
      }
      throw error;
    }
  }

  /**
   * Get the current broadcaster account information
   */
  public async getBroadcaster(): Promise<GetBroadcasterResponse> {
    return await this.request<GetBroadcasterResponse>({
      request: 'GetBroadcaster',
    });
  }

  /**
   * Get all monitored YouTube broadcasts
   *
   * @version 0.2.5
   */
  public async getMonitoredYouTubeBroadcasts(): Promise<GetMonitoredYouTubeBroadcastsResponse> {
    return await this.request<GetMonitoredYouTubeBroadcastsResponse>({
      request: 'GetMonitoredYouTubeBroadcasts',
    });
  }

  /**
   * Get the current credits payload
   */
  public async getCredits(): Promise<GetCreditsResponse> {
    return await this.request<GetCreditsResponse>({
      request: 'GetCredits',
    });
  }

  /**
   * Test credits by populating with fake data
   */
  public async testCredits(): Promise<TestCreditsResponse> {
    return await this.request<TestCreditsResponse>({
      request: 'TestCredits',
    });
  }

  /**
   * Reset credits data
   */
  public async clearCredits(): Promise<ClearCreditsResponse> {
    return await this.request<ClearCreditsResponse>({
      request: 'ClearCredits',
    });
  }

  /**
   * Get information about the connected Streamer.bot instance
   */
  public async getInfo(): Promise<GetInfoResponse> {
    return await this.request<GetInfoResponse>({
      request: 'GetInfo',
    });
  }

  /**
   * Returns all active viewers and their user information
   */
  public async getActiveViewers(): Promise<GetActiveViewersResponse> {
    return await this.request<GetActiveViewersResponse>({
      request: 'GetActiveViewers',
    });
  }

  /**
   * Execute a custom code trigger
   */
  public async executeCodeTrigger(
    triggerName: string,
    args?: Record<string, any>,
    options?: Partial<{
      customEventResponse: boolean;
    }>
  ): Promise<ExecuteCodeTriggerResponse> {
    if (options?.customEventResponse) return this.executeCodeTriggerWithCustomEventResponse(triggerName, args);

    return await this.request<ExecuteCodeTriggerResponse>({
      request: 'ExecuteCodeTrigger',
      triggerName,
      args,
    });
  }

  /**
   * Executes a code trigger and waits for a matching Custom event response
   *
   * @param triggerName The name of the code trigger to execute
   * @param args Optional arguments to pass to the code trigger
   * @param timeout Maximum time to wait for response in milliseconds
   * @returns Promise resolving to the Custom event data
   */
  private async executeCodeTriggerWithCustomEventResponse<T = Record<string, any>>(
    triggerName: string,
    args: Record<string, any> = {},
    timeout: number = 10_000
  ): Promise<ExecuteCodeTriggerResponse<T>> {
    if (!this.socket || this.socket.readyState !== this.socket.OPEN) {
      throw new Error('WebSocket is not connected');
    }

    const { responseId: sbClientResponse, promise, controller } = withCustomEventResponse<T>({
      timeout,
      addEventListener: (event, handler) => this.on(event as any, handler as any),
      removeEventListener: predicate => {
        this.listeners = this.listeners.filter(l => !predicate(l));
      }
    });

    const triggerArgs = {
      ...args,
      sbClientResponse
    };

    try {
      const response = await this.executeCodeTrigger(triggerName, triggerArgs);
      const customEventResponseArgs = await promise;
      return {
        ...response,
        customEventResponseArgs,
      };
    } catch (error) {
      if (!controller.signal.aborted) {
        controller.abort();
      }
      throw error;
    }
  }

  /**
   * Get all custom code triggers
   */
  public async getCodeTriggers(): Promise<GetCodeTriggersResponse> {
    return await this.request<GetCodeTriggersResponse>({
      request: 'GetCodeTriggers',
    });
  }

  /**
   * Get commands for the connected Streamer.bot instance
   *
   * @version 0.2.5
   */
  public async getCommands(): Promise<GetCommandsResponse> {
    return await this.request<GetCommandsResponse>({
      request: 'GetCommands',
    });
  };

  /**
   * Get emotes for the selected platform
   *
   * @version 0.2.5
   */
  public async getEmotes(platform: StreamerbotPlatform): Promise<TwitchGetEmotesResponse | YouTubeGetEmotesResponse> {
    switch (platform) {
      case 'twitch':
        return await this.request<TwitchGetEmotesResponse>({
          request: 'TwitchGetEmotes',
        });
      case 'youtube':
        return await this.request<YouTubeGetEmotesResponse>({
          request: 'YouTubeGetEmotes',
        });
      default:
        throw new Error('Invalid platform');
    }
  }

  /**
   * Get all global variables
   *
   * @version 0.2.5
   */
  public async getGlobals(persisted = true): Promise<GetGlobalsResponse> {
    return await this.request<GetGlobalsResponse>({
      request: 'GetGlobals',
      persisted,
    });
  }

  /**
   * Get a global variable by name
   *
   * @version 0.2.5
   * @param name The name of the global variable to fetch
   * @param persisted Whether the global variable is persisted
   */
  public async getGlobal<
    T extends StreamerbotVariableValue,
    K extends string = string
  >(name: K, persisted = true) {
    const response = await this.request<GetGlobalResponse<T, K>>({
      request: 'GetGlobal',
      variable: name,
      persisted,
    });
    if (response.status === 'ok') {
      if (!response.variables[name]) return { status: 'error', error: 'Variable not found' };
      return {
        id: response.id,
        status: response.status,
        variable: response.variables[name],
      };
    }
    return response;
  }

  /**
   * Get user global variables
   *
   * @version 0.2.5
   * @param platform The platform to fetch globals for (twitch, youtube, trovo)
   * @param name Optional name of the global user variable to fetch
   * @param persisted Whether the global variable is persisted
   */
  public async getUserGlobals<
    T extends StreamerbotVariableValue,
    K extends string = string,
    P extends StreamerbotPlatform = StreamerbotPlatform
  >(
    platform: P,
    name: K | null = null,
    persisted = true
  ): Promise<GetUserGlobalsResponse<T, K, P>> {
    const platformToRequest: Record<StreamerbotPlatform, StreamerbotRequestName> = {
      'twitch': 'TwitchGetUserGlobals',
      'youtube': 'YouTubeGetUserGlobals',
      'trovo': 'TrovoGetUserGlobals',
      'kick': 'KickGetUserGlobals',
    };
    const request = platformToRequest[platform];
    if (!request) throw new Error('Invalid platform');

    return await this.request<GetUserGlobalsResponse<T, K, P>>({
      request,
      variable: name,
      persisted,
    });
  }

  /**
   * Get user global variables
   *
   * @version 0.2.5
   * @param platform The platform to fetch globals for (twitch, youtube, trovo)
   * @param userId The user ID to fetch globals for
   * @param name Optional name of the global variable to fetch
   * @param persisted Whether the global variable is persisted
   */
  public async getUserGlobal<
    T extends StreamerbotVariableValue,
    K extends string = string,
    U extends string = string,
    P extends StreamerbotPlatform = StreamerbotPlatform,
  >(
    platform: P,
    userId: U,
    name: K | null = null,
    persisted = true
  ) {
    const platformToRequest: Record<StreamerbotPlatform, StreamerbotRequestName> = {
      'twitch': 'TwitchGetUserGlobal',
      'youtube': 'YouTubeGetUserGlobal',
      'trovo': 'TrovoGetUserGlobal',
      'kick': 'KickGetUserGlobal',
    };
    const request = platformToRequest[platform];
    if (!request) throw new Error('Invalid platform');

    const response = await this.request<GetUserGlobalResponse<T, K>>({
      request,
      userId,
      variable: name || null,
      persisted,
    });

    if (response.status === 'ok' && userId && name) {
      const variable = response.variables.find((v) => v.name === name);
      if (!variable) return { status: 'error', error: 'Variable not found' };
      return {
        id: response.id,
        status: response.status,
        variable,
      };
    }
    return response;
  }

  /**
   * Send chat messages
   *
   * Authenticated WebSocket is required
   *
   * @version 0.2.5
   * @param platform The platform to send the message to
   * @param message The message content to send
   * @param options Additional options for the message
   */
  public async sendMessage(
    platform: StreamerbotPlatform,
    message: string,
    { bot = false, internal = true, ...options }: {
      bot?: boolean;
      internal?: boolean;
      replyId?: string;
      broadcastId?: string;
    } = {}
  ): Promise<SendMessageResponse> {
    if (!this._authenticated) {
      return {
        status: 'error',
        error: 'Authentication required',
      } as StreamerbotErrorResponse;
    }

    const req = {
      platform,
      message,
      bot,
      internal,
    };

    const REPLIES_SUPPORTED = ['twitch', 'kick'];
    if (REPLIES_SUPPORTED.includes(platform) && options.replyId) {
      Object.assign(req, { replyId: options.replyId });
    }

    const MULTI_BROADCAST_SUPPORTED = ['youtube'];
    if (MULTI_BROADCAST_SUPPORTED.includes(platform) && options.broadcastId) {
      Object.assign(req, { broadcastId: options.broadcastId });
    }

    return await this.request({
      ...req,
      request: 'SendMessage',
    });
  }


  /**
   * Retrieves the pronouns of a user from the specified platform.
   *
   * @param platform - The platform from which to retrieve the user's pronouns.
   * @param userLogin - The login name of the user whose pronouns are to be retrieved.
   * @returns A promise that resolves to the user's pronouns.
   */
  public async getUserPronouns(
    platform: StreamerbotPlatform,
    userLogin: string,
  ): Promise<GetUserPronounsResponse> {
    return await this.request<GetUserPronounsResponse>({
      request: 'GetUserPronouns',
      platform,
      userLogin,
    });
  }
}