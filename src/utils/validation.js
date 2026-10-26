/**
 * Input sanitization and validation utilities
 */

export function sanitizeRegex(str) {
  if (!str) return '';
  return str.trim();
}

export function isValidRegexInput(str) {
  if (!str || str.trim() === '') return false;
  // Check basic parentheses balance
  let open = 0;
  for (const c of str) {
    if (c === '(') open++;
    if (c === ')') open--;
    if (open < 0) return false;
  }
  return open === 0;
}
