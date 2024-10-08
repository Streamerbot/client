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
  | 'GetCodeTriggers'
  | 'GetCommands'
  | 'TwitchGetEmotes'
  | 'YouTubeGetEmotes'
  | 'GetGlobals'
  | 'GetGlobal'
  | 'TwitchGetUserGlobals'
  | 'TwitchGetUserGlobal'
  | 'YouTubeGetUserGlobals'
  | 'YouTubeGetUserGlobal'
  | 'TrovoGetUserGlobals'
  | 'TrovoGetUserGlobal'
;

export type StreamerbotRequest = {
  request: StreamerbotRequestName;
  [key: string]: any;
}