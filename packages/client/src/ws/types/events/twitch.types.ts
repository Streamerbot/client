import { UnknownEventData, VerifyEventTypes } from '../streamerbot-event.types';

export type TwitchEvents = VerifyEventTypes<
  'Twitch',
  {
    AdRun: TwitchAdRun;
    Announcement: TwitchAnnouncement;
    AutomaticRewardRedemption: UnknownEventData;
    AutoModMessageHeld: UnknownEventData;
    AutoModMessageUpdate: UnknownEventData;
    BetterTTVEmoteAdded: UnknownEventData;
    BetterTTVEmoteRemoved: UnknownEventData;
    BitsBadgeTier: UnknownEventData;
    BlockedTermsAdded: UnknownEventData;
    BlockedTermsDeleted: UnknownEventData;
    BotEventSubConnected: undefined;
    BotEventSubDisconnected: undefined;
    BotWhisper: TwitchBotWhisper;
    BroadcasterAuthenticated: undefined;
    BroadcasterChatConnected: undefined;
    BroadcasterChatDisconnected: undefined;
    BroadcasterEventSubConnected: undefined;
    BroadcasterEventSubDisconnected: undefined;
    BroadcastUpdate: UnknownEventData;
    CharityCompleted: TwitchCharityCompleted;
    CharityDonation: TwitchCharityDonation;
    CharityProgress: TwitchCharityProgress;
    CharityStarted: TwitchCharityStarted;
    ChatCleared: TwitchChatCleared;
    ChatEmoteModeOff: undefined;
    ChatEmoteModeOn: undefined;
    ChatFollowerModeChanged: undefined;
    ChatFollowerModeOff: undefined;
    ChatFollowerModeOn: undefined;
    ChatMessage: TwitchChatMessage;
    ChatMessageDeleted: TwitchChatMessageDeleted;
    ChatSlowModeChanged: undefined;
    ChatSlowModeOff: undefined;
    ChatSlowModeOn: undefined;
    ChatSubscriberModeOff: undefined;
    ChatSubscriberModeOn: undefined;
    ChatUniqueModeOff: undefined;
    ChatUniqueModeOn: undefined;
    Cheer: TwitchCheer;
    CoinCheer: UnknownEventData;
    CommunityGoalContribution: TwitchCommunityGoalContribution;
    CommunityGoalEnded: TwitchCommunityGoalEnded;
    FirstWord: TwitchFirstWord;
    Follow: TwitchFollow;
    GiftBomb: undefined;
    GiftPaidUpgrade: UnknownEventData;
    GiftSub: TwitchGiftSub;
    GoalBegin: undefined;
    GoalEnd: undefined;
    GoalProgress: UnknownEventData;
    GuestStarGuestUpdate: undefined;
    GuestStarSessionBegin: undefined;
    GuestStarSessionEnd: undefined;
    GuestStarSettingsUpdate: undefined;
    GuestStarSlotUpdate: UnknownEventData;
    HypeChat: UnknownEventData;
    HypeChatLevel: UnknownEventData;
    HypeTrainEnd: TwitchHypeTrainEnd;
    HypeTrainLevelUp: TwitchHypeTrainLevelUp;
    HypeTrainStart: TwitchHypeTrainStart;
    HypeTrainUpdate: TwitchHypeTrainUpdate;
    ModeratorAdded: undefined;
    ModeratorRemoved: undefined;
    PayItForward: UnknownEventData;
    PermittedTermsAdded: UnknownEventData;
    PermittedTermsDeleted: UnknownEventData;
    PollArchived: UnknownEventData;
    PollCompleted: TwitchPollCompleted;
    PollCreated: TwitchPollCreated;
    PollTerminated: undefined;
    PollUpdated: TwitchPollUpdated;
    PowerUp: UnknownEventData;
    PredictionCanceled: TwitchPredictionCanceled;
    PredictionCompleted: TwitchPredictionCompleted;
    PredictionCreated: TwitchPredictionCreated;
    PredictionLocked: TwitchPredictionLocked;
    PredictionUpdated: TwitchPredictionUpdated;
    PresentViewers: UnknownEventData;
    PrimePaidUpgrade: UnknownEventData;
    PyramidBroken: TwitchPyramidBroken;
    PyramidSuccess: TwitchPyramidSuccess;
    Raid: TwitchRaid;
    RaidCancelled: UnknownEventData;
    RaidSend: UnknownEventData;
    RaidStart: UnknownEventData;
    ReSub: TwitchReSub;
    RewardCreated: TwitchRewardCreated;
    RewardDeleted: TwitchRewardDeleted;
    RewardRedemption: TwitchRewardRedemption;
    RewardRedemptionUpdated: TwitchRewardRedemptionUpdated;
    RewardUpdated: TwitchRewardUpdated;
    SevenTVEmoteAdded: UnknownEventData;
    SevenTVEmoteRemoved: UnknownEventData;
    SharedChatAnnouncement: UnknownEventData;
    SharedChatCommunitySubGift: UnknownEventData;
    SharedChatGiftPaidUpgrade: UnknownEventData;
    SharedChatMessageDeleted: UnknownEventData;
    SharedChatPayItForward: UnknownEventData;
    SharedChatPrimePaidUpgrade: UnknownEventData;
    SharedChatRaid: UnknownEventData;
    SharedChatResub: UnknownEventData;
    SharedChatSessionBegin: UnknownEventData;
    SharedChatSessionEnd: UnknownEventData;
    SharedChatSessionUpdate: UnknownEventData;
    SharedChatSub: UnknownEventData;
    SharedChatSubGift: UnknownEventData;
    SharedChatUserBanned: UnknownEventData;
    SharedChatUserTimedout: UnknownEventData;
    SharedChatUserUnbanned: UnknownEventData;
    SharedChatUserUntimedout: UnknownEventData;
    ShieldModeBegin: TwitchShieldModeBegin;
    ShieldModeEnd: TwitchShieldModeEnd;
    ShoutoutCreated: TwitchShoutoutCreated;
    ShoutoutReceived: undefined;
    StreamOffline: UnknownEventData;
    StreamOnline: UnknownEventData;
    StreamUpdate: TwitchStreamUpdate;
    StreamUpdateGameOnConnect: UnknownEventData;
    Sub: TwitchSub;
    SubCounterRollover: UnknownEventData;
    SuspiciousUserUpdate: UnknownEventData;
    UnbanRequestApproved: UnknownEventData;
    UnbanRequestCreated: UnknownEventData;
    UnbanRequestDenied: UnknownEventData;
    UpcomingAd: undefined;
    UserBanned: TwitchUserBanned;
    UserTimedOut: TwitchUserTimedOut;
    UserUnbanned: UnknownEventData;
    UserUntimedOut: UnknownEventData;
    ViewerCountUpdate: TwitchViewerCountUpdate;
    VipAdded: undefined;
    VipRemoved: undefined;
    WarnedUser: UnknownEventData;
    WarningAcknowledged: UnknownEventData;
    WatchStreak: UnknownEventData;
    Whisper: TwitchWhisper;
  }
>;

export type TwitchEmote = {
  bits: number;
  color: string;
  type: string;
  name: string;
  startIndex: number;
  endIndex: number;
  imageUrl: string;
};

export type TwitchBadge = {
  name: string;
  version: string;
  imageUrl: string;
};

// Follow
export type TwitchFollow = {
  user_id: string;
  user_login: string;
  user_name: string;
  followed_at: string;
};

// Cheer
export type TwitchCheer = {
  internal: boolean;
  msgId: string;
  userId: string;
  username: string;
  role: number;
  subscriber: boolean;
  displayName: string;
  channel: string;
  message: string;
  isHighlighted: boolean;
  isMe: boolean;
  isCustomReward: boolean;
  isAnonymous: boolean;
  isReply: boolean;
  bits: number;
  firstMessage: boolean;
  hasBits: boolean;
  emotes: Array<TwitchEmote>;
  cheerEmotes: Array<TwitchEmote>;
  badges: Array<TwitchBadge>;
  monthsSubscribed: number;
  isTest: boolean;
};

// Raid
export type TwitchRaid = {
  from_broadcaster_user_id: string;
  from_broadcaster_user_login: string;
  from_broadcaster_user_name: string;
  to_broadcaster_user_id: string;
  to_broadcaster_user_login: string;
  to_broadcaster_user_name: string;
  viewers: number;
};

// Stream Update
export type TwitchStreamUpdate = {
  channelId: string;
  channel: string;
  status: string;
  oldStatus: string;
  oldGame: {
    id: string;
    name: string;
  };
  game: {
    id: string;
    name: string;
  };
};

// Whisper
export type TwitchWhisper = {
  message: {
    msgId: string;
    userId: string;
    username: string;
    displayName: string;
    message: string;
    emotes: Array<TwitchEmote>;
    badges: Array<TwitchBadge>;
  };
};

// Bot Whisper
export type TwitchBotWhisper = {
  message: {
    msgId: string;
    userId: string;
    username: string;
    displayName: string;
    message: string;
    emotes: Array<TwitchEmote>;
    badges: Array<TwitchBadge>;
  };
};

// First Words
export type TwitchFirstWord = {
  message: {
    internal: boolean;
    msgId: string;
    userId: string;
    username: string;
    role: number;
    subscriber: boolean;
    displayName: string;
    color: string;
    channel: string;
    message: string;
    isHighlighted: boolean;
    isMe: boolean;
    isCustomReward: boolean;
    isAnonymous: boolean;
    isReply: boolean;
    bits: number;
    firstMessage: boolean;
    hasBits: boolean;
    emotes: Array<TwitchEmote>;
    cheerEmotes: Array<TwitchEmote>;
    badges: Array<TwitchBadge>;
    monthsSubscribed: number;
    isTest: boolean;
  };
};

// Chat Message
export type TwitchChatMessage = {
  message: {
    internal: boolean;
    msgId: string;
    userId: string;
    username: string;
    role: number;
    subscriber: boolean;
    displayName: string;
    color: string;
    channel: string;
    message: string;
    isHighlighted: boolean;
    isMe: boolean;
    isCustomReward: boolean;
    isAnonymous: boolean;
    isReply: boolean;
    bits: number;
    firstMessage: boolean;
    hasBits: boolean;
    emotes: Array<TwitchEmote>
    cheerEmotes: Array<any>;
    badges: Array<TwitchBadge>;
    monthsSubscribed: number;
    isTest: boolean;
  };
};

// Ad Run
export type TwitchAdRun = {
  length_seconds: number;
  timestamp: string;
  is_automatic: boolean;
  requester_user_id: string;
  requester_user_login: string;
  requester_user_name: string;
};

// Ad Mid Roll
export type TwitchAdMidRoll = {
  type: string;
  jitterTime: number;
  warmupTime: number;
  commercialId: string;
};

// Sub
export type TwitchSub = {
  subTier: number;
  emotes: Array<any>;
  badges: Array<any>;
  message: string;
  userId: string;
  userName: string;
  displayName: string;
  role: number;
  isTest: boolean;
};

// ReSub
export type TwitchReSub = {
  cumulativeMonths: number;
  shareStreak: boolean;
  streakMonths: number;
  subTier: number;
  emotes: Array<any>;
  badges: Array<any>;
  message: string;
  userId: string;
  userName: string;
  displayName: string;
  role: number;
  isTest: boolean;
};

// Gift Sub
export type TwitchGiftSub = {
  isAnonymous: boolean;
  totalSubsGifted: number;
  cumulativeMonths: number;
  monthsGifted: number;
  fromSubBomb: boolean;
  subBombCount: number;
  recipientUserId: string;
  recipientUsername: string;
  recipientDisplayName: string;
  subTier: number;
  emotes: Array<any>;
  badges: Array<any>;
  userId: string;
  userName: string;
  displayName: string;
  role: number;
  isTest: boolean;
};

// Hype Train Start
export type TwitchHypeTrainStart = {
  level: number;
  progress: number;
  last_contribution: {
    user_id: string;
    user_login: string;
    user_name: string;
    total: number;
  };
  expires_at: string;
  isTest: boolean;
  id: string;
  total: number;
  goal: number;
  top_contributions: Array<{
    user_id: string;
    user_login: string;
    user_name: string;
    type: string;
    total: number;
  }>;
  started_at: string;
};

// Hype Train Update
export type TwitchHypeTrainUpdate = {
  level: number;
  progress: number;
  last_contribution: {
    user_id: string;
    user_login: string;
    user_name: string;
    total: number;
  };
  expires_at: string;
  isTest: boolean;
  id: string;
  total: number;
  goal: number;
  top_contributions: Array<{
    user_id: string;
    user_login: string;
    user_name: string;
    type: string;
    total: number;
  }>;
  started_at: string;
};

// Hype Train Level Up
export type TwitchHypeTrainLevelUp = {
  level: number;
  progress: number;
  last_contribution: {
    user_id: string;
    user_login: string;
    user_name: string;
    total: number;
  };
  expires_at: string;
  isTest: boolean;
  id: string;
  total: number;
  goal: number;
  top_contributions: Array<{
    user_id: string;
    user_login: string;
    user_name: string;
    type: string;
    total: number;
  }>;
  started_at: string;
};

// Hype Train End
export type TwitchHypeTrainEnd = {
  level: number;
  ended_at: string;
  cooldown_ends_at: string;
  isTest: boolean;
  id: string;
  total: number;
  goal: number;
  top_contributions: Array<{
    user_id: string;
    user_login: string;
    user_name: string;
    type: string;
    total: number;
  }>;
  started_at: string;
};

// Reward Redemption
export type TwitchRewardRedemption = {
  id: string;
  user_id: string;
  user_login: string;
  user_name: string;
  user_input: string;
  status: string;
  reward: {
    id: string;
    title: string;
    cost: number;
    prompt: string;
  };
  redeemed_at: string;
};

// Reward Redemption Updated
export type TwitchRewardRedemptionUpdated = {
  id: string;
  user_id: string;
  user_login: string;
  user_name: string;
  user_input: string;
  status: string;
  reward: {
    id: string;
    title: string;
    cost: number;
    prompt: string;
  };
  redeemed_at: string;
};

// Reward Created
export type TwitchRewardCreated = {
  id: string;
  name: string;
  prompt: string;
  group: string;
  cost: number;
  userInput: boolean;
  persistCounter: boolean;
  persistUserCounter: boolean;
  backgroundColor: string;
};

// Reward Updated
export type TwitchRewardUpdated = {
  id: string;
  is_enabled: boolean;
  is_paused: boolean;
  is_in_stock: boolean;
  title: string;
  cost: number;
  prompt: string;
  is_user_input_required: boolean;
  should_redemptions_skip_request_queue: boolean;
  cooldown_expires_at: string;
  max_per_stream: {
    is_enabled: boolean;
    value: number;
  };
  max_per_user_per_stream: {
    is_enabled: boolean;
    value: number;
  };
  global_cooldown: {
    is_enabled: boolean;
    seconds: number;
  };
  background_color: string;
  default_image: {
    url_1x: string;
    url_2x: string;
    url_4x: string;
  };
};

// Reward Deleted
export type TwitchRewardDeleted = {
  id: string;
  is_enabled: boolean;
  is_paused: boolean;
  is_in_stock: boolean;
  title: string;
  cost: number;
  prompt: string;
  is_user_input_required: boolean;
  should_redemptions_skip_request_queue: boolean;
  max_per_stream: {
    is_enabled: boolean;
    value: number;
  };
  max_per_user_per_stream: {
    is_enabled: boolean;
    value: number;
  };
  global_cooldown: {
    is_enabled: boolean;
    seconds: number;
  };
  background_color: string;
  default_image: {
    url_1x: string;
    url_2x: string;
    url_4x: string;
  };
};

// Community Goal Contribution
export type TwitchCommunityGoalContribution = {
  dateTime: string;
  channelId: string;
  id: string;
  title: string;
  description: string;
  inStock: boolean;
  amount: number;
  contributed: number;
  duration: number;
  startedAt: string;
  endsAt: string;
  daysLeft: number;
  userId: string;
  userName: string;
  displayName: string;
  userContributed: number;
  userStreamContributed: number;
  userTotalContributed: number;
  isTest: boolean;
};

// Community Goal Ended
export type TwitchCommunityGoalEnded = {
  userId: string;
  userName: string;
  displayName: string;
  dateTime: string;
  channelId: string;
  id: string;
  title: string;
  description: string;
  inStock: boolean;
  amount: number;
  contributed: number;
  duration: number;
  isTest: boolean;
};

// Poll Created
export type TwitchPollCreated = {
  ends_at: string;
  id: string;
  title: string;
  choices: Array<{
    id: string;
    title: string;
    channel_points_votes: number;
    votes: number;
  }>;
  channel_points_voting: {
    is_enabled: boolean;
    amount_per_vote: number;
  };
  started_at: string;
};

// Poll Updated
export type TwitchPollUpdated = {
  ends_at: string;
  id: string;
  title: string;
  choices: Array<{
    id: string;
    title: string;
    channel_points_votes: number;
    votes: number;
  }>;
  channel_points_voting: {
    is_enabled: boolean;
    amount_per_vote: number;
  };
  started_at: string;
};

// Poll Completed
export type TwitchPollCompleted = {
  status: string;
  ended_at: string;
  winningChoice: {
    id: string;
    title: string;
    channel_points_votes: number;
    votes: number;
  };
  id: string;
  title: string;
  choices: Array<{
    id: string;
    title: string;
    channel_points_votes: number;
    votes: number;
  }>;
  channel_points_voting: {
    is_enabled: boolean;
    amount_per_vote: number;
  };
  started_at: string;
};

// Prediction Created
export type TwitchPredictionCreated = {
  locks_at: string;
  id: string;
  title: string;
  outcomes: Array<{
    id: string;
    title: string;
    color: string;
    users: number;
    channel_points: number;
  }>;
  started_at: string;
};

// Prediction Updated
export type TwitchPredictionUpdated = {
  locks_at: string;
  id: string;
  title: string;
  outcomes: Array<{
    id: string;
    title: string;
    color: string;
    users: number;
    channel_points: number;
    top_predictors: Array<{
      user_id: string;
      user_login: string;
      user_name: string;
      channel_points_used: number;
    }>;
  }>;
  started_at: string;
};

// Prediction Completed
export type TwitchPredictionCompleted = {
  winning_outcome_id: string;
  status: string;
  ended_at: string;
  winning_outcome: {
    id: string;
    title: string;
    color: string;
    users: number;
    channel_points: number;
    top_predictors: Array<{
      user_id: string;
      user_login: string;
      user_name: string;
      channel_points_won: number;
      channel_points_used: number;
    }>;
  };
  id: string;
  title: string;
  outcomes: Array<{
    id: string;
    title: string;
    color: string;
    users: number;
    channel_points: number;
    top_predictors: Array<{
      user_id: string;
      user_login: string;
      user_name: string;
      channel_points_won: number;
      channel_points_used: number;
    }>;
  }>;
  started_at: string;
};

// Prediction Canceled
export type TwitchPredictionCanceled = {
  winning_outcome_id: string;
  status: string;
  ended_at: string;
  id: string;
  title: string;
  outcomes: Array<{
    id: string;
    title: string;
    color: string;
    users: number;
    channel_points: number;
    top_predictors: Array<{
      user_id: string;
      user_login: string;
      user_name: string;
      channel_points_used: number;
    }>;
  }>;
  started_at: string;
};

// Prediction Locked
export type TwitchPredictionLocked = {
  locked_at: string;
  id: string;
  title: string;
  outcomes: Array<{
    id: string;
    title: string;
    color: string;
    users: number;
    channel_points: number;
    top_predictors: Array<{
      user_id: string;
      user_login: string;
      user_name: string;
      channel_points_used: number;
    }>;
  }>;
  started_at: string;
};

// Viewer Count Update
export type TwitchViewerCountUpdate = {
  viewers: number;
};

// Charity Started
export type TwitchCharityStarted = {
  id: string;
  current_amount: {
    value: number;
    decimal_places: number;
    currency: string;
  };
  target_amount: {
    value: number;
    decimal_places: number;
    currency: string;
  };
  started_at: string;
  charity_name: string;
  charity_description: string;
  charity_logo: string;
  charity_website: string;
};

// Charity Donation
export type TwitchCharityDonation = {
  id: string;
  campaign_id: string;
  user_id: string;
  user_login: string;
  user_name: string;
  amount: {
    value: number;
    decimal_places: number;
    currency: string;
  };
  charity_name: string;
};

// Charity Progress
export type TwitchCharityProgress = {
  id: string;
  current_amount: {
    value: number;
    decimal_places: number;
    currency: string;
  };
  target_amount: {
    value: number;
    decimal_places: number;
    currency: string;
  };
  charity_name: string;
  charity_description: string;
  charity_logo: string;
  charity_website: string;
};

// Charity Completed
export type TwitchCharityCompleted = {
  id: string;
  current_amount: {
    value: number;
    decimal_places: number;
    currency: string;
  };
  target_amount: {
    value: number;
    decimal_places: number;
    currency: string;
  };
  stopped_at: string;
  charity_name: string;
  charity_description: string;
  charity_logo: string;
  charity_website: string;
};

// Announcement
export type TwitchAnnouncement = {
  msgId: string;
  subscriber: boolean;
  color: string;
  message: string;
  emotes: Array<{
    id: string;
    type: string;
    name: string;
    startIndex: number;
    endIndex: number;
    imageUrl: string;
  }>;
  badges: Array<{
    name: string;
    version: string;
    imageUrl: string;
  }>;
  monthsSubscribed: number;
  announcementColor: string;
  userId: string;
  userName: string;
  displayName: string;
  role: number;
  isTest: boolean;
};

// Pyramid Broken
export type TwitchPyramidBroken = {
  ownerId: string;
  ownerUsername: string;
  ownerDisplay: string;
  total: number;
  width: number;
  emote: string;
  user: {
    display: string;
    id: string;
    name: string;
    role: number;
    subscribed: boolean;
    type: string;
  };
};

// Pyramid Success
export type TwitchPyramidSuccess = {
  total: number;
  width: number;
  emote: string;
  user: {
    display: string;
    id: string;
    name: string;
    role: number;
    subscribed: boolean;
    type: string;
  };
};

// Chat Cleared
export type TwitchChatCleared = {
  target_user_id: string;
  target_user_login: string;
  created_by_user_id: string;
  created_by: string;
  moderation_action: string;
  type: string;
  duration: number;
  isTest: boolean;
};

// Chat Message Deleted
export type TwitchChatMessageDeleted = {
  targetMessageId: string;
  message: string;
  userName: string;
  role: number;
  isTest: boolean;
};

// Shield Mode Begin
export type TwitchShieldModeBegin = {
  moderator_user_id: string;
  moderator_user_name: string;
  moderator_user_login: string;
  started_at: string;
};

// Shield Mode End
export type TwitchShieldModeEnd = {
  moderator_user_id: string;
  moderator_user_name: string;
  moderator_user_login: string;
  ended_at: string;
};

// Shoutout Created
export type TwitchShoutoutCreated = {
  moderator_user_id: string;
  moderator_user_name: string;
  moderator_user_login: string;
  to_broadcaster_user_id: string;
  to_broadcaster_user_login: string;
  to_broadcaster_user_name: string;
  viewer_count: number;
  started_at: string;
  cooldown_ends_at: string;
  target_cooldown_ends_at: string;
};

// User Timed Out
export type TwitchUserTimedOut = {
  target_user_display: string;
  target_user_id: string;
  target_user_login: string;
  created_at: string;
  created_by_user_id: string;
  created_by: string;
  moderation_action: string;
  type: string;
  duration: number;
  reason: string;
  isTest: boolean;
};

// User Banned
export type TwitchUserBanned = {
  target_user_display: string;
  target_user_id: string;
  target_user_login: string;
  created_at: string;
  created_by_user_id: string;
  created_by: string;
  moderation_action: string;
  type: string;
  duration: number;
  reason: string;
  isTest: boolean;
};