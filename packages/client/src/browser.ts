import { StreamerbotClient } from './ws/StreamerbotClient';

Object.assign(globalThis, { StreamerbotClient });

export { StreamerbotClient as Client } from './ws/StreamerbotClient';
