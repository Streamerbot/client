import { StreamerbotEvents, TwitchEvents } from './events';
import { DeepWriteable, JsonObject } from './util.types';

export type StreamerbotEventsType = typeof StreamerbotEvents;
export type StreamerbotEventsTypeWriteable = DeepWriteable<StreamerbotEventsType>;
export type StreamerbotEventSource = keyof typeof StreamerbotEvents;
export type StreamerbotEventType<TSource = StreamerbotEventSource> = StreamerbotEventsType[TSource extends StreamerbotEventSource ? TSource : StreamerbotEventSource][number];

type StreamerbotEventSourceValue<T extends StreamerbotEventSource> =
  T extends StreamerbotEventSource ? `${T}.${StreamerbotEventsType[T][number] | '*'}` : string;

export type StreamerbotEventName = `${StreamerbotEventSourceValue<StreamerbotEventSource>}`;

type StreamerbotEventsSubscriptionType<T extends StreamerbotEventSource> =
  T extends StreamerbotEventSource ? Array<StreamerbotEventsType[T][number]> : string[];
export type StreamerbotEventsSubscription = Partial<{
  [P in StreamerbotEventSource]: StreamerbotEventsSubscriptionType<P>;
}>;

export type StreamerbotEventPayload<TEvent extends StreamerbotEventName> =
  (TEvent extends `${infer Source extends StreamerbotEventSource}.${infer Type extends StreamerbotEventType | '*'}`
  ? Type extends StreamerbotEventType
    ? {
      event: { source: Source; type: Type };
      data: StreamerbotEventsBySource[Source][Type];
    } : {
      event: { source: Source; type: StreamerbotEventType<Source> };
      data: StreamerbotEventsBySource[Source][StreamerbotEventType<Source>];
    }
  : {
    event: { source: string; type: string };
    data: unknown;
  }) & {
    timeStamp: string
  };

export type StreamerbotEventData<TEvent extends StreamerbotEventName> =
  TEvent extends `${infer Source extends StreamerbotEventSource}.${infer Type extends StreamerbotEventType | '*'}`
    ? Type extends '*' ? StreamerbotEventsBySource[Source][StreamerbotEventType<Source>] : StreamerbotEventsBySource[Source][Type]
    : unknown;

/**
 * Fallback type for unknown Streamer.bot event data
 */
export type UnknownEventData = JsonObject | undefined;

/**
 * All possible Streamer.bot events indexed by source and type
 */
export type StreamerbotEventsBySource = VerifyEventSources<{
  Application: any;
  Command: any;
  CrowdControl: any;
  Custom: any;
  DonorDrive: any;
  Elgato: any;
  FileTail: any;
  FileWatcher: any;
  Fourthwall: any;
  General: any;
  Group: any;
  HotKey: any;
  HypeRate: any;
  Inputs: any;
  Kick: any;
  Kofi: any;
  MeldStudio: any;
  Midi: any;
  Misc: any;
  Obs: any;
  Pallygg: any;
  Patreon: any;
  Pulsoid: any;
  Quote: any;
  Raw: any;
  Shopify: any;
  SpeakerBot: any;
  SpeechToText: any;
  StreamDeck: any;
  StreamElements: any;
  StreamerBot: any;
  StreamerBotRemote: any;
  Streamlabs: any;
  StreamlabsDesktop: any;
  System: any;
  ThrowingSystem: any;
  TipeeeStream: any;
  TreatStream: any;
  Trovo: any;
  Twitch: TwitchEvents;
  VoiceMod: any;
  VStream: any;
  VTubeStudio: any;
  WebsocketClient: any;
  WebsocketCustomServer: any;
  YouTube: any;
}>;

/**
 * Type guard for Streamer.bot event sources
 *
 * This will check that all Streamer.bot event sources are defined as types
 */
type EventSourceGuard<TSource extends StreamerbotEventSource> = Record<TSource, EventTypeGuard<TSource> | unknown>;
export type VerifyEventSources<T extends EventSourceGuard<StreamerbotEventSource> &
    { [U in Exclude<keyof T, StreamerbotEventType>]: unknown }> = T;

/**
 * Type guard for Streamer.bot event types
 *
 * This will check that all possible event types are defined within a given event source
 */
type EventTypeGuard<TSource> = Record<StreamerbotEventType<TSource>, JsonObject | undefined>;
export type VerifyEventTypes<TSource, T extends EventTypeGuard<TSource> &
    { [U in Exclude<keyof T, StreamerbotEventType<TSource>>]: never }> = T;