# Thread Message Types Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Make the thread screen's location and battery messages conform to the Swinn type registry (`{ type, version, payload }`), and drop the non-conforming "Random Numbers" test button.

**Architecture:** From `docs/plans/2026-07-17-thread-message-types-design.md` (Approach A). A small pure module `services/messageTypes.js` exposes `buildLocation` / `buildBatteryMetric` that return the canonical body and validate only what the registry schema/constraints require. The two composer components call these; the renderer is untouched.

**Tech Stack:** Expo SDK 57 / React Native, `expo-location`, `expo-battery`. No jest — pure functions are tested with a Babel-transform + `node:assert` script (the pattern used by `config/env.test.cjs`).

**Branch:** `feature/thread-message-types` (stacked on `feature/expo-sdk-upgrade`) — stay on it.

**Node:** run `eval "$(fnm env)" && fnm use 22` before any node command.

---

### Task 1: `services/messageTypes.js` (TDD)

**Files:**
- Create: `services/messageTypes.js`
- Test: `services/messageTypes.test.cjs`

**Step 1: Write the failing test** — `services/messageTypes.test.cjs`

```js
const assert = require('node:assert');
const { transformFileSync } = require('@babel/core');

const { code } = transformFileSync('services/messageTypes.js', { presets: ['babel-preset-expo'] });
const mod = { exports: {} };
new Function('module', 'exports', code)(mod, mod.exports);
const { buildLocation, buildBatteryMetric } = mod.exports;

// location — valid
assert.deepStrictEqual(
  buildLocation(52.5, 13.4),
  { type: 'location', version: '1.0', payload: { lat: 52.5, lng: 13.4 } }
);
// location — invalid
assert.throws(() => buildLocation(91, 0), /lat/);
assert.throws(() => buildLocation(0, 181), /lng/);
assert.throws(() => buildLocation('x', 0));
assert.throws(() => buildLocation(0, NaN));

// metric (battery) — valid
assert.deepStrictEqual(
  buildBatteryMetric(87),
  { type: 'metric', version: '1.0', payload: { quantity: 'battery_level', value: 87, unit: 'percent' } }
);
// metric — invalid
assert.throws(() => buildBatteryMetric(-1));
assert.throws(() => buildBatteryMetric(101));
assert.throws(() => buildBatteryMetric('x'));

console.log('messageTypes OK');
```

**Step 2: Run to verify it fails**

Run: `eval "$(fnm env)" && fnm use 22 && node services/messageTypes.test.cjs`
Expected: FAIL — `services/messageTypes.js` does not exist (transformFileSync throws ENOENT).

**Step 3: Write minimal implementation** — `services/messageTypes.js`

```js
// Canonical builders for Swinn message bodies. Each returns { type, version,
// payload } where payload validates against the registry schema. Validation is
// limited to what the schema/constraints require — no extra opinions.

function isFiniteNumber(n) {
  return typeof n === 'number' && Number.isFinite(n);
}

// location: payload { lat: -90..90, lng: -180..180 }
export function buildLocation(lat, lng) {
  if (!isFiniteNumber(lat) || lat < -90 || lat > 90) {
    throw new Error(`Invalid location lat: ${lat}`);
  }
  if (!isFiniteNumber(lng) || lng < -180 || lng > 180) {
    throw new Error(`Invalid location lng: ${lng}`);
  }
  return { type: 'location', version: '1.0', payload: { lat, lng } };
}

// metric battery_level: unit is constrained to 'percent' by the registry
export function buildBatteryMetric(value) {
  if (!isFiniteNumber(value) || value < 0 || value > 100) {
    throw new Error(`Invalid battery value: ${value}`);
  }
  return {
    type: 'metric',
    version: '1.0',
    payload: { quantity: 'battery_level', value, unit: 'percent' },
  };
}
```

**Step 4: Run to verify it passes**

Run: `eval "$(fnm env)" && fnm use 22 && node services/messageTypes.test.cjs`
Expected: `messageTypes OK`

**Step 5: Commit**

```bash
git add services/messageTypes.js services/messageTypes.test.cjs
git commit -m "Add canonical message builders for location and battery metric"
```
Include trailer `Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>`.

---

### Task 2: `LocationComponent` emits canonical location

**Files:**
- Modify: `components/input/LocationComponent.js`

**Step 1: Import the builder** — add near the other imports:
```js
import { buildLocation } from '../../services/messageTypes';
```

**Step 2: Replace the body construction** — in `sendLocation`, change:
```js
    let location = await Location.getCurrentPositionAsync({});
    const newMessage = { body: [location] };
```
to:
```js
    let location = await Location.getCurrentPositionAsync({});
    const newMessage = {
      body: buildLocation(location.coords.latitude, location.coords.longitude),
    };
```
Leave the surrounding `try/catch` as-is (a thrown validation error is caught and logged there).

**Step 3: Verify it parses**

Run: `eval "$(fnm env)" && fnm use 22 && node -e "require('@babel/core').transformFileSync('components/input/LocationComponent.js',{presets:['babel-preset-expo']}); console.log('OK')"`
Expected: `OK`

**Step 4: Commit**

```bash
git add components/input/LocationComponent.js
git commit -m "LocationComponent: emit canonical location message body"
```
Include the Co-Authored-By trailer.

---

### Task 3: `BatteryComponent` emits canonical metric

**Files:**
- Modify: `components/input/BatteryComponent.js`

**Step 1: Import the builder**:
```js
import { buildBatteryMetric } from '../../services/messageTypes';
```

**Step 2: Replace the body construction** — in `sendBattery`, change:
```js
      const newMessage = { body: { battery: battery } };
```
to:
```js
      const newMessage = { body: buildBatteryMetric(battery) };
```
> `battery` state is already a 0–100 percentage (`batteryPercentage(level)` = `Math.round(level*100)`), which is what `buildBatteryMetric` expects.

**Step 3: Verify it parses**

Run: `eval "$(fnm env)" && fnm use 22 && node -e "require('@babel/core').transformFileSync('components/input/BatteryComponent.js',{presets:['babel-preset-expo']}); console.log('OK')"`
Expected: `OK`

**Step 4: Commit**

```bash
git add components/input/BatteryComponent.js
git commit -m "BatteryComponent: emit canonical metric (battery_level) message body"
```
Include the Co-Authored-By trailer.

---

### Task 4: Remove the "Random Numbers" test button

**Files:**
- Modify: `screens/MessageScreen.js`

**Step 1: Delete `handleNewMessage`** — remove the entire function (the `ranNum1/ranNum2` random-number generator and its POST), lines ~72–95.

**Step 2: Delete the button** — in the JSX `<HStack>` at the bottom, remove:
```jsx
            <Button
              flex={1}
              style={{ backgroundColor: '#F2786D' }}
              onPress={handleNewMessage}
            >
              <Ionicons name='cellular' color='#fff' size={18} />
              <ButtonText color='#fff'> Random Numbers</ButtonText>
            </Button>
```
Keep `<LocationComponent threadId={threadId} />` and `<BatteryComponent threadId={threadId} />`.

**Step 3: Remove now-unused imports** — if `Button`, `ButtonText`, or `Ionicons` are no longer referenced anywhere else in the file, remove them from the imports. (Verify with a grep before deleting; `Ionicons` is likely only used here.)

Run: `grep -nE "Ionicons|ButtonText|<Button" screens/MessageScreen.js`

**Step 4: Verify it parses**

Run: `eval "$(fnm env)" && fnm use 22 && node -e "require('@babel/core').transformFileSync('screens/MessageScreen.js',{presets:['babel-preset-expo']}); console.log('OK')"`
Expected: `OK`

**Step 5: Commit**

```bash
git add screens/MessageScreen.js
git commit -m "Remove non-conforming Random Numbers test button from thread screen"
```
Include the Co-Authored-By trailer.

---

### Task 5: Runtime verification

**Files:** none modified.

**Step 1: Re-run the unit test** (guards against regressions):
Run: `eval "$(fnm env)" && fnm use 22 && node services/messageTypes.test.cjs`
Expected: `messageTypes OK`

**Step 2: Drive the thread screen** — start the app (dev client or web), open a thread, and:
- Tap **Location** → confirm the POSTed body is `{ type: 'location', version: '1.0', payload: { lat, lng } }` (check the network request or the message that renders).
- Tap **Battery** → confirm the body is `{ type: 'metric', version: '1.0', payload: { quantity: 'battery_level', value, unit: 'percent' } }`.
- Confirm the "Random Numbers" button is gone.

> The renderer still shows `JSON.stringify(body)`, so the canonical object appears directly in the thread — that is the expected visual for this minimal PR.

**Step 3: Report** — unit test green, both composers emit canonical bodies, random button removed.

---

## Done criteria

- `node services/messageTypes.test.cjs` passes.
- Location and battery messages POST canonical `{ type, version, payload }` bodies validated against the registry (incl. `battery_level → percent`).
- The "Random Numbers" button and `handleNewMessage` are gone; no dead imports left.
- All four source files parse under `babel-preset-expo`.

## Follow-ups (out of scope)

- Composers/renderers for the other 5 registry types.
- `renderer_hint` → card component mapping (LocationPin, MetricDisplay, …).
- Fetching the registry from the backend instead of using the two entries directly.
