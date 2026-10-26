/**
 * FLAT Engine: Automaton String Simulator & Epsilon-Closure Computer
 * Academic Reference:
 *   - FLAT Module 1.8: Non-deterministic Finite Automata and Epsilon NFA
 *   - FLAT Module 1.4: Finite State Machine and Regular Languages
 *   - FLAT Module 2.7: Regular Expression to Finite Automata conversion
 *
 * Implements:
 * 1. Epsilon-closure computation via Depth-First Search
 * 2. Multi-state NFA simulation over input strings
 * 3. Step-by-step trace generation with ACCEPT / REJECT determination
 * Note: Never relies on built-in RegExp.test(). Executes state transitions manually.
 */

import { EPSILON } from './regexToAutomaton.js';

/**
 * Computes the epsilon-closure of a set of states in the automaton.
 * The epsilon-closure is the set of all states reachable via zero or more ε-transitions.
 * @param {Set<string> | string[]} stateSet - Initial state set
 * @param {Array<{from: string, to: string, symbol: string}>} transitions - Automaton transitions
 * @returns {Set<string>}
 */
export function computeEpsilonClosure(stateSet, transitions) {
  const closure = new Set(stateSet);
  const stack = Array.from(closure);

  while (stack.length > 0) {
    const curr = stack.pop();

    for (const t of transitions) {
      if (t.from === curr && t.symbol === EPSILON) {
        if (!closure.has(t.to)) {
          closure.add(t.to);
          stack.push(t.to);
        }
      }
    }
  }

  return closure;
}

/**
 * Transitions from an active state set on a single input symbol.
 * @param {Set<string>} activeStates - Current active states
 * @param {string} symbol - Input character
 * @param {Array<{from: string, to: string, symbol: string}>} transitions
 * @returns {Set<string>} New active state set after symbol and ε-closure
 */
export function transitionOnSymbol(activeStates, symbol, transitions) {
  const nextDirectStates = new Set();

  for (const state of activeStates) {
    for (const t of transitions) {
      if (t.from === state && t.symbol === symbol) {
        nextDirectStates.add(t.to);
      }
    }
  }

  return computeEpsilonClosure(nextDirectStates, transitions);
}

/**
 * Simulates the given automaton on an input string.
 * Generates an academic trace of all transitions and verdicts.
 * @param {Object} automaton - Formal automaton 5-tuple
 * @param {string} inputString - Input string to test
 * @returns {{
 *   accepted: boolean,
 *   trace: Array<{
 *     stepIndex: number,
 *     char: string,
 *     preStates: string[],
 *     postStates: string[],
 *     description: string
 *   }>,
 *   initialStates: string[],
 *   finalStates: string[],
 *   reason: string
 * }}
 */
export function simulateAutomaton(automaton, inputString = '') {
  if (!automaton || !automaton.startState || !automaton.transitions) {
    return {
      accepted: false,
      trace: [],
      initialStates: [],
      finalStates: [],
      reason: 'Invalid automaton structure'
    };
  }

  const { startState, acceptStates, transitions } = automaton;
  const acceptSet = new Set(acceptStates);

  // Initial state is ε-closure of {startState}
  let currentStates = computeEpsilonClosure([startState], transitions);
  const initialStates = Array.from(currentStates).sort();

  const trace = [];
  trace.push({
    stepIndex: 0,
    char: 'START (ε-closure)',
    preStates: [startState],
    postStates: initialStates,
    description: `Initial state set: ε-closure({${startState}}) = {${initialStates.join(', ')}}`
  });

  // Process characters
  for (let i = 0; i < inputString.length; i++) {
    const char = inputString[i];
    const preStates = Array.from(currentStates).sort();

    currentStates = transitionOnSymbol(currentStates, char, transitions);
    const postStates = Array.from(currentStates).sort();

    trace.push({
      stepIndex: i + 1,
      char,
      preStates,
      postStates,
      description: postStates.length > 0
        ? `Read '${char}': {${preStates.join(', ')}} -> {${postStates.join(', ')}}`
        : `Read '${char}': Trap state (no valid transitions)`
    });

    if (currentStates.size === 0) {
      // Early rejection (dead/trap state)
      break;
    }
  }

  const finalStates = Array.from(currentStates).sort();
  const hasAcceptState = finalStates.some(s => acceptSet.has(s));
  const accepted = hasAcceptState;

  const reason = accepted
    ? `String accepted: active states {${finalStates.join(', ')}} intersect with accept state(s) {${acceptStates.join(', ')}}`
    : `String rejected: active states {${finalStates.join(', ')}} do not contain any accept state(s) {${acceptStates.join(', ')}}`;

  return {
    accepted,
    trace,
    initialStates,
    finalStates,
    reason
  };
}
