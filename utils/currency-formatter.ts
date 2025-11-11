/**
 * Format a number to Korean currency format
 * @param num - The number to format
 * @returns Formatted Korean currency string (e.g., "1억 2천만")
 *
 * @example
 * formatKoreanCurrency(120000000) // "1억 2천만"
 * formatKoreanCurrency(50000) // "5만"
 * formatKoreanCurrency(0) // "0"
 */
export function formatKoreanCurrency(num: number): string {
  if (num === 0) return '0';

  const units = ['억', '천만', '백만', '십만', '만', '천', '백', '십', ''];
  const unitValues = [100000000, 10000000, 1000000, 100000, 10000, 1000, 100, 10, 1];
  const result = [];

  for (let i = 0; i < unitValues.length; i++) {
    const unitValue = unitValues[i];
    const unit = units[i];
    const digit = Math.floor(num / unitValue);
    if (digit > 0) {
      result.push(`${digit}${unit}`);
      num %= unitValue;
    }
  }

  return result.join(' ');
}
