# Reverb Wiring + Build-Time Configurable Server Settings — Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Connect the app to a Laravel Reverb WebSocket server and move all server settings out of hardcoded `constants.js` into build-time `.env` profiles.

**Architecture:** Approach A / A1 from `docs/plans/2026-07-16-reverb-config-design.md`. A single `config/env.js` module resolves `EXPO_PUBLIC_*` env vars (from `.env` files) into `{ api, reverb }`. `constants/constants.js` becomes a thin adapter sourcing its values from `config/env.js` (its 14 other importers stay untouched). `services/store/echoStore.js` switches from the socket.io broadcaster to Reverb (Pusher protocol) via `laravel-echo` + `pusher-js`. Dead `services/socketService.js` is deleted.

**Tech Stack:** Expo SDK 57, React Native 0.86, `laravel-echo` (Reverb broadcaster), `pusher-js@8`, Expo native `EXPO_PUBLIC_*` env vars.

**Branch:** `feature/expo-sdk-upgrade` (continue here; do not branch).

**Testing note:** No jest in this project. `resolveConfig` is unit-tested with a standalone Babel-transform + `node:assert` script (`config/env.test.cjs`, run with `node`). Everything else is verified at runtime per the design.

**Node note:** Run `fnm use 22` (or `eval "$(fnm env)" && fnm use`) before any `node`/`npx`/`yarn` command — the project pins Node 22.

---

### Task 1: Environment files + gitignore

**Files:**
- Create: `.env.production`, `.env.development`, `.env.example`
- Modify: `.gitignore`

**Step 1: Create `.env.production`** (current prod values)

```
EXPO_PUBLIC_API_ROOT=https://swinn.me
EXPO_PUBLIC_REVERB_KEY=
EXPO_PUBLIC_REVERB_HOST=ws.swinn.me
EXPO_PUBLIC_REVERB_PORT=443
EXPO_PUBLIC_REVERB_SCHEME=https
```

> Fill `EXPO_PUBLIC_REVERB_KEY` with the real Reverb app key (`REVERB_APP_KEY` on the server).

**Step 2: Create `.env.development`** (local placeholders — replace with your LAN IP / local Reverb)

```
EXPO_PUBLIC_API_ROOT=http://localhost:8000
EXPO_PUBLIC_REVERB_KEY=local
EXPO_PUBLIC_REVERB_HOST=localhost
EXPO_PUBLIC_REVERB_PORT=8080
EXPO_PUBLIC_REVERB_SCHEME=http
```

**Step 3: Create `.env.example`** (documented template, safe to commit)

```
# Laravel API host (endpoint builders in constants.js derive from this)
EXPO_PUBLIC_API_ROOT=https://swinn.me
# Reverb app key (server REVERB_APP_KEY) — required
EXPO_PUBLIC_REVERB_KEY=
# Reverb websocket host / port / scheme (https|wss => TLS)
EXPO_PUBLIC_REVERB_HOST=ws.swinn.me
EXPO_PUBLIC_REVERB_PORT=443
EXPO_PUBLIC_REVERB_SCHEME=https
```

**Step 4: Add `.gitignore` rule** (append; currently no `.env` rule exists)

```
# Local env overrides
.env*.local
```

**Step 5: Verify local override is ignored**

Run: `touch .env.local && git status --porcelain .env.local; git check-ignore .env.local`
Expected: `git status` shows nothing for `.env.local`; `git check-ignore` prints `.env.local`. Then `rm .env.local`.

**Step 6: Commit**

```bash
git add .env.production .env.development .env.example .gitignore
git commit -m "Add build-time env profiles for API + Reverb config"
```

---

### Task 2: `config/env.js` with pure `resolveConfig` (TDD)

**Files:**
- Create: `config/env.js`
- Test: `config/env.test.cjs`

**Step 1: Write the failing test** — `config/env.test.cjs`

```js
// Transforms the ESM module with Babel (no jest needed) and asserts resolveConfig.
const assert = require('node:assert');
const { transformFileSync } = require('@babel/core');

const { code } = transformFileSync('config/env.js', { presets: ['babel-preset-expo'] });
const mod = { exports: {} };
// Provide a fake process so top-level process.env.EXPO_PUBLIC_* refs are undefined, not crashing.
new Function('module', 'exports', 'process', 'console', code)(
  mod, mod.exports, { env: {} }, console
);
const resolveConfig = mod.exports.resolveConfig;

// Explicit values are coerced
const c = resolveConfig({ apiRoot: 'http://x', reverbScheme: 'http', reverbPort: '8080', reverbKey: 'k', reverbHost: 'h' });
assert.strictEqual(c.api.root, 'http://x');
assert.strictEqual(c.reverb.port, 8080);
assert.strictEqual(c.reverb.forceTLS, false);
assert.strictEqual(c.reverb.key, 'k');
assert.strictEqual(c.reverb.host, 'h');

// Defaults applied when empty
const d = resolveConfig({});
assert.strictEqual(d.api.root, 'https://swinn.me');
assert.strictEqual(d.reverb.host, 'ws.swinn.me');
assert.strictEqual(d.reverb.port, 443);
assert.strictEqual(d.reverb.forceTLS, true);

// wss scheme => TLS
assert.strictEqual(resolveConfig({ reverbScheme: 'wss' }).reverb.forceTLS, true);

console.log('resolveConfig OK');
```

**Step 2: Run test to verify it fails**

Run: `node config/env.test.cjs`
Expected: FAIL — `config/env.js` does not exist (transformFileSync throws ENOENT).

**Step 3: Write minimal implementation** — `config/env.js`

```js
// Single source of truth for build-time server config.
// EXPO_PUBLIC_* vars are statically inlined by Expo at build/start, so each
// must be referenced literally here (no dynamic key access).
const RAW = {
  apiRoot: process.env.EXPO_PUBLIC_API_ROOT,
  reverbKey: process.env.EXPO_PUBLIC_REVERB_KEY,
  reverbHost: process.env.EXPO_PUBLIC_REVERB_HOST,
  reverbPort: process.env.EXPO_PUBLIC_REVERB_PORT,
  reverbScheme: process.env.EXPO_PUBLIC_REVERB_SCHEME,
};

// Pure: given a raw env-ish object, produce the typed config (defaults = prod).
export function resolveConfig(raw = RAW) {
  const scheme = (raw.reverbScheme || 'https').toLowerCase();
  return {
    api: {
      root: raw.apiRoot || 'https://swinn.me',
    },
    reverb: {
      key: raw.reverbKey || '',
      host: raw.reverbHost || 'ws.swinn.me',
      port: Number(raw.reverbPort) || 443,
      forceTLS: scheme === 'https' || scheme === 'wss',
    },
  };
}

const config = resolveConfig();

if (!config.reverb.key) {
  console.warn('[config] EXPO_PUBLIC_REVERB_KEY is not set — Reverb auth will fail.');
}

export default config;
```

**Step 4: Run test to verify it passes**

Run: `node config/env.test.cjs`
Expected: `resolveConfig OK`

**Step 5: Commit**

```bash
git add config/env.js config/env.test.cjs
git commit -m "Add config/env.js resolving EXPO_PUBLIC_* into { api, reverb }"
```

---

### Task 3: Point `constants.js` at `config/env.js` (adapter)

**Files:**
- Modify: `constants/constants.js:3-6` (the `root` / `echoServer` / `echoServerPort` values)

**Step 1: Change the hardcoded values to read from config**

At the top of `constants/constants.js`, add the import and replace the three literals:

```js
const config = require('../config/env').default;

module.exports = {
  //Root
  root: config.api.root,
  //Echo (kept for backward compat; echoStore now uses config.reverb directly)
  echoServer: config.reverb.host,
  echoServerPort: String(config.reverb.port),
  ...
```

Leave all endpoint builder methods (`authorizationEndpoint`, `profileEndpoint`, `getAllContacts`, …) unchanged — they read `this.root`.

> `constants.js` is CommonJS (`module.exports`), so import `config` via `require('../config/env').default`.

**Step 2: Verify the module loads and endpoints still resolve**

Run:
```bash
node -e "const {transformFileSync}=require('@babel/core'); \
const run=f=>{const {code}=transformFileSync(f,{presets:['babel-preset-expo']}); const m={exports:{}}; new Function('module','exports','process','console','require',code)(m,m.exports,{env:{}},console,require); return m.exports;}; \
const cfgMod=run('config/env.js'); \
require.cache; \
const c=require('./constants/constants'); console.log(c.root, c.echoServer, c.profileEndpoint());"
```
Expected: prints `https://swinn.me ws.swinn.me https://swinn.me/api/user/me` (constants requires config/env transitively; if the transform-eval interop is awkward, instead verify via the Metro bundle in Task 7).
Fallback verification: `node -e "require('@babel/core').transformFileSync('constants/constants.js',{presets:['babel-preset-expo']}); console.log('constants.js parses')"`

**Step 3: Commit**

```bash
git add constants/constants.js
git commit -m "Source constants.js server values from config/env.js"
```

---

### Task 4: Swap WebSocket dependencies

**Files:**
- Modify: `package.json` (dependencies)

**Step 1: Add pusher-js, bump laravel-echo, remove socket.io-client**

Run:
```bash
eval "$(fnm env)" && fnm use 22
yarn remove socket.io-client
yarn add pusher-js@^8.5.0 laravel-echo@^2.4.0
```

**Step 2: Verify install + resolution**

Run: `node -e "console.log('pusher-js', require('pusher-js/package.json').version); console.log('laravel-echo', require('laravel-echo/package.json').version)"`
Expected: `pusher-js 8.5.x` and `laravel-echo 2.4.x`.

> If `laravel-echo@2` throws at import inside Metro during Task 5/7 (RN interop), fall back: `yarn add laravel-echo@^1.16.0` and re-verify.

**Step 3: Commit**

```bash
git add package.json yarn.lock
git commit -m "Swap socket.io-client for pusher-js + Reverb-capable laravel-echo"
```

---

### Task 5: Rewire `echoStore.js` to Reverb

**Files:**
- Modify: `services/store/echoStore.js` (full rewrite of the Echo construction)

**Step 1: Replace the imports and Echo construction**

```js
import React, { createContext, useState, useContext } from 'react';
import Echo from 'laravel-echo';
import Pusher from 'pusher-js/react-native';

import { AuthContext } from './authStore';
import config from '../../config/env';

// laravel-echo's Pusher/Reverb connector expects a global Pusher (no window in RN).
global.Pusher = Pusher;

const EchoStore = ({ children }) => {
  const [userState] = useContext(AuthContext);

  // Construct the Echo instance once (lazy init), not on every render.
  const [echoState, setEchoState] = useState(() => {
    const echo = new Echo({
      broadcaster: 'reverb',
      key: config.reverb.key,
      wsHost: config.reverb.host,
      wsPort: config.reverb.port,
      wssPort: config.reverb.port,
      forceTLS: config.reverb.forceTLS,
      enabledTransports: ['ws', 'wss'],
      disableStats: true,
      authEndpoint: `${config.api.root}/broadcasting/auth`,
      auth: {
        headers: {
          Accept: 'application/json',
          Authorization: `Bearer ${userState.access_token}`,
        },
      },
    });

    const conn = echo.connector?.pusher?.connection;
    if (conn) {
      conn.bind('connected', () => console.log('[reverb] connected', echo.socketId()));
      conn.bind('error', (err) => console.log('[reverb] error', err));
      conn.bind('unavailable', () => console.log('[reverb] unavailable'));
      conn.bind('disconnected', () => console.log('[reverb] disconnected'));
    }

    return echo;
  });

  return (
    <EchoContext.Provider value={[echoState, setEchoState]}>
      {children}
    </EchoContext.Provider>
  );
};

export const EchoContext = createContext();
export default EchoStore;
```

> Keep the `EchoContext`/default-export shape identical so `HomeScreen`'s `echoState.private(channel)` usage is unchanged.

**Step 2: Verify it parses**

Run: `node -e "require('@babel/core').transformFileSync('services/store/echoStore.js',{presets:['babel-preset-expo']}); console.log('echoStore.js OK')"`
Expected: `echoStore.js OK`

**Step 3: Commit**

```bash
git add services/store/echoStore.js
git commit -m "Rewire echoStore to Laravel Reverb (Pusher protocol) via config/env"
```

---

### Task 6: Delete dead `socketService.js`

**Files:**
- Delete: `services/socketService.js`

**Step 1: Confirm it is imported nowhere**

Run: `grep -rn "socketService" --include="*.js" . | grep -v node_modules`
Expected: no results (only the file itself, now being removed).

**Step 2: Delete and commit**

```bash
git rm services/socketService.js
git commit -m "Remove dead socketService.js (legacy socket.io)"
```

---

### Task 7: Runtime verification

**Goal:** Confirm the app boots under SDK 57 with the new config + Reverb wiring, and (if a Reverb server is reachable) the connection succeeds.

**Step 1: Start Metro with the dev env**

Run: `eval "$(fnm env)" && fnm use 22 && npx expo start` (development mode loads `.env.development`; use `.env.local` to point at a real Reverb).

**Step 2: Load the app (web is the reliable target here)**

Open `http://localhost:8081`. Confirm:
- No bundling errors referencing `config/env`, `laravel-echo`, `pusher-js`, or `socket.io-client`.
- Startup logs show the `[config] …` warning only if `REVERB_KEY` is empty (expected with placeholder dev env).

**Step 3: Verify resolved config at runtime**

Temporarily add `console.log('[config]', require('./config/env').default)` at app entry (or inspect via the running Home flow). Confirm `api.root` / `reverb.host` match the active `.env`. Remove the temp log before finishing.

**Step 4: Verify Reverb connection (requires a running Reverb server)**

Point `.env.local` at a live Reverb, log in, and confirm the `[reverb] connected` log fires and a broadcast reaches `HomeScreen`. If no Reverb server is available yet, confirm instead that the app does not crash and logs `[reverb] error`/`unavailable` gracefully.

**Step 5: Final commit (if temp logging was added/removed)**

```bash
git add -A
git commit -m "Verify Reverb config wiring at runtime"
```

---

## Done criteria

- `node config/env.test.cjs` passes.
- App bundles and boots on web under SDK 57 with no socket.io references.
- `constants.js` values come from `config/env.js`; endpoint builders still work.
- `echoStore` builds a Reverb Echo once and logs connection state.
- `.env.local` is gitignored; `.env.example` documents all vars.
- Against a live Reverb server: `[reverb] connected` fires and a broadcast reaches `HomeScreen`.

## Follow-ups (out of scope)

- Add jest for real unit tests (would replace the Babel-transform test shim).
- Pull channel subscription out of `HomeScreen` into the store.
- Full rename of `constants/constants.js` → `config/` (A2).
