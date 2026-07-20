# @streamerbot/node-client-demo

## 2.0.0

### Major Changes

- ## Breaking change for NodeJS

  This library is now using native node WebSocket (available in Node v24 by default) by default.
  The older "ws" dependency has been fully removed.

  Streamer.bot v1.0.5 (currently in alpha) is also required to use this version with NodeJS clients.
  Please update your streamer.bot installation to v1.0.5 or later before updating to this version of the client.

  **Frontend web/browser clients are unaffected by this change and will continue to work as before.**

### Patch Changes

- Updated dependencies
  - @streamerbot/client@2.0.0

## 1.12.2

### Patch Changes

- Fix .on('\*') subscriptions
- Updated dependencies
  - @streamerbot/client@1.12.2

## 1.12.1

### Patch Changes

- Allow .on style subscription strings in subscribe option
- Updated dependencies
  - @streamerbot/client@1.12.1

## 1.12.0

### Minor Changes

- Support for event subscriptions from any Stremaer.bot version, add Kick support.

### Patch Changes

- Updated dependencies
  - @streamerbot/client@1.12.0

## 1.11.0

### Minor Changes

- Add basic logger implementation with custom overrides

### Patch Changes

- Updated dependencies
  - @streamerbot/client@1.11.0

## 1.10.0

### Minor Changes

- Add custom event response helpers, fix straggling event listner bug

### Patch Changes

- Updated dependencies
  - @streamerbot/client@1.10.0

## 1.9.5

### Patch Changes

- handle partial WebSocket server auth (enforce for all requests = false)
- Updated dependencies
  - @streamerbot/client@1.9.5

## 1.9.4

### Patch Changes

- fix for NodeJS environments
- Updated dependencies
  - @streamerbot/client@1.9.4

## 1.9.3

### Patch Changes

- fix handshake failure on unknown message received in NodeJS environments
- Updated dependencies
  - @streamerbot/client@1.9.3

## 1.9.2

### Patch Changes

- NodeJS fixes
- Updated dependencies
  - @streamerbot/client@1.9.2

## 1.9.0

### Minor Changes

- add support for getUserPronouns, twitch replies, and specific youtube broadcast'

### Patch Changes

- Updated dependencies
  - @streamerbot/client@1.9.0
