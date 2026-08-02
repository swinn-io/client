# Design: Conform thread-screen message types to the registry (location + battery)

Date: 2026-07-17
Branch: `feature/thread-message-types` (stacked on `feature/expo-sdk-upgrade`)
Status: Approved (design phase)

## Problem

The thread screen (`screens/MessageScreen.js`) composes non-conforming, ad-hoc
message bodies:

- "Random Numbers" button → `{ body: [n1, n2] }` (test artifact)
- `LocationComponent` → `{ body: [<raw expo-location object>] }`
- `BatteryComponent` → `{ body: { battery: 45 } }`

None match the Swinn message-type registry (the contract). The renderer
(`renderRow`) just dumps `JSON.stringify(message.body)` with a `//TO-DO parse
messages` note.

## Contract

The registry is the contract. A message `body` is a self-describing instance of a
registry type:

```json
{ "type": "<type>", "version": "<version>", "payload": { ...validates against schema... } }
```

Two types are in scope:

- **location** (`renderer_hint: LocationPin`) — payload `{ lat: -90..90, lng: -180..180 }`
- **metric** (`renderer_hint: MetricDisplay`) — payload
  `{ quantity: "battery_level", value, unit: "percent", recorded_at? }`;
  the registry constrains `battery_level` to the `percent` unit.

## Scope

Minimal: fix `location` and `battery` (as a `metric`), remove the random-numbers
artifact. Other types are out of scope and continue to render as raw JSON. No
renderer cards (that was the declined "render all 7" scope).

## Approach (A — small pure module, kept unopinionated)

New module `services/messageTypes.js` with two pure builders that emit the
canonical body and validate only what the schema/constraints require:

```js
// { type: 'location', version: '1.0', payload: { lat, lng } }
export function buildLocation(lat, lng);      // throws if lat/lng not numbers in range

// { type: 'metric', version: '1.0', payload: { quantity: 'battery_level', value, unit: 'percent' } }
export function buildBatteryMetric(value);    // throws if value not a number in [0,100]
```

No validation beyond conformance (required fields, numeric ranges, the
`battery_level → percent` unit constraint). Version is `'1.0'` per the registry.
Pure functions → unit-testable without a device.

Rejected: inline shaping in each composer (validation scattered/untestable); a
generic JSON-Schema validator for all 7 types (new dependency, YAGNI).

## Component changes

- `components/input/LocationComponent.js`: read `coords.latitude`/`coords.longitude`
  from `expo-location`, POST `{ body: buildLocation(lat, lng) }`.
- `components/input/BatteryComponent.js`: convert battery level (0–1) to a percent
  integer, POST `{ body: buildBatteryMetric(value) }`.
- `screens/MessageScreen.js`: remove the "Random Numbers" button and its
  `handleNewMessage`. Renderer unchanged (now shows canonical `{type,version,payload}`).

## Error handling

Builders throw on invalid input; composers catch and `alert()` / log (matching the
existing permission/error handling in those components). A malformed reading never
reaches the API.

## Testing

`services/messageTypes.test.cjs` — Babel-transform + `node:assert` (the project's
established no-jest pattern):

- `buildLocation(52.5, 13.4)` deep-equals the exact canonical location object.
- `buildLocation` throws for out-of-range / non-number lat or lng.
- `buildBatteryMetric(87)` deep-equals the exact canonical metric object
  (`quantity: 'battery_level'`, `unit: 'percent'`).
- `buildBatteryMetric` throws for value < 0, > 100, or non-number.

Runtime check: send a location and a battery from the thread screen, confirm the
POST body is the canonical shape and the message renders (as canonical JSON).

## Out of scope

- Composers/renderers for the other 5 types (currency, status, file_reference, mood, ping).
- Renderer cards / renderer_hint → component mapping.
- Fetching the registry from the backend (the two entries are used directly).
