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
