import { UnknownEventData, VerifyEventTypes } from '../streamerbot-event.types';

export type YouTubeEvents = VerifyEventTypes<
  'YouTube',
  {
    BroadcastEnded: UnknownEventData;
    BroadcastStarted: UnknownEventData;
    BroadcastUpdated: UnknownEventData;
    FirstWords: UnknownEventData;
    GiftMembershipReceived: UnknownEventData;
    MemberMileStone: UnknownEventData;
    MembershipGift: UnknownEventData;
    Message: YouTubeMessage;
    MessageDeleted: UnknownEventData;
    NewSponsor: UnknownEventData;
    NewSponsorOnlyEnded: UnknownEventData;
    NewSponsorOnlyStarted: UnknownEventData;
    NewSubscriber: UnknownEventData;
    PresentViewers: UnknownEventData;
    StatisticsUpdated: UnknownEventData;
    SuperChat: UnknownEventData;
    SuperSticker: UnknownEventData;
    UserBanned: UnknownEventData;
  }
>;

export type YouTubeUser = {
  id: string;
  name: string;
  url: string;
  profileImageUrl: string;
  isModerator: boolean;
  isOwner: boolean;
  isSponsor: boolean;
  isVerified: boolean;
};

export type YouTubeMessage = {
  eventId: string;
  message: string;
  publishedAt: string;
  user: YouTubeUser;
};
