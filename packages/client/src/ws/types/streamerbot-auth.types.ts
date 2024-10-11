import { StreamerbotInfo } from './streamerbot-info.types';

export type StreamerbotHelloRequest = {
 request: 'Hello';
 info: StreamerbotInfo;
 authentication: {
  challenge: string;
  salt: string;
 }
 timestamp: string;
 session: string;
};