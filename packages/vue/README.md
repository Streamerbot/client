# Streamer.bot Vue Composables

[Full Documentation](https://streamerbot.github.io/client/)

## 🌈 Demo
All functionality on [Streamer.bot Toolkit](https://toolkit.streamer.bot) is utilizing this client library 😍

## 📦 Installation

Package Manager

```
yarn add @streamerbot/client @streamerbot/vue

npm install @streamerbot/client @streamerbot/vue

pnpm install @streamerbot/client @streamerbot/vue
```

## 🦄 Basic Usage

```ts
import { useStreamerbot } from '@streamerbot/vue';

const { client, data } = useStreamerbot();

watch(data, () => {
  console.log('Data received from Streamer.bot Client!', data.value);
});
```

Check out the [docs](https://streamerbot.github.io/client/) for more usage examples.

## 🌸 Thanks

Huge thanks to [nate1280](https://github.com/nate1280) for creating Streamer.bot!

## 👨‍🚀 Contributors
[Whipstickgostop](https://github.com/whipstickgostop)

## 📄 License
MIT License © 2023-Present [Whipstickgostop](https://github.com/whipstickgostop)