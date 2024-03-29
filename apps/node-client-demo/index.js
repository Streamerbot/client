import { StreamerbotClient } from '@streamerbot/client';

const client = new StreamerbotClient({ host: 'aphex.local', port: 9001, immediate: false });
await client.connect();

const info = await client.getInfo();
console.log(`Connected to Streamer.bot`, info);

const actions = await client.getActions();
console.log('Actions received:', actions);