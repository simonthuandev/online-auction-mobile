/**
 * VND Currency Helper using BigInt to prevent IEEE-754 precision loss.
 * Backend pattern: ^(0|[1-9][0-9]{0,15})$
 */

const VND_PATTERN = /^(0|[1-9][0-9]{0,15})$/;

export function isValidVnd(value: string): boolean {
  if (typeof value !== 'string') return false;
  return VND_PATTERN.test(value.trim());
}

export function parseVnd(value: string | bigint | number): bigint {
  if (typeof value === 'bigint') return value;
  if (typeof value === 'number') {
    if (!Number.isSafeInteger(value)) {
      throw new Error(`Cannot safely parse float/unsafe number into BigInt: ${value}`);
    }
    return BigInt(value);
  }
  const trimmed = value.trim();
  if (!isValidVnd(trimmed)) {
    throw new Error(`Invalid VND string format: "${value}". Must match ^(0|[1-9][0-9]{0,15})$`);
  }
  return BigInt(trimmed);
}

export function formatVnd(value: string | bigint | number): string {
  try {
    const bi = parseVnd(value);
    const formatted = bi.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
    return `${formatted} ₫`;
  } catch {
    return '0 ₫';
  }
}

export function compareVnd(a: string | bigint | number, b: string | bigint | number): number {
  const bigA = parseVnd(a);
  const bigB = parseVnd(b);
  if (bigA < bigB) return -1;
  if (bigA > bigB) return 1;
  return 0;
}

export function addVnd(a: string | bigint | number, b: string | bigint | number): string {
  const sum = parseVnd(a) + parseVnd(b);
  return sum.toString();
}

export function subtractVnd(a: string | bigint | number, b: string | bigint | number): string {
  const diff = parseVnd(a) - parseVnd(b);
  if (diff < 0n) {
    throw new Error('VND result cannot be negative');
  }
  return diff.toString();
}

export function isPositiveVnd(value: string | bigint | number): boolean {
  try {
    return parseVnd(value) > 0n;
  } catch {
    return false;
  }
}
