# Design: Reverb WebSocket wiring + build-time configurable server settings

Date: 2026-07-16
Branch: `feature/expo-sdk-upgrade`
Status: Approved (design phase)

## Problem

The app connects to realtime WebSockets via `laravel-echo@1.15.3` + `socket.io-client`
(`broadcaster: 'socket.io'`), and all server settings are hardcoded in
`constants/constants.js` (`root`, `echoServer`, `echoServerPort`). We need to:

1. Wire the client to a **Laravel Reverb** server. Reverb speaks the **Pusher
   protocol**, not socket.io — so the transport must change, not just a URL.
2. Make the server settings **build-time configurable** (per environment) instead
   of hardcoded.

## Decisions

- **Config style:** build-time environment profiles (not runtime / in-app editable).
- **Environments:** `dev` + `prod`.
- **Scope:** migrate + consolidate — move `echoStore` to Reverb, delete the dead
  `services/socketService.js` (imported nowhere). Do **not** refactor the channel
  subscription out of `HomeScreen` (out of scope; possible follow-up).
- **Config mechanism (Approach A):** Expo SDK 57 native `EXPO_PUBLIC_*` env vars
  from `.env` files (no new config dependency), surfaced through a single
  `config/env.js` module.
- **constants.js (A1):** keep `constants/constants.js` and its endpoint builders;
  it becomes a thin adapter whose hardcoded values are sourced from `config/env.js`.
  The other 14 importers are untouched (avoids 15-file churn). Full move to
  `config/` (A2) was rejected as cosmetic churn with more regression surface.

## Architecture & config flow

```
.env.development / .env.production / .env.local   (EXPO_PUBLIC_*, inlined at build/start)
        │  Expo selects: `expo start` -> development, `expo export`/build -> production
        ▼
config/env.js   resolveConfig(process.env) -> { api: { root }, reverb: { key, host, port, forceTLS } }
        │
        ├─────────────► constants/constants.js   (endpoint builders read config.api.root)
        │                        └── fetchJson, userService, screens ... (imports unchanged)
        └─────────────► services/store/echoStore.js   (Reverb/Pusher Echo)
```

`config/env.js` is the only module that touches `process.env.EXPO_PUBLIC_*`.
Because Expo inlines these via static string replacement, each var must be
referenced literally (no dynamic key access).

## File changes

Add:
- `.env.development` — local placeholders (LAN IP / local Reverb key).
- `.env.production` — current prod values (`https://swinn.me`, `ws.swinn.me`, `443`, `https`).
- `.env.example` — documented template.
- `config/env.js` — pure `resolveConfig(env)` + exported `{ api, reverb }`.
- `.gitignore` entry for `.env*.local` (currently no `.env` rule exists).

Change:
- `services/store/echoStore.js` — Reverb/Pusher wiring (below).
- `constants/constants.js` — `root`/`echoServer`/`echoServerPort` sourced from `config/env.js`.
- `package.json` — add `pusher-js`, bump `laravel-echo`, remove `socket.io-client`.

Delete:
- `services/socketService.js` (dead code).

## Env var schema & defaults

| Var | Default | Notes |
|-----|---------|-------|
| `EXPO_PUBLIC_API_ROOT` | `https://swinn.me` | Laravel API host |
| `EXPO_PUBLIC_REVERB_KEY` | — (required) | Reverb app key; `console.warn` if missing |
| `EXPO_PUBLIC_REVERB_HOST` | `ws.swinn.me` | Reverb ws host |
| `EXPO_PUBLIC_REVERB_PORT` | `443` | coerced to Number |
| `EXPO_PUBLIC_REVERB_SCHEME` | `https` | `https`/`wss` -> `forceTLS=true`, else false |

Defaults equal current prod values, so a missing/partial `.env` never crashes the app.

## Reverb client wiring (echoStore.js)

Versions confirmed available: `laravel-echo@2.4.0`, `pusher-js@8.5.0`. Pin the exact
`laravel-echo` after a smoke test; fall back to `1.16.x` if 2.x has an RN quirk.

```js
import Pusher from 'pusher-js/react-native';
global.Pusher = Pusher; // RN has no window

const echo = new Echo({
  broadcaster: 'reverb',
  key: config.reverb.key,
  wsHost: config.reverb.host,
  wsPort: config.reverb.port,
  wssPort: config.reverb.port,
  forceTLS: config.reverb.forceTLS,
  enabledTransports: ['ws', 'wss'],
  disableStats: true,                                   // Reverb has no stats endpoint
  authEndpoint: `${config.api.root}/broadcasting/auth`, // Laravel app route (see note)
  auth: { headers: { Accept: 'application/json', Authorization: `Bearer ${token}` } },
});
```

- **authEndpoint correction:** today it points at the ws host (`ws.swinn.me`).
  `/broadcasting/auth` is a Laravel app route, so it now points at `config.api.root`.
  Revisit if the Reverb deployment intentionally proxies auth through the ws host.
- **Construct once:** build the Echo instance in a lazy `useState` initializer
  instead of on every render.
- **Connection logging:** bind `echo.connector.pusher.connection` events
  (`connected` / `error` / `unavailable` / `disconnected`), replacing the logging
  that lived in the deleted `socketService.js`.

## Error handling

- Missing `REVERB_KEY` -> `console.warn` at startup; app still boots.
- Bad port/scheme -> coerced with fallback + warn.
- Reverb unreachable -> bound `error`/`unavailable`/`disconnected` handlers log; no crash.

## Testing / verification

No test runner in the project. `resolveConfig(env)` is written as a pure function so
it is trivially unit-testable if jest is added later. Primary verification is runtime:

1. Log resolved config (without secrets) at startup.
2. Confirm `pusher.connection` reaches `connected` against a Reverb server.
3. Trigger a broadcast and confirm it arrives in `HomeScreen`.
4. Verify on web + device via the established run flow.

## Out of scope (possible follow-ups)

- Pulling channel subscription logic out of `HomeScreen` into the store/service.
- Full rename of `constants/constants.js` to `config/` (A2).
- Runtime / in-app configurable server (a settings screen).
