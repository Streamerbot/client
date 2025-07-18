# @streamerbot/client

## 1.12.1

### Patch Changes

- Allow .on style subscription strings in subscribe option

## 1.12.0

### Minor Changes

- Support for event subscriptions from any Stremaer.bot version, add Kick support.

## 1.11.0

### Minor Changes

- Add basic logger implementation with custom overrides

## 1.10.0

### Minor Changes

- Add custom event response helpers, fix straggling event listner bug

## 1.9.5

### Patch Changes

- handle partial WebSocket server auth (enforce for all requests = false)

## 1.9.4

### Patch Changes

- fix for NodeJS environments

## 1.9.3

### Patch Changes

- fix handshake failure on unknown message received in NodeJS environments

## 1.9.2

### Patch Changes

- NodeJS fixes

## 1.9.1

### Patch Changes

- fix: properly pass modified req object to sendMessage

## 1.9.0

### Minor Changes

- add support for getUserPronouns, twitch replies, and specific youtube broadcast'

## 1.8.3

### Patch Changes

- fix: handle reconnect logic edge cases when re-initializing client with new options

## 1.8.1

### Patch Changes

- fix: remove AbortSignal.any()

## 1.8.0

### Minor Changes

- add support for authentication, Streamer.bot v0.2.5

## 1.7.0

### Minor Changes

- add global variable requests

## 1.6.0

### Minor Changes

- Streamer.bot v0.2.5 updates

## 1.5.1

### Patch Changes

- catch reconnection errors

## 1.5.0

### Minor Changes

- fix retry backoff

## 1.4.0

### Minor Changes

- add payload types, general bug fixes

## 1.3.1

### Patch Changes

- 77c305a: add scheme option to vue package

## 1.3.0

### Minor Changes

- 76a55f7: add scheme option to support wss://

## 1.2.1

### Patch Changes

- Add bufferutil to deps

## 1.2.0

### Minor Changes

- dd1f09c: Bring events up to date for Streamer.bot v0.2.3, add new custom trigger requests, update docs

## 1.1.0

### Minor Changes

- Add new Streamer.bot connection source field, bump deps.

## 1.0.0

### Major Changes

- Initial Release
