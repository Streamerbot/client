import { StreamerbotClient } from '@streamerbot/client';

const client = new StreamerbotClient();

client.on('Twitch.ChatMessage', ({ data }) => {
  console.log(`[Twitch.ChatMessage] ${data.message.displayName}: ${data.message.message}`);
});