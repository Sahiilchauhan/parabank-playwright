// "$1,234.50" -> 123450 (cents, a whole number)
export function toCents(text: string): number {
  const cleaned = text.replace(/[$,\s]/g, '');
  if (cleaned === '') {
    return 0;
  }
  return Math.round(parseFloat(cleaned) * 100);
}

// adds up a list of currency texts, result is in cents
export function sumCents(values: string[]): number {
  let total = 0;
  for (const value of values) {
    total = total + toCents(value);
  }
  return total;
}

// 123450 -> "$1234.50"
export function formatCents(cents: number): string {
  return '$' + (cents / 100).toFixed(2);
}