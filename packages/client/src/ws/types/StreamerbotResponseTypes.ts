import { StreamerbotAction } from './StreamerbotActionTypes';
import {
  BroadcasterPlatform,
  BroadcasterPlatforms
} from './StreamerbotBroadcasterTypes';
import { StreamerbotCredits } from './StreamerbotCreditsTypes';
import {
  StreamerbotEventsSubscription,
  StreamerbotEventsType
} from './StreamerbotEventTypes';
import { StreamerbotInfo } from './StreamerbotInfoTypes';
import { StreamerbotViewer } from './StreamerbotViewerTypes';

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