export type StreamerbotRequestName =
  | 'Authenticate'
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
  | 'SendMessage'
  | 'GetUserPronouns'
;

export type StreamerbotRequest = {
  request: StreamerbotRequestName;
  [key: string]: any;
}