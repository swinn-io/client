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
