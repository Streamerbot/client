import { StreamerbotAction } from './streamerbot-action.types';
import {
  BroadcasterPlatform,
  BroadcasterPlatforms
} from './streamerbot-broadcaster.types';
import { StreamerbotCredits } from './streamerbot-credits.types';
import {
  StreamerbotEventsSubscription,
  StreamerbotEventsType
} from './streamerbot-event.types';
import { StreamerbotInfo } from './streamerbot-info.types';
import { StreamerbotViewer } from './streamerbot-viewer.types.ts';

export type StreamerbotResponse<T> = T & {
  id: string;
  status: 'ok' | 'error';
};

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

export type StreamerbotResponseTypes =
  | StreamerbotResponse<unknown>
  | SubscribeResponse
  | UnsubscribeResponse
  | GetEventsResponse
  | GetActionsResponse
  | DoActionResponse
  | GetBroadcasterResponse
  | GetCreditsResponse
  | TestCreditsResponse
  | ClearCreditsResponse
  | GetInfoResponse
  | GetActiveViewersResponse
  | ExecuteCodeTriggerResponse
  | GetCodeTriggersResponse;