type CreditsEvents = {
  cheers: Array<string>;
  follows: Array<string>;
  gameupdates: Array<string>;
  giftbombs: Array<string>;
  giftsubs: Array<string>;
  goalcontributions: Array<string>;
  hypetrains: Array<string>;
  pyramids: Array<string>;
  raided: Array<string>;
  resubs: Array<string>;
  rewardredemptions: Array<string>;
  subs: Array<string>;
};

type CreditsHypeTrain = {
  conductors: Array<string>;
  contributors: Array<string>;
}

type CreditsUsers = {
  editors: Array<string>;
  groups: Array<string>;
  moderators: Array<string>;
  subscribers: Array<string>;
  vips: Array<string>;
  users: Array<string>;
};

type CreditsTop = {
  allBits: Array<string>;
  monthBits: Array<string>;
  weekBits: Array<string>;
  channelRewards: Array<string>;
};

export type StreamerbotCredits = {
  events: Partial<CreditsEvents>;
  users: Partial<CreditsUsers>;
  hypeTrain: CreditsHypeTrain;
  top: CreditsTop;
  groups: unknown;
  custom: unknown;
};