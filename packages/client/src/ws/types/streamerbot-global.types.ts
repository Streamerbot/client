import { type StreamerbotPlatform } from './streamerbot-broadcaster.types';

export type StreamerbotGlobalVariableName = string;

export type StreamerbotVariableValue = string | number | boolean | null;

export type StreamerbotGlobalVariable<T extends StreamerbotVariableValue = StreamerbotVariableValue, K extends string = string> = {
  name: K,
  value: T,
  lastWrite: string;
};

export type StreamerbotUserGlobalVariable<
  T extends StreamerbotVariableValue = StreamerbotVariableValue,
  K extends string = string,
  U = string,
  P = StreamerbotPlatform
> = StreamerbotGlobalVariable<T, K> & {
  userId: U;
  userLogin: string,
  userName: string;
  platform: P;
};