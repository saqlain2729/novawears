export function generateOrderNumber(): string {
  const n = Math.floor(1000 + Math.random() * 9000);
  const timePart = Date.now().toString().slice(-4);
  return `NW-${n}${timePart}`.slice(0, 10);
}
