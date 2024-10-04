export type StreamerbotRequestName =
  | 'Subscribe'
  | 'UnSubscribe'
  | 'GetEvents'
  | 'GetActions'
  | 'DoAction'
  | 'GetBroadcaster'
  | 'GetMonitoredYouTubeBroadcasts'
  | 'GetCredits'
  | 'TestCredits'
  | 'ClearCredits'
  | 'GetInfo'
  | 'GetActiveViewers'
  | 'ExecuteCodeTrigger'
  | 'GetCodeTriggers';

export type StreamerbotRequest = {
  request: StreamerbotRequestName;
  [key: string]: any;
}