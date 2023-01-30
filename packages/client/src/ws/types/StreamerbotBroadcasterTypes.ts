export type TwitchBroadcaster = {
  broadcastUser: string;
  broadcastUserName: string;
  broadcastUserId: string;
  broadcastIsAffiliate: boolean;
  broadcastIsPartner: boolean;
};

export type YoutubeBroadcaster = {
  broadcastUserName: string;
  broadcastUserId: string;
  broadcastUserProfileImage: string;
};

export type BroadcasterPlatforms = {
  twitch?: TwitchBroadcaster;
  youtube?: YoutubeBroadcaster;
};

export type BroadcasterPlatform = keyof BroadcasterPlatforms;