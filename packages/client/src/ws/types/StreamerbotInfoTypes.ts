export type StreamerbotInfo = {
  /**
   * The ID of the connected Streamer.bot instance
   * @example 'b63152c5-5bfe-4751-8644-579f7fb4a682'
   */
  instanceId: string;

  /**
   * The name of the connected Streamer.bot instance
   * @example 'Streamer.bot'
   */
  name: string;

  /**
   * The operating system of the connected Streamer.bot instance
   * @example 'windows'
   */
  os: 'windows' | 'linux' | 'macosx' | string;

  /**
   * The version of the connected Streamer.bot instance
   * @example '0.1.21'
   */
  version: string;

  /**
   * The source of the Streamer.bot connection
   * @description Requires Streamer.bot v0.1.21 or higher
   */
  source?: 'websocketServer' | 'streamDeckServer' | 'httpServer' | string;
};