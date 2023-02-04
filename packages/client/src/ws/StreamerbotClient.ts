import WebSocket from 'isomorphic-ws';
import { StreamerbotAction, StreamerbotInfo } from './types';
import {
  StreamerbotEventName,
  StreamerbotEvents,
  StreamerbotEventSource,
  StreamerbotEventsSubscription,
  StreamerbotEventsTypeWriteable
} from './types/StreamerbotEventTypes';
import {
  ClearCreditsResponse,
  DoActionResponse,
  GetActionsResponse,
  GetActiveViewersResponse,
  GetBroadcasterResponse,
  GetCreditsResponse,
  GetEventsResponse,
  GetInfoResponse,
  StreamerbotResponseTypes,
  SubscribeResponse,
  TestCreditsResponse,
  UnsubscribeResponse
} from './types/StreamerbotResponseTypes';
import { generateRequestId, getCloseEventReason } from './util/ws-utils';

export type StreamerbotClientOptions = {
  host: string;
  port: number;
  endpoint: string;
  immediate: boolean;
  autoReconnect: boolean;
  retries: number;
  subscribe: StreamerbotEventsSubscription | '*';
  onConnect?: (data: StreamerbotInfo) => void;
  onDisconnect?: () => void;
  onError?: (error: Error) => void;
  onData?: (data: any) => void;
};

export const DefaultStreamerbotClientOptions: StreamerbotClientOptions = {
  host: '127.0.0.1',
  port: 8080,
  endpoint: '/',
  immediate: true,
  autoReconnect: true,
  retries: -1,
  subscribe: {},
} as const;

export class StreamerbotClient {
  private readonly options: StreamerbotClientOptions;

  protected socket?: WebSocket;
  protected listeners: Array<{
    events: StreamerbotEventName[];
    callback: (data: unknown) => void;
  }> = [];
  protected subscriptions: StreamerbotEventsSubscription = {};

  protected explicitlyClosed = false;
  protected retried = 0;

  public constructor(
    options: Partial<StreamerbotClientOptions> = DefaultStreamerbotClientOptions
  ) {
    this.options = { ...DefaultStreamerbotClientOptions, ...options };

    if (true === this.options.immediate) {
      this.connect();
    }
  }

  /**
   * Connect to a Streamer.bot WebSocket server
   */
  public async connect(): Promise<void> {
    this.disconnect();
    this.explicitlyClosed = false;

    try {
      this.socket = new WebSocket(
        `ws://${this.options.host}:${this.options.port}${this.options.endpoint}`
      );
      this.socket.onopen = this.onOpen.bind(this);
      this.socket.onclose = this.onClose.bind(this);
      this.socket.onerror = this.onError.bind(this);
      this.socket.onmessage = this.onMessage.bind(this);
    } catch (error) {
      this.disconnect();

      try {
        this?.options?.onError?.(error as Error);
      } catch (e) {
        console.error('Error invoking onError handler', e);
      }

      throw error;
    }
  }

  /**
   * Disconnect Streamer.bot WebSocket
   */
  public disconnect(code: number = 1000): void {
    if (!this.socket || this.socket.readyState === this.socket.CLOSED) {
      return;
    }

    this.socket.close(code);
    this.explicitlyClosed = true;

    try {
      this?.options?.onDisconnect?.();
    } catch (e) {
      console.error('Error invoking onDisconnect handler', e);
    }
  }

  protected async onOpen(): Promise<void> {
    this.retried = 0;

    try {
      if (this.options.subscribe) {
        await this.subscribe(this.options.subscribe);
      }
      const infoResponse = await this.getInfo();
      this?.options?.onConnect?.(infoResponse.info);
    } catch (e) {
      console.error('Error invoking onOpen handler', e);
    }
  }

  protected onClose(event: CloseEvent): void {
    try {
      if ((event.type === 'error' || !event.wasClean) && this.options.onError)
        this?.options?.onError(new Error(getCloseEventReason(event)));
      this?.options?.onDisconnect?.();
    } catch (e) {
      console.error('Error invoking onDisconnect handler', e);
    }

    if (!this.explicitlyClosed && this.options.autoReconnect) {
      this.retried += 1;

      if (
        typeof this.options.retries === 'number' &&
        (this.options.retries < 0 || this.retried < this.options.retries)
      )
        setTimeout(() => {
          console.log(`Reconnecting... (attempt ${this.retried})`);
          this.connect();
        }, 1000);
      else this.cleanup();
    } else {
      console.log(
        'Explicitly closed, cleaning up...',
        this.explicitlyClosed,
        this.options.autoReconnect
      );
      this.cleanup();
    }
  }

  protected onMessage(data: MessageEvent): void {
    if (data?.data && typeof data.data === 'string') {
      const payload = JSON.parse(data.data);

      // onData handler
      try {
        if (this.options.onData) this?.options?.onData(payload);
      } catch (e) {
        console.error('Error invoking onData handler', e);
      }

      // any listeners called from `.on`
      if (payload?.event?.source && payload?.event?.type) {
        for (const listener of this.listeners) {
          if (!listener.events?.length) continue;
          if (
            !listener.events.find((event) => {
              return (
                event === `${payload?.event?.source}.${payload?.event?.type}` ||
                (event.split('.', 2)[1] === '*' &&
                  event.split('.', 2)[0] === payload?.event?.source)
              );
            })
          )
            continue;

          try {
            listener.callback(payload);
          } catch (e) {
            console.error('Error calling listener callback', listener.events);
          }
        }
      }
    } else {
      console.debug('unknown message', data);
    }
  }

  protected onError(event: Event): void {
    console.error('WebSocket Error', event);
    try {
      this?.options?.onError?.(new Error('WebSocket Error'));
    } catch (e) {
      console.error('Error invoking onError handler', e);
    }
  }

  protected cleanup(): void {
    if (!this.socket) return;

    this.socket.onopen = undefined;
    this.socket.onclose = undefined;
    this.socket.onerror = undefined;
    this.socket.onmessage = undefined;
    this.listeners = [];
    this.socket = undefined;
    this.retried = 0;
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
    request: any,
    id: string = '',
    timeout: number = 5000
  ): Promise<T> {
    if (!id) id = generateRequestId();

    const controller = new AbortController();
    const signal = controller.signal;
    let timer: NodeJS.Timeout;

    return await Promise.race([
      new Promise<T>(
        (res, rej) =>
          (timer = setTimeout(() => {
            controller.abort();
            return rej({
              message: 'WebSocket request timeout exceeded',
              request,
            });
          }, timeout))
      ),
      new Promise<T>((res, rej) => {
        // attach event listener for our specific request id
        this.socket?.addEventListener(
          'message',
          (data: any) => {
            try {
              const payload = JSON.parse(data?.data);
              if (payload?.status === 'ok' && payload?.id === id) {
                const response = {
                  event: {
                    source: 'Request',
                    type: request.request ?? 'Unknown',
                  },
                  ...payload,
                };

                // onData handler
                try {
                  if (this.options.onData) {
                    this?.options?.onData(response);
                  }
                } catch (e) {
                  console.error('Error invoking onData handler', e);
                }
                res(response);
              }
            } catch (e) {
              rej(e);
            }
          },
          { signal }
        );

        // emit our request
        this.send({ ...request, id });
      }),
    ]).finally(() => {
      // cleanup
      clearTimeout(timer);
      controller.abort();
    });
  }

  /**
   * Listener for specific event data
   */
  public async on(
    events: StreamerbotEventName | StreamerbotEventName[],
    listener: (data: unknown) => void
  ): Promise<void> {
    try {
      if (!Array.isArray(events)) events = [events];
      if (!events?.length) return;

      // make sure we are subscribed to the requested events
      let updateSubscriptions = false;
      for (const event of events) {
        const [source, type] = event.split('.', 2) ?? [null, null];
        if (!source || !type || !(source in StreamerbotEvents)) continue;

        const eventSource = source as keyof StreamerbotEventsTypeWriteable;
        const eventType = type as
          | StreamerbotEventsTypeWriteable[keyof StreamerbotEventsTypeWriteable][number]
          | '*';
        if (eventType) {
          updateSubscriptions = true;
          const set = new Set([
            ...(this.subscriptions[eventSource] ?? []),
            ...(eventType === '*'
              ? StreamerbotEvents[eventSource]
              : [eventType]),
          ]);
          this.subscriptions[eventSource] = [...set] as any[];
        }
      }

      if (updateSubscriptions) {
        await this.subscribe(this.subscriptions);
      }

      this.listeners.push({
        events,
        callback: listener,
      });
    } catch (e) {
      console.error('Failed adding event listener', events);
    }
  }

  /**
   * Subscribe to events from your connected Streamer.bot instance
   */
  public async subscribe(
    events: StreamerbotEventsSubscription | '*'
  ): Promise<SubscribeResponse> {
    // subscribe to all if = '*'
    if (events === '*')
      events = StreamerbotEvents as StreamerbotEventsTypeWriteable;

    for (const key in events) {
      if (key === undefined) continue;
      if (!Object.keys(StreamerbotEvents).includes(key)) continue;

      const eventSource = key as keyof typeof events;
      const eventTypes = events[eventSource] ?? [];

      if (eventTypes && eventTypes.length) {
        const set = new Set([
          ...(this.subscriptions[eventSource] ?? []),
          ...eventTypes,
        ]);
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
    if (events === '*')
      events = StreamerbotEvents as StreamerbotEventsTypeWriteable;

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
              (this.subscriptions[eventSource] = this.subscriptions[
                eventSource
              ] as any[])?.filter((evt: any) => eventType !== evt);
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
}
