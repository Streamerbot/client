export const StreamerbotEvents = {
  Application: ['ActionAdded', 'ActionUpdated', 'ActionDeleted'],
  Command: ['Message', 'Whisper', 'MessageCooldown', 'BotWhisper'],
  DonorDrive: ['Donation', 'ProfileUpdated'],
  FileWatcher: ['Changed', 'Created', 'Deleted', 'Renamed'],
  General: ['Custom'],
  HypeRate: ['HeartRatePulse'],
  Kofi: [
    'Donation',
    'Subscription',
    'Resubscription',
    'ShopOrder',
    'Commission',
  ],
  Midi: ['Message'],
  Misc: ['TimedAction', 'PyramidSuccess', 'PyramidBroken'],
  Obs: ['Connected', 'Disconnected'],
  Patreon: [
    'FollowCreated',
    'FollowDeleted',
    'PledgeCreated',
    'PledgeUpdated',
    'PledgeDeleted',
  ],
  Pulsoid: ['HeartRatePulse'],
  Quote: ['Added', 'Show'],
  Raw: ['Action', 'SubAction', 'ActionCompleted'],
  Shopify: ['OrderCreated', 'OrderPaid'],
  SpeechToText: ['Dictation', 'Command'],
  StreamElements: ['Tip', 'Merch'],
  Streamlabs: ['Donation', 'Merchandise'],
  TipeeeStream: ['Donation'],
  TreatStream: ['Treat'],
  Twitch: [
    'Follow',
    'Cheer',
    'Sub',
    'ReSub',
    'GiftSub',
    'GiftBomb',
    'Raid',
    'HypeTrainStart',
    'HypeTrainUpdate',
    'HypeTrainLevelUp',
    'HypeTrainEnd',
    'RewardRedemption',
    'RewardCreated',
    'RewardUpdated',
    'RewardDeleted',
    'CommunityGoalContribution',
    'CommunityGoalEnded',
    'StreamUpdate',
    'Whisper',
    'FirstWord',
    'SubCounterRollover',
    'BroadcastUpdate',
    'StreamUpdateGameOnConnect',
    'PresentViewers',
    'PollCreated',
    'PollUpdated',
    'PollCompleted',
    'PredictionCreated',
    'PredictionUpdated',
    'PredictionCompleted',
    'PredictionCanceled',
    'PredictionLocked',
    'ChatMessage',
    'ChatMessageDeleted',
    'UserTimedOut',
    'UserBanned',
    'Announcement',
    'AdRun',
    'BotWhisper',
    'CharityDonation',
    'CharityCompleted',
    'CoinCheer',
    'ShoutoutCreated',
    'UserUntimedOut',
    'CharityStarted',
    'CharityProgress',
    'GoalBegin',
    'GoalProgress',
    'GoalEnd',
    'ShieldModeBegin',
    'ShieldModeEnd',
    'AdMidRoll',
  ],
  WebsocketClient: ['Open', 'Close', 'Message'],
  WebsocketCustomServer: ['Open', 'Close', 'Message'],
  YouTube: [
    'BroadcastStarted',
    'BroadcastEnded',
    'Message',
    'MessageDeleted',
    'UserBanned',
    'SuperChat',
    'SuperSticker',
    'NewSponsor',
    'MemberMileStone',
    'NewSponsorOnlyStarted',
    'NewSponsorOnlyEnded',
    'StatisticsUpdated',
    'BroadcastUpdated',
    'MembershipGift',
    'GiftMembershipReceived',
    'FirstWords',
    'PresentViewers',
  ],
} as const;

type DeepWriteable<T> = { -readonly [P in keyof T]: DeepWriteable<T[P]> };
type DeepPartial<T> = T extends object ? {
  -readonly [P in keyof T]: DeepPartial<T[P]>;
} : T;

export type StreamerbotEventsType = typeof StreamerbotEvents;
export type StreamerbotEventsTypeWriteable = DeepWriteable<StreamerbotEventsType>;
export type StreamerbotEventSource = keyof typeof StreamerbotEvents;

type StreamerbotEventSourceValue<T extends StreamerbotEventSource> =
  T extends StreamerbotEventSource ?
  `${T}.${StreamerbotEventsType[T][number] | '*'}` : never;

export type StreamerbotEventName =
  `${StreamerbotEventSourceValue<StreamerbotEventSource>}`;

type StreamerbotEventsSubscriptionType<T extends StreamerbotEventSource> =
  T extends StreamerbotEventSource ? Array<StreamerbotEventsType[T][number]>: never;
export type StreamerbotEventsSubscription = Partial<{
  [P in StreamerbotEventSource]: StreamerbotEventsSubscriptionType<P>;
}>;