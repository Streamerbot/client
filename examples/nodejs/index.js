import { Logger, StreamerbotClient } from '@streamerbot/client';
import pino from 'pino';

const pinoLogger = pino({
  level: 'trace',
  transport: {
    target: 'pino-pretty',
    options: {
      colorize: true
    }
  }
});

const customLogger = new Logger({
  customLogger: (level, ...args) => {
    const message = args.filter(arg => typeof arg === 'string').join(' ');
    const data = args.find(arg => typeof arg === 'object') || {};
    data.err = args.find(arg => arg instanceof Error) ?? undefined;

    switch (level) {
      case 'verbose':
        pinoLogger.trace(data, message);
        break;
      case 'debug':
        pinoLogger.debug(data, message);
        break;
      case 'info':
        pinoLogger.info(data, message);
        break;
      case 'warn':
        pinoLogger.warn(data, message);
        break;
      case 'error':
        pinoLogger.error(data, message);
        break;
    }
  }
});

const client = new StreamerbotClient({
  onConnect: () => {
    fetchGlobal();
    testDoAction();
    testCustomCodeTrigger();
  },
  logger: customLogger,
  logLevel: 'debug',
  subscribe: ['General.Custom'],
});

client.on('Twitch.ChatMessage', ({ data }) => {
  pinoLogger.info(`[Twitch.ChatMessage] ${data.message.displayName}: ${data.message.message}`);
});

client.on('Kick.ChatMessage', ({ data }) => {
  pinoLogger.info(`[Kick.ChatMessage] ${data.user.name}: ${data.text}`);
});

// client.on('*', ({ event, data }) => {
//   pinoLogger.info(`[${event.source}.${event.type}] ${JSON.stringify(data)}`);
// });

async function fetchGlobal() {
  try {
    const test = await client.getGlobal('test');
  } catch (e) {
    pinoLogger.error('Error fetching global:', e);
  }
}

async function testDoAction() {
  try {
    const response = await client.doAction({ name: 'Test' }, { test: 'Sent from testDoAction :)' }, { customEventResponse: true });
  } catch (e) {
    pinoLogger.error('Error executing action:', e);
  }
}

async function testCustomCodeTrigger() {
  try {
    const response = await client.executeCodeTrigger('musicbee_connected', { test: 'Sent from testCustomCodeTrigger :)' }, { customEventResponse: true });
  } catch (e) {
    pinoLogger.error('Error executing action:', e);
  }
}