type StreamerbotAction = {
    enabled: boolean;
    group: string;
    id: string;
    name: string;
    subaction_count: number;
};

type TwitchBroadcaster = {
    broadcastUser: string;
    broadcastUserName: string;
    broadcastUserId: string;
    broadcastIsAffiliate: boolean;
    broadcastIsPartner: boolean;
};
type YoutubeBroadcaster = {
    broadcastUserName: string;
    broadcastUserId: string;
    broadcastUserProfileImage: string;
};
type BroadcasterPlatforms = {
    twitch?: TwitchBroadcaster;
    youtube?: YoutubeBroadcaster;
};
type BroadcasterPlatform = keyof BroadcasterPlatforms;

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
};
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
type StreamerbotCredits = {
    events: Partial<CreditsEvents>;
    users: Partial<CreditsUsers>;
    hypeTrain: CreditsHypeTrain;
    top: CreditsTop;
    groups: unknown;
    custom: unknown;
};

declare const StreamerbotEvents: {
    readonly Application: readonly ["ActionAdded", "ActionUpdated", "ActionDeleted"];
    readonly Command: readonly ["Message", "Whisper", "MessageCooldown", "BotWhisper"];
    readonly DonorDrive: readonly ["Donation", "ProfileUpdated"];
    readonly FileWatcher: readonly ["Changed", "Created", "Deleted", "Renamed"];
    readonly General: readonly ["Custom"];
    readonly HypeRate: readonly ["HeartRatePulse"];
    readonly Kofi: readonly ["Donation", "Subscription", "Resubscription", "ShopOrder", "Commission"];
    readonly Midi: readonly ["Message"];
    readonly Misc: readonly ["TimedAction", "PyramidSuccess", "PyramidBroken"];
    readonly Obs: readonly ["Connected", "Disconnected"];
    readonly Patreon: readonly ["FollowCreated", "FollowDeleted", "PledgeCreated", "PledgeUpdated", "PledgeDeleted"];
    readonly Pulsoid: readonly ["HeartRatePulse"];
    readonly Quote: readonly ["Added", "Show"];
    readonly Raw: readonly ["Action", "SubAction", "ActionCompleted"];
    readonly Shopify: readonly ["OrderCreated", "OrderPaid"];
    readonly SpeechToText: readonly ["Dictation", "Command"];
    readonly StreamElements: readonly ["Tip", "Merch"];
    readonly Streamlabs: readonly ["Donation", "Merchandise"];
    readonly TipeeeStream: readonly ["Donation"];
    readonly TreatStream: readonly ["Treat"];
    readonly Twitch: readonly ["Follow", "Cheer", "Sub", "ReSub", "GiftSub", "GiftBomb", "Raid", "HypeTrainStart", "HypeTrainUpdate", "HypeTrainLevelUp", "HypeTrainEnd", "RewardRedemption", "RewardCreated", "RewardUpdated", "RewardDeleted", "CommunityGoalContribution", "CommunityGoalEnded", "StreamUpdate", "Whisper", "FirstWord", "SubCounterRollover", "BroadcastUpdate", "StreamUpdateGameOnConnect", "PresentViewers", "PollCreated", "PollUpdated", "PollCompleted", "PredictionCreated", "PredictionUpdated", "PredictionCompleted", "PredictionCanceled", "PredictionLocked", "ChatMessage", "ChatMessageDeleted", "UserTimedOut", "UserBanned", "Announcement", "AdRun", "BotWhisper", "CharityDonation", "CharityCompleted", "CoinCheer", "ShoutoutCreated", "UserUntimedOut", "CharityStarted", "CharityProgress", "GoalBegin", "GoalProgress", "GoalEnd", "ShieldModeBegin", "ShieldModeEnd", "AdMidRoll"];
    readonly WebsocketClient: readonly ["Open", "Close", "Message"];
    readonly WebsocketCustomServer: readonly ["Open", "Close", "Message"];
    readonly YouTube: readonly ["BroadcastStarted", "BroadcastEnded", "Message", "MessageDeleted", "UserBanned", "SuperChat", "SuperSticker", "NewSponsor", "MemberMileStone", "NewSponsorOnlyStarted", "NewSponsorOnlyEnded", "StatisticsUpdated", "BroadcastUpdated", "MembershipGift", "GiftMembershipReceived", "FirstWords", "PresentViewers"];
};
type DeepWriteable<T> = {
    -readonly [P in keyof T]: DeepWriteable<T[P]>;
};
type StreamerbotEventsType = typeof StreamerbotEvents;
type StreamerbotEventsTypeWriteable = DeepWriteable<StreamerbotEventsType>;
type StreamerbotEventSource = keyof typeof StreamerbotEvents;
type StreamerbotEventSourceValue<T extends StreamerbotEventSource> = T extends StreamerbotEventSource ? `${T}.${StreamerbotEventsType[T][number] | '*'}` : never;
type StreamerbotEventName = `${StreamerbotEventSourceValue<StreamerbotEventSource>}`;
type StreamerbotEventsSubscriptionType<T extends StreamerbotEventSource> = T extends StreamerbotEventSource ? Array<StreamerbotEventsType[T][number]> : never;
type StreamerbotEventsSubscription = Partial<{
    [P in StreamerbotEventSource]: StreamerbotEventsSubscriptionType<P>;
}>;

type StreamerbotInfo = {
    instanceId: string;
    name: string;
    os: 'windows' | 'linux' | 'macosx' | string;
    version: string;
};

type StreamerbotViewer = {
    channelPointsUsed: number;
    display: string;
    exempt: boolean;
    groups: Array<string>;
    id: string;
    login: string;
    previousActive: string;
    role: string;
    subscribed: boolean;
};

type StreamerbotResponse<T> = T & {
    id: string;
    status: 'ok' | 'error';
};
type SubscribeResponse = StreamerbotResponse<{
    events: StreamerbotEventsSubscription;
}>;
type UnsubscribeResponse = StreamerbotResponse<{
    events: StreamerbotEventsSubscription;
}>;
type GetEventsResponse = StreamerbotResponse<{
    events: StreamerbotEventsType;
}>;
type GetActionsResponse = StreamerbotResponse<{
    actions: Array<StreamerbotAction>;
    count: number;
}>;
type DoActionResponse = StreamerbotResponse<{}>;
type GetBroadcasterResponse = StreamerbotResponse<{
    platforms: Partial<BroadcasterPlatforms>;
    connected: Array<BroadcasterPlatform>;
    disconnected: Array<BroadcasterPlatform>;
}>;
type GetCreditsResponse = StreamerbotResponse<StreamerbotCredits>;
type TestCreditsResponse = StreamerbotResponse<StreamerbotCredits>;
type ClearCreditsResponse = StreamerbotResponse<{}>;
type GetInfoResponse = StreamerbotResponse<{
    info: StreamerbotInfo;
}>;
type GetActiveViewersResponse = StreamerbotResponse<{
    viewers: Array<StreamerbotViewer>;
    count: number;
}>;
type StreamerbotResponseTypes = StreamerbotResponse<unknown> | SubscribeResponse | UnsubscribeResponse | GetEventsResponse | GetActionsResponse | DoActionResponse | GetBroadcasterResponse | GetCreditsResponse | TestCreditsResponse | ClearCreditsResponse | GetInfoResponse | GetActiveViewersResponse;

type StreamerbotClientOptions = {
    host: string;
    port: number;
    endpoint: string;
    immediate: boolean;
    subscribe: StreamerbotEventsSubscription | '*';
    onConnect?: (data: StreamerbotInfo) => void;
    onDisconnect?: () => void;
    onError?: (err: Error) => void;
    onData?: (data: Object) => void;
};
declare const DefaultStreamerbotClientOptions: StreamerbotClientOptions;
declare class StreamerbotClient {
    private readonly options;
    protected socket?: WebSocket;
    protected listeners: Array<{
        events: StreamerbotEventName[];
        callback: (data: unknown) => void;
    }>;
    protected subscriptions: StreamerbotEventsSubscription;
    constructor(options?: Partial<StreamerbotClientOptions>);
    /**
     * Returns true if WebSocket readyState is `OPEN`
     */
    get isConnected(): boolean;
    /**
     * Connect to a Streamer.bot WebSocket server
     */
    connect(): Promise<void>;
    /**
     * Disconnect Streamer.bot WebSocket
     */
    disconnect(): Promise<void>;
    protected onOpen(): Promise<void>;
    protected onClose(event: CloseEvent): void;
    protected onMessage(data: MessageEvent): void;
    protected onError(event: Event): void;
    protected cleanup(): void;
    /**
     * Send a raw object to the Streamer.bot WebSocket
     */
    send(data: Object): void;
    /**
     * Make a request to the Streamer.bot WebSocket,
     * wait for the response, and return the response data
     */
    request<T extends StreamerbotResponseTypes>(request: any, id?: string, timeout?: number): Promise<T>;
    /**
     * Listener for specific event data
     */
    on(events: StreamerbotEventName | StreamerbotEventName[], listener: (data: unknown) => void): Promise<void>;
    /**
     * Subscribe to events from your connected Streamer.bot instance
     */
    subscribe(events: StreamerbotEventsSubscription | '*'): Promise<SubscribeResponse>;
    /**
     * Unsubscribe from events you are currently subscribed to
     */
    unsubscribe(events: StreamerbotEventsSubscription | '*'): Promise<UnsubscribeResponse>;
    /**
     * Get all possible events that may be subscribed to
     */
    getEvents(): Promise<GetEventsResponse>;
    /**
     * Get all actions from your connected Streamer.bot instance
     */
    getActions(): Promise<GetActionsResponse>;
    /**
     * Get all actions from your connected Streamer.bot instance
     */
    doAction(id: string, args?: Record<string, any>): Promise<DoActionResponse>;
    /**
     * Get the current broadcaster account information
     */
    getBroadcaster(): Promise<GetBroadcasterResponse>;
    /**
     * Get the current credits payload
     */
    getCredits(): Promise<GetCreditsResponse>;
    /**
     * Test credits by populating with fake data
     */
    testCredits(): Promise<TestCreditsResponse>;
    /**
     * Reset credits data
     */
    clearCredits(): Promise<ClearCreditsResponse>;
    /**
     * Get information about the connected Streamer.bot instance
     */
    getInfo(): Promise<GetInfoResponse>;
    /**
     * Returns all active viewers and their user information
     */
    getActiveViewers(): Promise<GetActiveViewersResponse>;
}

export { BroadcasterPlatform, BroadcasterPlatforms, ClearCreditsResponse, DefaultStreamerbotClientOptions, DoActionResponse, GetActionsResponse, GetActiveViewersResponse, GetBroadcasterResponse, GetCreditsResponse, GetEventsResponse, GetInfoResponse, StreamerbotAction, StreamerbotClient, StreamerbotClientOptions, StreamerbotCredits, StreamerbotEventName, StreamerbotEventSource, StreamerbotEvents, StreamerbotEventsSubscription, StreamerbotEventsType, StreamerbotEventsTypeWriteable, StreamerbotInfo, StreamerbotResponse, StreamerbotResponseTypes, StreamerbotViewer, SubscribeResponse, TestCreditsResponse, TwitchBroadcaster, UnsubscribeResponse, YoutubeBroadcaster };
