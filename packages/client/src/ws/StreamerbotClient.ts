import type { WebSocket as WebSocketNode } from 'ws';
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
import { generateRequestId, getCloseEventReason, sha256base64, withTimeout } from './util/websocket.util';

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

  protected socket?: WebSocket | WebSocketNode;

  protected info?: StreamerbotInfo;
  protected version?: string;

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

    if (true === this.options.immediate) {
      this.connect().catch(e => console.warn);
    }
  }

  /**
   * Check if the WebSocket connection is authenticated
   */
  public get authenticated(): boolean {
    return !!this.socket && this.socket.readyState === this.socket.OPEN && this._authenticated;
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
        console.debug('Connecting to Streamer.bot WebSocket server at', uri, this._authEnabled ? 'with authentication' : '');

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
          console.warn('Error invoking onError handler', e);
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
        console.debug('Disconnected from Streamer.bot WebSocket server');
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
        this.socket?.addEventListener('message', async (event) => {
          if (!('data' in event) || !event.data || typeof event.data !== 'string') {
            console.debug('Unknown message received', event);
            return;
          }

          try {
            const payload = JSON.parse(event.data);
            if (payload && 'info' in payload) {
              res(payload);
            }
          } catch (e) {
            console.warn('Invalid JSON payload received', event.data);
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
      console.debug('Connected to Streamer.bot WebSocket server', response.info);
      this.info = response.info;
      this.version = response.info.version;
      return;
    }

    throw new Error('Handshake failed (unknown)');
  }

  private async authenticate(data: StreamerbotHelloRequest): Promise<void> {
    if (!this._authEnabled || !this.options.password) {
      console.debug('No password provided for authentication. Checking if auth is enforced for all requests...');
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
      console.debug('Missing authentication payload');
      await this.disconnect();
      throw new Error('Invalid authentication payload');
    }

    console.debug('Authenticating with Streamer.bot WebSocket server...');

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
        void this.getInfo().catch(() => console.debug('Failed to get Streamer.bot info'));
      }
      await this.handshake();

      if (this.version && this.info) {
        console.debug(`Connected to Streamer.bot: v${this.version} (${this.info.name})`);
        this?.options?.onConnect?.(this.info);
      }
    } catch (err) {
      console.warn('Failed handshake with Streamer.bot', err);
      this.options?.onError?.(err instanceof Error ? err : new Error('Failed handshake with Streamer.bot'));
      return await this.disconnect();
    }

    try {
      // Subscribe to initial subscriptions requested in client options
      if (this.options.subscribe === '*' || Object.keys(this.options.subscribe ?? {}).length) {
        await this.subscribe(this.options.subscribe);
      }

      // Subscribe to any events from listeners added with .on
      if (Object.keys(this.subscriptions ?? {}).length) {
        await this.subscribe(this.subscriptions);
      }

      console.debug('Subscribed to requested events', this.subscriptions, this.listeners);
    } catch (e) {
      console.warn('Error subscribing to requested events', e);
    }
  }

  protected onClose(event: CloseEvent): void {
    this._connectController.abort();

    try {
      if ((event.type === 'error' || !event.wasClean) && this.options.onError)
        this?.options?.onError(new Error(getCloseEventReason(event)));
      this?.options?.onDisconnect?.();
    } catch (e) {
      console.warn('Error invoking onDisconnect handler', e);
    }

    // No auto-reconnect, clean up
    if (this._explicitlyClosed || !this.options.autoReconnect) {
      console.debug('Cleaning up...');
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
        console.debug(`Reconnecting... (attempt ${this._retried})`);
        try {
          await this.connect(10_000);
        } catch (e) {
          if (this._retried) console.warn(`Failed to reconnect (attempt ${this._retried - 1})`, e);
        }
      }, Math.min(30_000, this._retried * 1_000));
    }
    else {
      console.debug('Auto-reconnect limit reached. Cleaning up...');
      this.cleanup();
    }
  }

  protected async onMessage(event: MessageEvent): Promise<void> {
    if (!event.data || typeof event.data !== 'string') {
      console.debug('Unknown message received', event);
      return;
    }

    let payload;
    try {
      payload = JSON.parse(event.data);
    } catch (e) {
      console.warn('Invalid JSON payload received', event.data);
      return;
    }

    // onData handler
    try {
      if (this.options.onData) this?.options?.onData(payload);
    } catch (e) {
      console.warn('Error invoking onData handler', e);
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
          console.warn('Error while invoking subscription callback', listener.events);
        }
      }
    }
  }

  protected onError(event: Event): void {
    console.debug('WebSocket onError', event);
    if (!!this.socket && this.socket.readyState !== this.socket.OPEN) {
      this._connectController.abort();
    }
    try {
      this?.options?.onError?.(new Error('WebSocket Error'));
    } catch (e) {
      console.warn('Error invoking onError handler', e);
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

    if (!id) id = generateRequestId();

    const controller = new AbortController();
    const signal = controller.signal;

    this._connectController.signal.addEventListener('abort', () => {
      controller.abort();
    }, { once: true, signal });

    const response = await withTimeout(new Promise<T>((res, rej) => {
      this.socket?.addEventListener('message', (event) => {
        if (!('data' in event) || !event.data || typeof event.data !== 'string') {
          console.debug('Unknown message received', event.data);
          return;
        }

        try {
          const payload = JSON.parse(event?.data);
          if (payload?.id === id) {
            return res(payload);
          }
        } catch (e) {
          console.warn('Invalid JSON payload received', event.data);
          rej(e);
        }
      }, { signal });
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
        console.warn('Error invoking onData handler', e);
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
   * Listener for specific event data
   */
  public async on<TEvent>(
    event: TEvent extends StreamerbotEventName ? TEvent : StreamerbotEventName | '*',
    listener: (data: StreamerbotEventPayload<TEvent extends StreamerbotEventName ? TEvent : StreamerbotEventName>) => void
  ): Promise<void> {
    try {
      if (!event) return;

      // Subscribe to all events
      if (event === '*') {
        const events = StreamerbotEvents as StreamerbotEventsTypeWriteable;
        for (const key in events) {
          if (key === undefined) continue;
          if (!Object.keys(StreamerbotEvents).includes(key)) continue;

          const eventSource = key as keyof typeof events;
          const eventTypes = events[eventSource] ?? [];

          if (eventTypes && eventTypes.length) {
            const set = new Set([...(this.subscriptions[eventSource] ?? []), ...eventTypes]);
            this.subscriptions[eventSource] = [...set] as any[];
          }
        }
      }
      // Handle narrowed event requests
      else {
        // Validate event string
        const [source, type] = event.split('.', 2);
        if (!source || !type || !(source in StreamerbotEvents)) return;

        const eventSource = source as keyof StreamerbotEventsTypeWriteable;
        const eventType = type as
          | StreamerbotEventsTypeWriteable[keyof StreamerbotEventsTypeWriteable][number]
          | '*';
        if (eventType) {
          const set = new Set([
            ...(this.subscriptions[eventSource] ?? []),
            ...(eventType === '*' ? StreamerbotEvents[eventSource] : [eventType]),
          ]);
          this.subscriptions[eventSource] = [...set] as any;
        } else {
          throw new Error('Invalid event type');
        }
      }

      // If WebSocket is connected, subscribe to the event(s)
      if (this.socket && this.socket.readyState === this.socket.OPEN && this.version) {
        await this.subscribe(this.subscriptions);
      }

      this.listeners.push({
        events: [event],
        callback: listener,
      });

      console.debug('Added subscription for', event);
    } catch (e) {
      console.warn('Failed adding subscription for', event, e);
    }
  }

  /**
   * Subscribe to events from your connected Streamer.bot instance
   */
  public async subscribe(events: StreamerbotEventsSubscription | '*'): Promise<SubscribeResponse> {
    // subscribe to all if = '*'
    if (events === '*') {
      events = StreamerbotEvents as StreamerbotEventsTypeWriteable;
    }

    for (const key in events) {
      if (key === undefined) continue;
      if (!Object.keys(StreamerbotEvents).includes(key)) continue;

      const eventSource = key as keyof typeof events;
      const eventTypes = events[eventSource] ?? [];

      if (eventTypes && eventTypes.length) {
        const set = new Set([...(this.subscriptions[eventSource] ?? []), ...eventTypes]);
        this.subscriptions[eventSource] = [...set] as any[];
      }
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
    // unsubscribe from all if = '*'
    if (events === '*') events = StreamerbotEvents as StreamerbotEventsTypeWriteable;

    // remove subscriptions from state
    for (const key in events) {
      if (key === undefined) continue;
      if (!Object.keys(StreamerbotEvents).includes(key)) continue;

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
  public async doAction(
    action: string | Partial<Pick<StreamerbotAction, 'id' | 'name'>>,
    args?: Record<string, any>
  ): Promise<DoActionResponse> {
    let id, name;

    if (typeof action === 'string') {
      id = action;
    } else {
      id = action.id;
      name = action.name;
    }

    return await this.request<DoActionResponse>({
      request: 'DoAction',
      action: {
        id,
        name,
      },
      args,
    });
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
    args?: Record<string, any>
  ): Promise<ExecuteCodeTriggerResponse> {
    return await this.request<ExecuteCodeTriggerResponse>({
      request: 'ExecuteCodeTrigger',
      triggerName,
      args,
    });
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

    if (platform === 'twitch' && options.replyId) Object.assign(req, { replyId: options.replyId });
    if (platform === 'youtube' && options.broadcastId) Object.assign(req, { broadcastId: options.broadcastId });

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