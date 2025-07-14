export type StreamerbotPlatform = 'twitch' | 'youtube' | 'trovo' | 'kick';

export type TwitchBroadcaster = {
  broadcastUser: string;
  broadcastUserName: string;
  broadcastUserId: string;
  broadcastIsAffiliate: boolean;
  broadcastIsPartner: boolean;
};

export type TwitchBot = {
  botUser: string;
  botUserName: string;
  botUserId: string;
}

export type YoutubeBroadcaster = {
  broadcastUserName: string;
  broadcastUserId: string;
  broadcastUserProfileImage: string;
};

export type YouTubeBot = {
  botUserName: string;
  botUserId: string;
  botUserProfileImage: string;
}

export type TrovoBroadcaster = {
  broadcasterLogin: string;
  broadcasterUserName: string;
  broadcasterUserId: string;
  broadcasterProfileUrl: string;
};

export type TrovoBot = {
  botLogin: string;
  botUserName: string;
  botUserId: string;
  botProfileUrl: string;
}

export type VStreamBroadcaster = {
  broadcasterLogin: string;
  broadcasterUserName: string;
  broadcasterUserId: string;
  broadcasterProfileUrl: string;
};

export type VStreamBot = {
  botLogin: string;
  botUserName: string;
  botUserId: string;
  botProfileUrl: string;
}

export type BroadcasterPlatforms = {
  twitch?: TwitchBroadcaster & TwitchBot;
  youtube?: YoutubeBroadcaster & YouTubeBot;
  trovo?: TrovoBroadcaster & TrovoBot;
  vstream?: VStreamBroadcaster & VStreamBot;
};

export type BroadcasterPlatform = keyof BroadcasterPlatforms;

export type MonitoredYouTubeBroadcast = {
  actualEndTime: string;
  actualStartTime: string;
  categoryId: string;
  channelId: string;
  description: string;
  id: string;
  liveChatId: string;
  privacy: 'public' | 'private' | 'unlisted' | (string & {});
  publishedAt: string;
  scheduledEndTime: string;
  scheduledStartTime: string;
  status: 'ready' | 'complete' | (string & {});
  title: string;
  tags: Array<string>;
  defaultLanguage: string;
  defaultAudioLanguage: string;
}

export type Emote = {
  type: string;
  name: string;
  imageUrl: string;
}