import { type StreamerbotPlatform } from './streamerbot-broadcaster.types';

export type StreamerbotGlobalVariableName = string;

export type StreamerbotVariableValue = string | number | boolean | null;

export type StreamerbotGlobalVariable<T = StreamerbotVariableValue, K = string> = {
  name: K extends string ? K : string;
  value: T extends StreamerbotVariableValue ? T : StreamerbotVariableValue;
  lastWrite: string;
};

export type StreamerbotUserGlobalVariable<
  T = StreamerbotVariableValue,
  K = string,
  U = string,
  P = StreamerbotPlatform
> = StreamerbotGlobalVariable<T, K> & {
  userId: U;
  userLogin: string,
  userName: string;
  platform: P;
};