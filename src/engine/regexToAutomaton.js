/**
 * FLAT Engine: Thompson's Construction (Regex -> Finite Automaton)
 * Academic Reference:
 *   - FLAT Module 2.7: Regular Expression to Finite Automata conversion (PRIMARY)
 *   - FLAT Module 1.4: Finite State Machine and Regular Languages
 *   - FLAT Module 1.8: Non-deterministic Finite Automata and Epsilon NFA
 *   - FLAT Module 2.2: Kleene's theorem and Operations on Regular Expressions
 *
 * Implements:
 * Inductive Thompson's Construction:
 *   1. Base Symbol fragment
 *   2. Union fragment (A | B)
 *   3. Concatenation fragment (A . B)
 *   4. Kleene Star fragment (A*)
 * Produces formal 5-tuple: M = (Q, Sigma, delta, q0, F)
 */

import { OPERATORS, regexToPostfix } from './regexParser.js';

export const EPSILON = 'ε';

class StateCounter {
  constructor() {
    this.count = 0;
  }
  nextState() {
    const id = `q${this.count++}`;
    return id;
  }
  reset() {
    this.count = 0;
  }
}

/**
 * Creates a base automaton fragment for a single character symbol.
 * s0 -- c --> s1
 */
function createBaseFragment(symbol, stateGen) {
  const start = stateGen.nextState();
  const accept = stateGen.nextState();

  return {
    start,
    accept,
    states: [start, accept],
    alphabet: symbol === EPSILON ? [] : [symbol],
    transitions: [
      { from: start, to: accept, symbol }
    ]
  };
}

/**
 * Creates a concatenation fragment (A . B)
 * A.accept -- ε --> B.start
 */
function createConcatFragment(fragA, fragB) {
  const start = fragA.start;
  const accept = fragB.accept;
  const states = Array.from(new Set([...fragA.states, ...fragB.states]));
  const alphabet = Array.from(new Set([...fragA.alphabet, ...fragB.alphabet]));

  const transitions = [
    ...fragA.transitions,
    ...fragB.transitions,
    { from: fragA.accept, to: fragB.start, symbol: EPSILON }
  ];

  return { start, accept, states, alphabet, transitions };
}

/**
 * Creates a union fragment (A | B)
 * New start -> ε -> A.start and B.start
 * A.accept and B.accept -> ε -> New accept
 */
function createUnionFragment(fragA, fragB, stateGen) {
  const start = stateGen.nextState();
  const accept = stateGen.nextState();

  const states = Array.from(new Set([start, accept, ...fragA.states, ...fragB.states]));
  const alphabet = Array.from(new Set([...fragA.alphabet, ...fragB.alphabet]));

  const transitions = [
    ...fragA.transitions,
    ...fragB.transitions,
    { from: start, to: fragA.start, symbol: EPSILON },
    { from: start, to: fragB.start, symbol: EPSILON },
    { from: fragA.accept, to: accept, symbol: EPSILON },
    { from: fragB.accept, to: accept, symbol: EPSILON }
  ];

  return { start, accept, states, alphabet, transitions };
}

/**
 * Creates a Kleene Star fragment (A*)
 * New start -> ε -> A.start and New accept
 * A.accept -> ε -> A.start and New accept
 */
function createStarFragment(fragA, stateGen) {
  const start = stateGen.nextState();
  const accept = stateGen.nextState();

  const states = Array.from(new Set([start, accept, ...fragA.states]));
  const alphabet = [...fragA.alphabet];

  const transitions = [
    ...fragA.transitions,
    { from: start, to: fragA.start, symbol: EPSILON },
    { from: start, to: accept, symbol: EPSILON },
    { from: fragA.accept, to: fragA.start, symbol: EPSILON },
    { from: fragA.accept, to: accept, symbol: EPSILON }
  ];

  return { start, accept, states, alphabet, transitions };
}

/**
 * Converts a regular expression string into a formal finite automaton via Thompson's Construction.
 * @param {string} regex - Regular expression string
 * @returns {{
 *   automaton: {
 *     states: string[],
 *     alphabet: string[],
 *     transitions: Array<{from: string, to: string, symbol: string}>,
 *     startState: string,
 *     acceptStates: string[]
 *   } | null,
 *   postfix: string,
 *   steps: Array<{ step: number, operation: string, description: string }>,
 *   error: string | null
 * }}
 */
export function buildAutomatonFromRegex(regex) {
  const { postfix, error } = regexToPostfix(regex);
  if (error) {
    return { automaton: null, postfix: '', steps: [], error };
  }

  const stateGen = new StateCounter();
  const stack = [];
  const steps = [];
  let stepCounter = 1;

  try {
    for (let i = 0; i < postfix.length; i++) {
      const token = postfix[i];

      if (token === OPERATORS.STAR) {
        if (stack.length < 1) {
          return { automaton: null, postfix, steps, error: 'Invalid syntax: Kleene star requires an operand' };
        }
        const frag = stack.pop();
        const starFrag = createStarFragment(frag, stateGen);
        stack.push(starFrag);
        steps.push({
          step: stepCounter++,
          operation: 'Kleene Star (*)',
          description: `Applied Kleene Star to fragment: created start ${starFrag.start} and accept ${starFrag.accept}`
        });
      } else if (token === OPERATORS.CONCAT) {
        if (stack.length < 2) {
          return { automaton: null, postfix, steps, error: 'Invalid syntax: Concatenation requires two operands' };
        }
        const fragB = stack.pop();
        const fragA = stack.pop();
        const concatFrag = createConcatFragment(fragA, fragB);
        stack.push(concatFrag);
        steps.push({
          step: stepCounter++,
          operation: 'Concatenation (·)',
          description: `Connected accept state ${fragA.accept} to start state ${fragB.start} via ${EPSILON}`
        });
      } else if (token === OPERATORS.UNION) {
        if (stack.length < 2) {
          return { automaton: null, postfix, steps, error: 'Invalid syntax: Union requires two operands' };
        }
        const fragB = stack.pop();
        const fragA = stack.pop();
        const unionFrag = createUnionFragment(fragA, fragB, stateGen);
        stack.push(unionFrag);
        steps.push({
          step: stepCounter++,
          operation: 'Union (|)',
          description: `Created branching from ${unionFrag.start} to (${fragA.start}, ${fragB.start}) and merged to ${unionFrag.accept}`
        });
      } else {
        // Literal symbol
        const baseFrag = createBaseFragment(token, stateGen);
        stack.push(baseFrag);
        steps.push({
          step: stepCounter++,
          operation: `Base Symbol (${token})`,
          description: `Created initial transition: ${baseFrag.start} --[${token}]--> ${baseFrag.accept}`
        });
      }
    }

    if (stack.length !== 1) {
      return { automaton: null, postfix, steps, error: 'Malformed expression: incomplete reduction' };
    }

    const finalFrag = stack[0];
    const automaton = {
      states: finalFrag.states,
      alphabet: finalFrag.alphabet.sort(),
      transitions: finalFrag.transitions,
      startState: finalFrag.start,
      acceptStates: [finalFrag.accept]
    };

    return { automaton, postfix, steps, error: null };
  } catch (err) {
    return { automaton: null, postfix, steps, error: `Automaton construction failed: ${err.message}` };
  }
}
