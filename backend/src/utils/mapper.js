export function mapFields(payload, fieldMap) {
  const row = {};

  for (const [inputKey, value] of Object.entries(payload)) {
    const column = fieldMap[inputKey];
    if (!column || value === undefined) continue;
    row[column] = value === '' ? null : value;
  }

  return row;
}

export function pickDefined(payload, keys) {
  return Object.fromEntries(keys.filter((key) => payload[key] !== undefined).map((key) => [key, payload[key]]));
}