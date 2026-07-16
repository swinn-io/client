// Transforms the ESM module with Babel (no jest needed) and asserts resolveConfig.
// Production mode makes babel-preset-expo (SDK 57) statically inline EXPO_PUBLIC_*
// as literals (undefined here) instead of emitting a `require("expo/virtual/env")`
// the sandbox can't resolve — this mirrors a real production build.
process.env.NODE_ENV = 'production';
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
