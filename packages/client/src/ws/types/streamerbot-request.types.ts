export type StreamerbotRequestName =
  | 'Authenticate'
  | 'ClearCredits'
  | 'DoAction'
  | 'ExecuteCodeTrigger'
  | 'GetActions'
  | 'GetActiveViewers'
  | 'GetBroadcaster'
  | 'GetCodeTriggers'
  | 'GetCommands'
  | 'GetCredits'
  | 'GetEvents'
  | 'GetGlobal'
  | 'GetGlobals'
  | 'GetInfo'
  | 'GetMonitoredYouTubeBroadcasts'
  | 'GetUserPronouns'
  | 'KickGetUserGlobal'
  | 'KickGetUserGlobals'
  | 'SendMessage'
  | 'Subscribe'
  | 'TestCredits'
  | 'TrovoGetUserGlobal'
  | 'TrovoGetUserGlobals'
  | 'TwitchGetEmotes'
  | 'TwitchGetUserGlobal'
  | 'TwitchGetUserGlobals'
  | 'UnSubscribe'
  | 'YouTubeGetEmotes'
  | 'YouTubeGetUserGlobal'
  | 'YouTubeGetUserGlobals'
;

export type StreamerbotRequest = {
  request: StreamerbotRequestName;
  [key: string]: any;
}