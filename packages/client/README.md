# Streamer.bot Client

TypeScript client for interacting with the [Streamer.bot](https://streamer.bot) WebSocket API


## 🌈 Demo
All functionality on [Streamer.bot Toolkit](https://toolkit.streamer.bot) is utilizing this client library 😍

## 📦 Installation

Package Manager

```
yarn add @streamerbot/client

npm install @streamerbot/client

pnpm install @streamerbot/client
```

CDN / Browser

```
<script src="https://unpkg.com/@streamerbot/client@0.6.1/dist/streamerbot-client.js"></script>
```

## 🦄 Usage

```ts
import { StreamerbotClient } from '@streamerbot/client';

// Create a new client with default options
const client = new StreamerbotClient();

// Connect
await client.connect();

// Subscription will automatically be added to client with your listener function
client.on('Twitch.ChatMessage', (data) => {
  console.log('Twitch Chat Message Received!', data);
});
```

### Connection Options
```ts
// All options are optional, defaults are shown below
const client = new StreamerbotClient({
  host: '127.0.0.1',
  port: 8080,
  endpoint: '/',
  subscribe: undefined,
  onConnect: undefined,
  onDisconnect: undefined,
  onData: undefined,
});
```

### Requests
```ts
// Subscribe
const response = await client.subscribe(events: { ... } | '*');

// Unsubscribe
const response = await client.unsubscribe(events: { ... } | '*');

// GetEvents
const response = await client.getEvents();

// GetActions
const response = await client.getActions();

// DoAction
const response = await client.doAction(id: string, args?: Record<string, any>);

// GetBroadcaster
const response = await client.getBroadcaster();

// GetCredits
const response = await client.getCredits();

// TestCredits
const response = await client.testCredits();

// GetInfo
const response = await client.getInfo();

// GetActiveViewers
const response = await client.getActiveViewers();
```

## 🌸 Thanks

Huge thanks to [nate1280](https://github.com/nate1280) for creating Streamer.bot!

## 👨‍🚀 Contributors
[Whipstickgostop](https://github.com/whipstickgostop)

## 📄 License
MIT License © 2023-Present [Whipstickgostop](https://github.com/whipstickgostop)