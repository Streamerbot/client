"use strict";
var __defProp = Object.defineProperty;
var __defProps = Object.defineProperties;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropDescs = Object.getOwnPropertyDescriptors;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getOwnPropSymbols = Object.getOwnPropertySymbols;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __propIsEnum = Object.prototype.propertyIsEnumerable;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __spreadValues = (a, b) => {
  for (var prop in b || (b = {}))
    if (__hasOwnProp.call(b, prop))
      __defNormalProp(a, prop, b[prop]);
  if (__getOwnPropSymbols)
    for (var prop of __getOwnPropSymbols(b)) {
      if (__propIsEnum.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    }
  return a;
};
var __spreadProps = (a, b) => __defProps(a, __getOwnPropDescs(b));
var __export = (target, all) => {
  for (var name2 in all)
    __defProp(target, name2, { get: all[name2], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);
var __async = (__this, __arguments, generator) => {
  return new Promise((resolve, reject) => {
    var fulfilled = (value) => {
      try {
        step(generator.next(value));
      } catch (e) {
        reject(e);
      }
    };
    var rejected = (value) => {
      try {
        step(generator.throw(value));
      } catch (e) {
        reject(e);
      }
    };
    var step = (x) => x.done ? resolve(x.value) : Promise.resolve(x.value).then(fulfilled, rejected);
    step((generator = generator.apply(__this, __arguments)).next());
  });
};

// src/index.ts
var src_exports = {};
__export(src_exports, {
  DefaultStreamerbotClientOptions: () => DefaultStreamerbotClientOptions,
  StreamerbotClient: () => StreamerbotClient,
  StreamerbotEvents: () => StreamerbotEvents
});
module.exports = __toCommonJS(src_exports);

// src/ws/types/StreamerbotEventTypes.ts
var StreamerbotEvents = {
  Application: ["ActionAdded", "ActionUpdated", "ActionDeleted"],
  Command: ["Message", "Whisper", "MessageCooldown", "BotWhisper"],
  DonorDrive: ["Donation", "ProfileUpdated"],
  FileWatcher: ["Changed", "Created", "Deleted", "Renamed"],
  General: ["Custom"],
  HypeRate: ["HeartRatePulse"],
  Kofi: [
    "Donation",
    "Subscription",
    "Resubscription",
    "ShopOrder",
    "Commission"
  ],
  Midi: ["Message"],
  Misc: ["TimedAction", "PyramidSuccess", "PyramidBroken"],
  Obs: ["Connected", "Disconnected"],
  Patreon: [
    "FollowCreated",
    "FollowDeleted",
    "PledgeCreated",
    "PledgeUpdated",
    "PledgeDeleted"
  ],
  Pulsoid: ["HeartRatePulse"],
  Quote: ["Added", "Show"],
  Raw: ["Action", "SubAction", "ActionCompleted"],
  Shopify: ["OrderCreated", "OrderPaid"],
  SpeechToText: ["Dictation", "Command"],
  StreamElements: ["Tip", "Merch"],
  Streamlabs: ["Donation", "Merchandise"],
  TipeeeStream: ["Donation"],
  TreatStream: ["Treat"],
  Twitch: [
    "Follow",
    "Cheer",
    "Sub",
    "ReSub",
    "GiftSub",
    "GiftBomb",
    "Raid",
    "HypeTrainStart",
    "HypeTrainUpdate",
    "HypeTrainLevelUp",
    "HypeTrainEnd",
    "RewardRedemption",
    "RewardCreated",
    "RewardUpdated",
    "RewardDeleted",
    "CommunityGoalContribution",
    "CommunityGoalEnded",
    "StreamUpdate",
    "Whisper",
    "FirstWord",
    "SubCounterRollover",
    "BroadcastUpdate",
    "StreamUpdateGameOnConnect",
    "PresentViewers",
    "PollCreated",
    "PollUpdated",
    "PollCompleted",
    "PredictionCreated",
    "PredictionUpdated",
    "PredictionCompleted",
    "PredictionCanceled",
    "PredictionLocked",
    "ChatMessage",
    "ChatMessageDeleted",
    "UserTimedOut",
    "UserBanned",
    "Announcement",
    "AdRun",
    "BotWhisper",
    "CharityDonation",
    "CharityCompleted",
    "CoinCheer",
    "ShoutoutCreated",
    "UserUntimedOut",
    "CharityStarted",
    "CharityProgress",
    "GoalBegin",
    "GoalProgress",
    "GoalEnd",
    "ShieldModeBegin",
    "ShieldModeEnd",
    "AdMidRoll"
  ],
  WebsocketClient: ["Open", "Close", "Message"],
  WebsocketCustomServer: ["Open", "Close", "Message"],
  YouTube: [
    "BroadcastStarted",
    "BroadcastEnded",
    "Message",
    "MessageDeleted",
    "UserBanned",
    "SuperChat",
    "SuperSticker",
    "NewSponsor",
    "MemberMileStone",
    "NewSponsorOnlyStarted",
    "NewSponsorOnlyEnded",
    "StatisticsUpdated",
    "BroadcastUpdated",
    "MembershipGift",
    "GiftMembershipReceived",
    "FirstWords",
    "PresentViewers"
  ]
};

// src/ws/util/ws-utils.ts
function generateRequestId() {
  return `sb:client:req:${Date.now()}-${crypto.getRandomValues(new Uint32Array(12))[0]}`;
}
function getCloseEventReason(event) {
  let reason;
  if (event.code == 1e3)
    reason = "Normal closure, meaning that the purpose for which the connection was established has been fulfilled.";
  else if (event.code == 1001)
    reason = 'An endpoint is "going away", such as a server going down or a browser having navigated away from a page.';
  else if (event.code == 1002)
    reason = "An endpoint is terminating the connection due to a protocol error";
  else if (event.code == 1003)
    reason = "An endpoint is terminating the connection because it has received a type of data it cannot accept (e.g., an endpoint that understands only text data MAY send this if it receives a binary message).";
  else if (event.code == 1004)
    reason = "Reserved. The specific meaning might be defined in the future.";
  else if (event.code == 1005)
    reason = "No status code was actually present.";
  else if (event.code == 1006)
    reason = "The connection was closed abnormally, e.g., without sending or receiving a Close control frame";
  else if (event.code == 1007)
    reason = "An endpoint is terminating the connection because it has received data within a message that was not consistent with the type of the message (e.g., non-UTF-8 [https://www.rfc-editor.org/rfc/rfc3629] data within a text message).";
  else if (event.code == 1008)
    reason = 'An endpoint is terminating the connection because it has received a message that "violates its policy". This reason is given either if there is no other sutible reason, or if there is a need to hide specific details about the policy.';
  else if (event.code == 1009)
    reason = "An endpoint is terminating the connection because it has received a message that is too big for it to process.";
  else if (event.code == 1010)
    reason = "An endpoint (client) is terminating the connection because it has expected the server to negotiate one or more extension, but the server didn't return them in the response message of the WebSocket handshake. <br /> Specifically, the extensions that are needed are: " + event.reason;
  else if (event.code == 1011)
    reason = "A server is terminating the connection because it encountered an unexpected condition that prevented it from fulfilling the request.";
  else if (event.code == 1015)
    reason = "The connection was closed due to a failure to perform a TLS handshake (e.g., the server certificate can't be verified).";
  else
    reason = "Unknown reason";
  return reason;
}

// src/ws/StreamerbotClient.ts
var DefaultStreamerbotClientOptions = {
  host: "127.0.0.1",
  port: 8080,
  endpoint: "/",
  immediate: true,
  subscribe: {}
};
var StreamerbotClient = class {
  constructor(options = DefaultStreamerbotClientOptions) {
    this.listeners = [];
    this.subscriptions = {};
    this.options = __spreadValues(__spreadValues({}, DefaultStreamerbotClientOptions), options);
    if (true === this.options.immediate) {
      this.connect();
    }
  }
  get isConnected() {
    var _a, _b;
    return ((_a = this.socket) == null ? void 0 : _a.readyState) === ((_b = this.socket) == null ? void 0 : _b.OPEN);
  }
  connect() {
    return __async(this, null, function* () {
      var _a;
      if (this.socket) {
        yield this.disconnect();
      }
      try {
        this.socket = new WebSocket(
          `ws://${this.options.host}:${this.options.port}${this.options.endpoint}`
        );
        this.socket.onopen = this.onOpen.bind(this);
        this.socket.onclose = this.onClose.bind(this);
        this.socket.onerror = this.onError.bind(this);
        this.socket.onmessage = this.onMessage.bind(this);
      } catch (error) {
        yield this.disconnect();
        try {
          if (this.options.onError)
            (_a = this == null ? void 0 : this.options) == null ? void 0 : _a.onError(error);
        } catch (e) {
          console.error("Error invoking onError handler", e);
        }
        throw error;
      }
    });
  }
  disconnect() {
    return __async(this, null, function* () {
      var _a;
      if (!this.socket || this.socket.readyState === this.socket.CLOSED) {
        return;
      }
      this.socket.close();
      try {
        if (this.options.onDisconnect)
          (_a = this == null ? void 0 : this.options) == null ? void 0 : _a.onDisconnect();
      } catch (e) {
        console.error("Error invoking onDisconnect handler", e);
      }
    });
  }
  onOpen() {
    return __async(this, null, function* () {
      var _a;
      try {
        if (this.options.subscribe) {
          yield this.subscribe(this.options.subscribe);
        }
        const infoResponse = yield this.getInfo();
        if (this.options.onConnect)
          (_a = this == null ? void 0 : this.options) == null ? void 0 : _a.onConnect(infoResponse.info);
      } catch (e) {
        console.error("Error invoking onOpen handler", e);
      }
    });
  }
  onClose(event) {
    var _a, _b;
    try {
      if ((event.type === "error" || !event.wasClean) && this.options.onError)
        (_a = this == null ? void 0 : this.options) == null ? void 0 : _a.onError(new Error(getCloseEventReason(event)));
      if (this.options.onDisconnect)
        (_b = this == null ? void 0 : this.options) == null ? void 0 : _b.onDisconnect();
    } catch (e) {
      console.error("Error invoking onDisconnect handler", e);
    }
    this.cleanup();
  }
  onMessage(data) {
    var _a, _b, _c, _d;
    console.log(data == null ? void 0 : data.data);
    if ((data == null ? void 0 : data.data) && typeof data.data === "string") {
      const payload = JSON.parse(data.data);
      try {
        if (this.options.onData)
          (_a = this == null ? void 0 : this.options) == null ? void 0 : _a.onData(payload);
      } catch (e) {
        console.error("Error invoking onData handler", e);
      }
      if (((_b = payload == null ? void 0 : payload.event) == null ? void 0 : _b.source) && ((_c = payload == null ? void 0 : payload.event) == null ? void 0 : _c.type)) {
        for (const listener of this.listeners) {
          if (!((_d = listener.events) == null ? void 0 : _d.length))
            continue;
          if (!listener.events.find((event) => {
            var _a2, _b2, _c2;
            return event === `${(_a2 = payload == null ? void 0 : payload.event) == null ? void 0 : _a2.source}.${(_b2 = payload == null ? void 0 : payload.event) == null ? void 0 : _b2.type}` || event.split(".", 2)[1] === "*" && event.split(".", 2)[0] === ((_c2 = payload == null ? void 0 : payload.event) == null ? void 0 : _c2.source);
          }))
            continue;
          try {
            listener.callback(payload);
          } catch (e) {
            console.error("Error calling listener callback", listener.events);
          }
        }
      }
    } else {
      console.debug("unknown message", data);
    }
  }
  onError(event) {
    var _a;
    console.error("WebSocket Error", event);
    try {
      if (this.options.onError)
        (_a = this == null ? void 0 : this.options) == null ? void 0 : _a.onError(new Error("WebSocket Error"));
    } catch (e) {
      console.error("Error invoking onError handler", e);
    }
  }
  cleanup() {
    if (!this.socket)
      return;
    this.socket.onopen = null;
    this.socket.onclose = null;
    this.socket.onerror = null;
    this.socket.onmessage = null;
    this.listeners = [];
    this.socket = void 0;
  }
  send(data) {
    var _a;
    (_a = this.socket) == null ? void 0 : _a.send(JSON.stringify(data));
  }
  request(request, id = "", timeout = 5e3) {
    return __async(this, null, function* () {
      if (!id)
        id = generateRequestId();
      const controller = new AbortController();
      const signal = controller.signal;
      let timer;
      return yield Promise.race([
        new Promise(
          (res, rej) => timer = setTimeout(() => {
            controller.abort();
            return rej({
              message: "WebSocket request timeout exceeded",
              request
            });
          }, timeout)
        ),
        new Promise((res, rej) => {
          var _a;
          (_a = this.socket) == null ? void 0 : _a.addEventListener(
            "message",
            (data) => {
              var _a2, _b;
              try {
                const payload = JSON.parse(data == null ? void 0 : data.data);
                if ((payload == null ? void 0 : payload.status) === "ok" && (payload == null ? void 0 : payload.id) === id) {
                  try {
                    if (this.options.onData) {
                      (_b = this == null ? void 0 : this.options) == null ? void 0 : _b.onData(__spreadValues({
                        _time: Date.now(),
                        event: {
                          source: "Request",
                          type: (_a2 = request.request) != null ? _a2 : "Unknown"
                        }
                      }, payload));
                    }
                  } catch (e) {
                    console.error("Error invoking onData handler", e);
                  }
                  res(__spreadValues({
                    _time: Date.now()
                  }, payload));
                }
              } catch (e) {
                rej(e);
              }
            },
            { signal }
          );
          this.send(__spreadProps(__spreadValues({}, request), { id }));
        })
      ]).finally(() => {
        clearTimeout(timer);
        controller.abort();
      });
    });
  }
  on(events, listener) {
    return __async(this, null, function* () {
      var _a, _b;
      try {
        if (!Array.isArray(events))
          events = [events];
        if (!(events == null ? void 0 : events.length))
          return;
        let updateSubscriptions = false;
        for (const event of events) {
          const [source, type] = (_a = event.split(".", 2)) != null ? _a : [null, null];
          if (!source || !type || !(source in StreamerbotEvents))
            continue;
          const eventSource = source;
          const eventType = type;
          if (eventType) {
            updateSubscriptions = true;
            const set = /* @__PURE__ */ new Set([
              ...(_b = this.subscriptions[eventSource]) != null ? _b : [],
              ...eventType === "*" ? StreamerbotEvents[eventSource] : [eventType]
            ]);
            this.subscriptions[eventSource] = [...set];
          }
        }
        if (updateSubscriptions) {
          yield this.subscribe(this.subscriptions);
        }
        this.listeners.push({
          events,
          callback: listener
        });
      } catch (e) {
        console.error("Failed adding event listener", events);
      }
    });
  }
  subscribe(events) {
    return __async(this, null, function* () {
      var _a, _b;
      if (events === "*")
        events = StreamerbotEvents;
      for (const key in events) {
        if (key === void 0)
          continue;
        if (!Object.keys(StreamerbotEvents).includes(key))
          continue;
        const eventSource = key;
        const eventTypes = (_a = events[eventSource]) != null ? _a : [];
        if (eventTypes && eventTypes.length) {
          const set = /* @__PURE__ */ new Set([
            ...(_b = this.subscriptions[eventSource]) != null ? _b : [],
            ...eventTypes
          ]);
          this.subscriptions[eventSource] = [...set];
        }
      }
      return yield this.request({
        request: "Subscribe",
        events: this.subscriptions
      });
    });
  }
  unsubscribe(events) {
    return __async(this, null, function* () {
      var _a, _b;
      if (events === "*")
        events = StreamerbotEvents;
      for (const key in events) {
        if (key === void 0)
          continue;
        if (!Object.keys(StreamerbotEvents).includes(key))
          continue;
        const eventSource = key;
        const eventTypes = events[eventSource];
        if (eventTypes && eventTypes.length) {
          for (const eventType of eventTypes) {
            if (eventType) {
              if ((_a = this.subscriptions[eventSource]) == null ? void 0 : _a.filter) {
                (_b = this.subscriptions[eventSource] = this.subscriptions[eventSource]) == null ? void 0 : _b.filter((evt) => eventType !== evt);
              }
            }
          }
        }
      }
      return yield this.request({
        request: "UnSubscribe",
        events
      });
    });
  }
  getEvents() {
    return __async(this, null, function* () {
      return yield this.request({
        request: "GetEvents"
      });
    });
  }
  getActions() {
    return __async(this, null, function* () {
      return yield this.request({
        request: "GetActions"
      });
    });
  }
  doAction(id, args) {
    return __async(this, null, function* () {
      return yield this.request({
        request: "DoAction",
        action: {
          id,
          name
        },
        args
      });
    });
  }
  getBroadcaster() {
    return __async(this, null, function* () {
      return yield this.request({
        request: "GetBroadcaster"
      });
    });
  }
  getCredits() {
    return __async(this, null, function* () {
      return yield this.request({
        request: "GetCredits"
      });
    });
  }
  testCredits() {
    return __async(this, null, function* () {
      return yield this.request({
        request: "TestCredits"
      });
    });
  }
  clearCredits() {
    return __async(this, null, function* () {
      return yield this.request({
        request: "ClearCredits"
      });
    });
  }
  getInfo() {
    return __async(this, null, function* () {
      return yield this.request({
        request: "GetInfo"
      });
    });
  }
  getActiveViewers() {
    return __async(this, null, function* () {
      return yield this.request({
        request: "GetActiveViewers"
      });
    });
  }
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  DefaultStreamerbotClientOptions,
  StreamerbotClient,
  StreamerbotEvents
});
