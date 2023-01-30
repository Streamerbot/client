# Streamer.bot Client

TypeScript client for interacting with the [Streamer.bot](https://streamer.bot) WebSocket API

[Full Documentation](https://streamerbot.github.io/client/)

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
<script src="https://unpkg.com/@streamerbot/client/dist/streamerbot-client.js"></script>
```

## 🦄 Basic Usage

```ts
import { StreamerbotClient } from '@streamerbot/client';

// Create a new client with default options
const client = new StreamerbotClient();

// Subscription will automatically be added to client with your listener function
client.on('Twitch.ChatMessage', (data) => {
  console.log('Twitch Chat Message Received!', data);
});
```

Check out the [docs](https://streamerbot.github.io/client/) for more usage examples.

## 🌸 Thanks

Huge thanks to [nate1280](https://github.com/nate1280) for creating Streamer.bot!

## 👨‍🚀 Contributors
[Whipstickgostop](https://github.com/whipstickgostop)

## 📄 License
MIT License © 2023-Present [Whipstickgostop](https://github.com/whipstickgostop)