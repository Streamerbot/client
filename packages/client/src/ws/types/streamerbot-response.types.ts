import { StreamerbotAction } from './streamerbot-action.types';
import {
  BroadcasterPlatform,
  BroadcasterPlatforms,
  Emote,
  MonitoredYouTubeBroadcast,
  StreamerbotPlatform
} from './streamerbot-broadcaster.types';
import { StreamerbotCommand } from './streamerbot-command.types';
import { StreamerbotCredits } from './streamerbot-credits.types';
import {
  StreamerbotEventsSubscription,
  StreamerbotEventsType
} from './streamerbot-event.types';
import { StreamerbotGlobalVariable, StreamerbotGlobalVariableName, StreamerbotUserGlobalVariable, StreamerbotVariableValue } from './streamerbot-global.types';
import { StreamerbotInfo } from './streamerbot-info.types';
import { StreamerbotViewer } from './streamerbot-viewer.types.ts';
import { Prettify } from './util.types';

export type StreamerbotResponse<T> = Prettify<T & {
  id: string;
  status: 'ok' | 'error';
}>;

export type SubscribeResponse = StreamerbotResponse<{
  events: StreamerbotEventsSubscription;
}>;

export type UnsubscribeResponse = StreamerbotResponse<{
  events: StreamerbotEventsSubscription;
}>;

export type GetEventsResponse = StreamerbotResponse<{
  events: StreamerbotEventsType;
}>;

export type GetActionsResponse = StreamerbotResponse<{
  actions: Array<StreamerbotAction>;
  count: number;
}>;

export type DoActionResponse = StreamerbotResponse<{}>;

export type GetBroadcasterResponse = StreamerbotResponse<{
  platforms: Partial<BroadcasterPlatforms>;
  connected: Array<BroadcasterPlatform>;
  disconnected: Array<BroadcasterPlatform>;
}>;

export type GetMonitoredYouTubeBroadcastsResponse = StreamerbotResponse<{
  broadcasts: Array<MonitoredYouTubeBroadcast>;
  count: number;
}>

export type GetCreditsResponse = StreamerbotResponse<StreamerbotCredits>;
export type TestCreditsResponse = StreamerbotResponse<StreamerbotCredits>;
export type ClearCreditsResponse = StreamerbotResponse<{}>;

export type GetInfoResponse = StreamerbotResponse<{
  info: StreamerbotInfo;
}>;

export type GetActiveViewersResponse = StreamerbotResponse<{
  viewers: Array<StreamerbotViewer>;
  count: number;
}>;

export type ExecuteCodeTriggerResponse = StreamerbotResponse<unknown>;

export type GetCodeTriggersResponse = StreamerbotResponse<{
  triggers: Array<{
    name: string;
    eventName: string;
    category: string;
  }>;
  count: number;
}>;

export type GetCommandsResponse = StreamerbotResponse<{
  commands: Array<StreamerbotCommand>;
  count: number;
}>

export type TwitchGetEmotesResponse = StreamerbotResponse<{
  emotes: {
    userEmotes: Array<Emote>;
    bttvEmotes: Array<Emote>;
    ffzEmotes: Array<Emote>;
    sevenTvEmotes: Array<Emote>;
  }
}>;

export type YouTubeGetEmotesResponse = StreamerbotResponse<{
  emotes: {
    userEmotes: Array<Emote>;
    bttvEmotes: Array<Emote>;
    sevenTvEmotes: Array<Emote>;
  }
}>;

export type GetGlobalsResponse = StreamerbotResponse<{
  variables: Record<StreamerbotGlobalVariableName, StreamerbotGlobalVariable>;
  count: number;
}>;

export type GetGlobalResponse<T, K = string> = StreamerbotResponse<{
  variables: Record<K extends string ? K : string, StreamerbotGlobalVariable<T, K>>;
  count: number;
}>;

export type GetUserGlobalsResponse<
  T = StreamerbotVariableValue,
  K = string,
  P = StreamerbotPlatform
> = StreamerbotResponse<{
  variables: Record<K extends string ? K : string, StreamerbotUserGlobalVariable<T, K, string, P>>;
  count: number;
}>;

export type GetUserGlobalResponse<
  T = StreamerbotVariableValue,
  K = string,
> = StreamerbotResponse<{
  variables: Record<K extends string ? K : string, StreamerbotGlobalVariable<T, K>>;
  count: number;
}>;

export type StreamerbotResponseTypes =
  | StreamerbotResponse<unknown>
  | SubscribeResponse
  | UnsubscribeResponse
  | GetEventsResponse
  | GetActionsResponse
  | DoActionResponse
  | GetBroadcasterResponse
  | GetMonitoredYouTubeBroadcastsResponse
  | GetCreditsResponse
  | TestCreditsResponse
  | ClearCreditsResponse
  | GetInfoResponse
  | GetActiveViewersResponse
  | ExecuteCodeTriggerResponse
  | GetCodeTriggersResponse
  | GetCommandsResponse
  | TwitchGetEmotesResponse
  | YouTubeGetEmotesResponse;