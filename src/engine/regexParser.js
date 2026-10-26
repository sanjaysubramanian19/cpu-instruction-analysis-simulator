/**
 * FLAT Engine: Regular Expression Parser & Infix-to-Postfix Converter
 * Academic Reference:
 *   - FLAT Module 2.1: Introduction to Regular Expressions
 *   - FLAT Module 2.2: Kleene's theorem and Operations on Regular Expressions
 *
 * Implements:
 * 1. Explicit Concatenation Insertion (e.g., "ab" -> "a.b", "a(b|c)" -> "a.(b|c)")
 * 2. Shunting-Yard Algorithm for Regular Expression Operators
 *    Precedence: '*' (Kleene Star, 3) > '.' (Concatenation, 2) > '|' (Union, 1)
 */

export const OPERATORS = {
  STAR: '*',
  CONCAT: '.',
  UNION: '|',
  LPAREN: '(',
  RPAREN: ')'
};

const PRECEDENCE = {
  [OPERATORS.STAR]: 3,
  [OPERATORS.CONCAT]: 2,
  [OPERATORS.UNION]: 1
};

/**
 * Inserts explicit concatenation operators '.' where concatenation is implicit.
 * e.g., 'ab' -> 'a.b', '(a|b)c' -> '(a|b).c', 'a*b' -> 'a*.b'
 * @param {string} regex - Raw infix regex
 * @returns {string} Regex with explicit '.' operators
 */
export function insertExplicitConcat(regex) {
  if (!regex || typeof regex !== 'string') return '';
  
  // Clean whitespace unless escaped
  const clean = regex.replace(/\s+/g, '');
  let result = '';

  for (let i = 0; i < clean.length; i++) {
    const curr = clean[i];
    result += curr;

    if (i + 1 < clean.length) {
      const next = clean[i + 1];

      // Conditions where concatenation occurs between clean[i] and clean[i+1]:
      // 1. Literal/star/closing paren followed by Literal or opening paren
      const isCurrOperand = curr !== OPERATORS.UNION && curr !== OPERATORS.LPAREN;
      const isNextOperand = next !== OPERATORS.UNION && next !== OPERATORS.STAR && next !== OPERATORS.RPAREN;

      if (isCurrOperand && isNextOperand) {
        result += OPERATORS.CONCAT;
      }
    }
  }

  return result;
}

/**
 * Converts infix regular expression with explicit concatenation into postfix notation.
 * Uses Dijkstra's Shunting-Yard algorithm adapted for regex tokens.
 * @param {string} regex - Raw infix regex
 * @returns {{ postfix: string, error: string | null }}
 */
export function regexToPostfix(regex) {
  if (!regex || regex.trim() === '') {
    return { postfix: '', error: 'Empty regular expression' };
  }

  try {
    const formatted = insertExplicitConcat(regex);
    const output = [];
    const operatorStack = [];

    for (let i = 0; i < formatted.length; i++) {
      const char = formatted[i];

      if (char === OPERATORS.LPAREN) {
        operatorStack.push(char);
      } else if (char === OPERATORS.RPAREN) {
        let popped = operatorStack.pop();
        let foundLeftParen = false;

        while (popped !== undefined) {
          if (popped === OPERATORS.LPAREN) {
            foundLeftParen = true;
            break;
          }
          output.push(popped);
          popped = operatorStack.pop();
        }

        if (!foundLeftParen) {
          return { postfix: '', error: 'Mismatched parentheses: missing "("' };
        }
      } else if (char === OPERATORS.STAR || char === OPERATORS.CONCAT || char === OPERATORS.UNION) {
        // Pop operators of greater or equal precedence
        while (
          operatorStack.length > 0 &&
          operatorStack[operatorStack.length - 1] !== OPERATORS.LPAREN &&
          (PRECEDENCE[operatorStack[operatorStack.length - 1]] || 0) >= PRECEDENCE[char]
        ) {
          output.push(operatorStack.pop());
        }
        operatorStack.push(char);
      } else {
        // Operand (literal symbol)
        output.push(char);
      }
    }

    while (operatorStack.length > 0) {
      const op = operatorStack.pop();
      if (op === OPERATORS.LPAREN) {
        return { postfix: '', error: 'Mismatched parentheses: unclosed "("' };
      }
      output.push(op);
    }

    return { postfix: output.join(''), error: null };
  } catch (err) {
    return { postfix: '', error: `Parsing error: ${err.message}` };
  }
}
