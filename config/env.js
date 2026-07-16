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
