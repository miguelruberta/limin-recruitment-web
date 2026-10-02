export function toNumber(value) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
}

export function roundMoney(value) {
  return Math.round(toNumber(value) * 100) / 100;
}

export function addMoney(...values) {
  return roundMoney(values.reduce((total, value) => total + toNumber(value), 0));
}