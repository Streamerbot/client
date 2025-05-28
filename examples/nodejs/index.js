import { StreamerbotClient } from '@streamerbot/client';

const client = new StreamerbotClient({
  onConnect: () => {
    fetchGlobal();
    testDoAction();
    testCustomCodeTrigger();
  }
});

client.on('Twitch.ChatMessage', ({ data }) => {
  console.log(`[Twitch.ChatMessage] ${data.message.displayName}: ${data.message.message}`);
});

async function fetchGlobal() {
  try {
    const test = await client.getGlobal('test');
    console.log('Global test value:', test);
  } catch (e) {
    console.error('Error fetching global:', e);
  }
}

async function testDoAction() {
  try {
    const response = await client.doAction({ name: 'Test' }, { test: 'Sent from testDoAction :)' }, { customEventResponse: true });
    console.log('doAction custom response:', response);
  } catch (e) {
    console.error('Error executing action:', e);
  }
}

async function testCustomCodeTrigger() {
  try {
    const response = await client.executeCodeTrigger('musicbee_connected', { test: 'Sent from testCustomCodeTrigger :)' }, { customEventResponse: true });
    console.log('executeCodeTrigger custom response:', response);
  } catch (e) {
    console.error('Error executing action:', e);
  }
}