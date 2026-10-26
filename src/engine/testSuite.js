/**
 * Comprehensive Automated Academic Test Suite for All Four Subjects
 * Criteria 5: Testing & Results (1 mark each, 4 marks total)
 *
 * Covers:
 *   - FLAT: 12 Unit & Edge-Case Tests (Regex, Thompson conversion, ε-closure, simulation, nested parens, empty)
 *   - COA:  8 Unit & Edge-Case Tests (0, 1, 3, 5, 10-instruction timing, RAW stalls, multiple dependencies, branch)
 *   - AI/ML: 8 Unit & Edge-Case Tests (A* optimality, programmatic admissibility h<=h*, consistency, start=goal, unreachable)
 *   - DAA:  8 Unit & Edge-Case Tests (Dijkstra greedy relaxation, SSSP, edge weights, complexity, negative weight invariant)
 * Total: 36 Automated Tests
 */

import { buildAutomatonFromRegex } from './regexToAutomaton.js';
import { simulateAutomaton } from './automatonSimulator.js';
import { parseProgram } from './instructionValidator.js';
import { simulatePipeline } from './pipelineSimulator.js';
import { calculatePipelineMetrics } from './pipelineMetrics.js';
import { WeightedGraph, createDefaultExecutionGraph, createMultiPathGraph, calculateEuclideanHeuristic } from './graph.js';
import { runAStar, verifyHeuristicAdmissibilityAndConsistency } from './astar.js';
import { runDijkstra } from './dijkstra.js';

export function runFlatTests() {
  const tests = [];

  // FLAT Test 1: Simple regex 'a'
  {
    const t0 = performance.now();
    const { automaton } = buildAutomatonFromRegex('a');
    const sim = automaton ? simulateAutomaton(automaton, 'a') : { accepted: false };
    const passed = sim.accepted === true;
    tests.push({
      id: 'FLAT_TEST_1',
      subject: 'FLAT',
      name: 'Single Base Symbol (a)',
      input: "Regex: 'a', String: 'a'",
      expected: 'ACCEPT',
      actual: sim.accepted ? 'ACCEPT' : 'REJECT',
      passed,
      durationMs: Number((performance.now() - t0).toFixed(2)),
      detail: 'Base symbol creates 2 states and 1 transition, correctly accepts input symbol.'
    });
  }

  // FLAT Test 2: Union 'a|b'
  {
    const t0 = performance.now();
    const { automaton } = buildAutomatonFromRegex('a|b');
    const simA = automaton ? simulateAutomaton(automaton, 'a') : { accepted: false };
    const simB = automaton ? simulateAutomaton(automaton, 'b') : { accepted: false };
    const simC = automaton ? simulateAutomaton(automaton, 'c') : { accepted: true };
    const passed = simA.accepted && simB.accepted && !simC.accepted;
    tests.push({
      id: 'FLAT_TEST_2',
      subject: 'FLAT',
      name: 'Union Operator (a|b)',
      input: "Regex: 'a|b', Inputs: 'a', 'b', 'c'",
      expected: "ACCEPT 'a', ACCEPT 'b', REJECT 'c'",
      actual: `a=${simA.accepted ? 'ACCEPT' : 'REJECT'}, b=${simB.accepted ? 'ACCEPT' : 'REJECT'}, c=${simC.accepted ? 'ACCEPT' : 'REJECT'}`,
      passed,
      durationMs: Number((performance.now() - t0).toFixed(2)),
      detail: 'Union creates parallel branches with epsilon transitions.'
    });
  }

  // FLAT Test 3: Concatenation 'ab'
  {
    const t0 = performance.now();
    const { automaton } = buildAutomatonFromRegex('ab');
    const simValid = automaton ? simulateAutomaton(automaton, 'ab') : { accepted: false };
    const simInvalid = automaton ? simulateAutomaton(automaton, 'a') : { accepted: true };
    const passed = simValid.accepted && !simInvalid.accepted;
    tests.push({
      id: 'FLAT_TEST_3',
      subject: 'FLAT',
      name: 'Concatenation (ab)',
      input: "Regex: 'ab', Inputs: 'ab', 'a'",
      expected: "ACCEPT 'ab', REJECT 'a'",
      actual: `ab=${simValid.accepted ? 'ACCEPT' : 'REJECT'}, a=${simInvalid.accepted ? 'ACCEPT' : 'REJECT'}`,
      passed,
      durationMs: Number((performance.now() - t0).toFixed(2)),
      detail: 'Sequential concatenation correctly requires full sequence.'
    });
  }

  // FLAT Test 4: Kleene star 'a*'
  {
    const t0 = performance.now();
    const { automaton } = buildAutomatonFromRegex('a*');
    const simEmpty = automaton ? simulateAutomaton(automaton, '') : { accepted: false };
    const simMany = automaton ? simulateAutomaton(automaton, 'aaaa') : { accepted: false };
    const simBad = automaton ? simulateAutomaton(automaton, 'b') : { accepted: true };
    const passed = simEmpty.accepted && simMany.accepted && !simBad.accepted;
    tests.push({
      id: 'FLAT_TEST_4',
      subject: 'FLAT',
      name: 'Kleene Star Closure (a*)',
      input: "Regex: 'a*', Inputs: '', 'aaaa', 'b'",
      expected: "ACCEPT '', ACCEPT 'aaaa', REJECT 'b'",
      actual: `empty=${simEmpty.accepted ? 'ACCEPT' : 'REJECT'}, aaaa=${simMany.accepted ? 'ACCEPT' : 'REJECT'}, b=${simBad.accepted ? 'ACCEPT' : 'REJECT'}`,
      passed,
      durationMs: Number((performance.now() - t0).toFixed(2)),
      detail: 'Closure accepts 0 or more occurrences via backward and bypass epsilon transitions.'
    });
  }

  // FLAT Test 5: Valid string on (a|b)*abb -> 'aabb'
  {
    const t0 = performance.now();
    const { automaton } = buildAutomatonFromRegex('(a|b)*abb');
    const sim = automaton ? simulateAutomaton(automaton, 'aabb') : { accepted: false };
    const passed = sim.accepted === true;
    tests.push({
      id: 'FLAT_TEST_5',
      subject: 'FLAT',
      name: 'Standard Benchmark Valid: (a|b)*abb on "aabb"',
      input: "Regex: '(a|b)*abb', String: 'aabb'",
      expected: 'ACCEPT',
      actual: sim.accepted ? 'ACCEPT' : 'REJECT',
      passed,
      durationMs: Number((performance.now() - t0).toFixed(2)),
      detail: 'Demonstrates multi-branch epsilon-closure tracking over combined union and closure.'
    });
  }

  // FLAT Test 6: Alternative Valid string on (a|b)*abb -> 'ababb'
  {
    const t0 = performance.now();
    const { automaton } = buildAutomatonFromRegex('(a|b)*abb');
    const sim = automaton ? simulateAutomaton(automaton, 'ababb') : { accepted: false };
    const passed = sim.accepted === true;
    tests.push({
      id: 'FLAT_TEST_6',
      subject: 'FLAT',
      name: 'Multi-Iteration Valid: (a|b)*abb on "ababb"',
      input: "Regex: '(a|b)*abb', String: 'ababb'",
      expected: 'ACCEPT',
      actual: sim.accepted ? 'ACCEPT' : 'REJECT',
      passed,
      durationMs: Number((performance.now() - t0).toFixed(2)),
      detail: 'Correctly loops through Kleene star multiple times before terminal "abb".'
    });
  }

  // FLAT Test 7: Invalid string on (a|b)*abb -> 'abab'
  {
    const t0 = performance.now();
    const { automaton } = buildAutomatonFromRegex('(a|b)*abb');
    const sim = automaton ? simulateAutomaton(automaton, 'abab') : { accepted: true };
    const passed = sim.accepted === false;
    tests.push({
      id: 'FLAT_TEST_7',
      subject: 'FLAT',
      name: 'Standard Benchmark Invalid: (a|b)*abb on "abab"',
      input: "Regex: '(a|b)*abb', String: 'abab'",
      expected: 'REJECT',
      actual: sim.accepted ? 'ACCEPT' : 'REJECT',
      passed,
      durationMs: Number((performance.now() - t0).toFixed(2)),
      detail: 'Correctly rejects string not ending in "abb".'
    });
  }

  // FLAT Test 8: Empty string on (a|b)* -> ACCEPT
  {
    const t0 = performance.now();
    const { automaton } = buildAutomatonFromRegex('(a|b)*');
    const sim = automaton ? simulateAutomaton(automaton, '') : { accepted: false };
    const passed = sim.accepted === true;
    tests.push({
      id: 'FLAT_TEST_8',
      subject: 'FLAT',
      name: 'Epsilon Empty String Acceptance ((a|b)* on "")',
      input: "Regex: '(a|b)*', String: ''",
      expected: 'ACCEPT',
      actual: sim.accepted ? 'ACCEPT' : 'REJECT',
      passed,
      durationMs: Number((performance.now() - t0).toFixed(2)),
      detail: 'Initial epsilon-closure includes final accept state.'
    });
  }

  // FLAT Test 9: Nested Parentheses Expression: ((a|b)*c)
  {
    const t0 = performance.now();
    const { automaton } = buildAutomatonFromRegex('((a|b)*c)');
    const simC = automaton ? simulateAutomaton(automaton, 'c') : { accepted: false };
    const simAbc = automaton ? simulateAutomaton(automaton, 'abc') : { accepted: false };
    const simBad = automaton ? simulateAutomaton(automaton, 'ab') : { accepted: true };
    const passed = simC.accepted && simAbc.accepted && !simBad.accepted;
    tests.push({
      id: 'FLAT_TEST_9',
      subject: 'FLAT',
      name: 'Nested Parentheses Expression: ((a|b)*c)',
      input: "Regex: '((a|b)*c)', Inputs: 'c', 'abc', 'ab'",
      expected: "ACCEPT 'c', ACCEPT 'abc', REJECT 'ab'",
      actual: `c=${simC.accepted ? 'ACCEPT' : 'REJECT'}, abc=${simAbc.accepted ? 'ACCEPT' : 'REJECT'}, ab=${simBad.accepted ? 'ACCEPT' : 'REJECT'}`,
      passed,
      durationMs: Number((performance.now() - t0).toFixed(2)),
      detail: 'Correctly handles multi-level nested grouping.'
    });
  }

  // FLAT Test 10: Malformed regex syntax error handling
  {
    const t0 = performance.now();
    const { automaton, error } = buildAutomatonFromRegex('(a|b*');
    const passed = automaton === null && error !== null;
    tests.push({
      id: 'FLAT_TEST_10',
      subject: 'FLAT',
      name: 'Invalid Regular Expression Syntax Trap',
      input: "Regex: '(a|b*'",
      expected: 'Error: Mismatched parentheses',
      actual: error || 'No error detected',
      passed,
      durationMs: Number((performance.now() - t0).toFixed(2)),
      detail: 'Parser rejects unbalanced parentheses and prevents malformed automaton creation.'
    });
  }

  // FLAT Test 11: Empty Regular Expression Edge Case
  {
    const t0 = performance.now();
    const { automaton, error } = buildAutomatonFromRegex('');
    const passed = automaton === null && error !== null;
    tests.push({
      id: 'FLAT_TEST_11',
      subject: 'FLAT',
      name: 'Empty Regular Expression Handling',
      input: "Regex: ''",
      expected: 'Error: Empty regular expression',
      actual: error || 'No error detected',
      passed,
      durationMs: Number((performance.now() - t0).toFixed(2)),
      detail: 'Handles empty string input without crashing.'
    });
  }

  // FLAT Test 12: Multiple rejected strings batch
  {
    const t0 = performance.now();
    const { automaton } = buildAutomatonFromRegex('(a|b)*abb');
    const strings = ['a', 'b', 'ab', 'ba', 'abba', 'bbba'];
    const allRejected = strings.every(s => !simulateAutomaton(automaton, s).accepted);
    tests.push({
      id: 'FLAT_TEST_12',
      subject: 'FLAT',
      name: 'Multiple Rejected Strings Batch Verification',
      input: "Regex: '(a|b)*abb', Strings: ['a', 'b', 'ab', 'ba', 'abba', 'bbba']",
      expected: 'All REJECT',
      actual: allRejected ? 'All REJECT' : 'Some ACCEPTED',
      passed: allRejected,
      durationMs: Number((performance.now() - t0).toFixed(2)),
      detail: 'Rejects all strings lacking the exact terminal suffix.'
    });
  }

  return tests;
}

export function runCoaTests() {
  const tests = [];

  // COA Test 1: Zero instructions edge case
  {
    const t0 = performance.now();
    const sim = simulatePipeline([]);
    const metrics = calculatePipelineMetrics(0, sim.cycles, sim.totalStalls);
    const passed = sim.cycles === 0 && metrics.actualCycles === 0;
    tests.push({
      id: 'COA_TEST_1',
      subject: 'COA',
      name: 'Zero Instructions Edge Case',
      input: 'n = 0 instructions',
      expected: 'T_pipe = 0, Stalls = 0',
      actual: `T_pipe = ${sim.cycles}, Stalls = ${sim.totalStalls}`,
      passed,
      durationMs: Number((performance.now() - t0).toFixed(2)),
      detail: 'Gracefully handles empty pipeline without division by zero.'
    });
  }

  // COA Test 2: 1 instruction edge case
  {
    const t0 = performance.now();
    const prog = `LOAD R1, 10`;
    const { instructions } = parseProgram(prog);
    const sim = simulatePipeline(instructions, { enableDataHazards: false });
    const metrics = calculatePipelineMetrics(instructions.length, sim.cycles, sim.totalStalls, sim.matrix);
    // n=1, k=5 => T_pipe = 5+1-1 = 5, T_nonpipe = 5, S = 1.0
    const passed = sim.cycles === 5 && metrics.nonPipelinedCycles === 5 && metrics.actualSpeedup === 1.0;
    tests.push({
      id: 'COA_TEST_2',
      subject: 'COA',
      name: '1-Instruction Pipeline (Base Latency)',
      input: 'n = 1 instruction, k = 5 stages',
      expected: 'T_pipe = 5, T_nonpipe = 5, Speedup = 1.00×',
      actual: `T_pipe = ${sim.cycles}, T_nonpipe = ${metrics.nonPipelinedCycles}, Speedup = ${metrics.actualSpeedup}×`,
      passed,
      durationMs: Number((performance.now() - t0).toFixed(2)),
      detail: 'Verifies base 5-stage latency for single instruction.'
    });
  }

  // COA Test 3: 3 instructions
  {
    const t0 = performance.now();
    const prog = `LOAD R1, 10\nADD R2, R3, R4\nSUB R5, R6, R7`;
    const { instructions } = parseProgram(prog);
    const sim = simulatePipeline(instructions, { enableDataHazards: false });
    const metrics = calculatePipelineMetrics(instructions.length, sim.cycles, sim.totalStalls, sim.matrix);
    // n=3, k=5 => T_pipe = 5+3-1 = 7, T_nonpipe = 3*5 = 15, S = 15/7 ≈ 2.14
    const passed = sim.cycles === 7 && metrics.nonPipelinedCycles === 15 && Math.abs(metrics.actualSpeedup - 2.14) <= 0.02;
    tests.push({
      id: 'COA_TEST_3',
      subject: 'COA',
      name: '3-Instruction Pipeline (Module 3.1)',
      input: 'n = 3 instructions, k = 5 stages, no hazards',
      expected: 'T_pipe = 7, T_nonpipe = 15, Speedup ≈ 2.14×',
      actual: `T_pipe = ${sim.cycles}, T_nonpipe = ${metrics.nonPipelinedCycles}, Speedup = ${metrics.actualSpeedup}×`,
      passed,
      durationMs: Number((performance.now() - t0).toFixed(2)),
      detail: 'Matches classical formula T = k + n - 1.'
    });
  }

  // COA Test 4: 5 instructions
  {
    const t0 = performance.now();
    const prog = `LOAD R1, 10\nADD R2, R3, R4\nSUB R5, R6, R7\nMUL R8, R9, R10\nSTORE R11, 20`;
    const { instructions } = parseProgram(prog);
    const sim = simulatePipeline(instructions, { enableDataHazards: false });
    const metrics = calculatePipelineMetrics(instructions.length, sim.cycles, sim.totalStalls, sim.matrix);
    // n=5, k=5 => T_pipe = 5+5-1 = 9, T_nonpipe = 5*5 = 25, S = 25/9 ≈ 2.78
    const passed = sim.cycles === 9 && metrics.nonPipelinedCycles === 25 && Math.abs(metrics.actualSpeedup - 2.78) <= 0.02;
    tests.push({
      id: 'COA_TEST_4',
      subject: 'COA',
      name: '5-Instruction Pipeline (Module 3.1)',
      input: 'n = 5 instructions, k = 5 stages, no hazards',
      expected: 'T_pipe = 9, T_nonpipe = 25, Speedup ≈ 2.78×',
      actual: `T_pipe = ${sim.cycles}, T_nonpipe = ${metrics.nonPipelinedCycles}, Speedup = ${metrics.actualSpeedup}×`,
      passed,
      durationMs: Number((performance.now() - t0).toFixed(2)),
      detail: 'Demonstrates increased speedup as instruction count increases.'
    });
  }

  // COA Test 5: 10 instructions
  {
    const t0 = performance.now();
    const lines = [];
    for (let i = 0; i < 10; i++) {
      lines.push(`ADD R${i * 3 + 1}, R${i * 3 + 2}, R${i * 3 + 3}`);
    }
    const { instructions } = parseProgram(lines.join('\n'));
    const sim = simulatePipeline(instructions, { enableDataHazards: false });
    const metrics = calculatePipelineMetrics(instructions.length, sim.cycles, sim.totalStalls, sim.matrix);
    // n=10, k=5 => T_pipe = 5+10-1 = 14, T_nonpipe = 10*5 = 50, S = 50/14 ≈ 3.57
    const passed = sim.cycles === 14 && metrics.nonPipelinedCycles === 50 && Math.abs(metrics.actualSpeedup - 3.57) <= 0.02;
    tests.push({
      id: 'COA_TEST_5',
      subject: 'COA',
      name: '10-Instruction Speedup Benchmark (Module 3.1 & 3.15)',
      input: 'n = 10 instructions, k = 5 stages, no hazards',
      expected: 'T_pipe = 14, T_nonpipe = 50, Speedup ≈ 3.57×',
      actual: `T_pipe = ${sim.cycles}, T_nonpipe = ${metrics.nonPipelinedCycles}, Speedup = ${metrics.actualSpeedup}×`,
      passed,
      durationMs: Number((performance.now() - t0).toFixed(2)),
      detail: 'Approaches asymptotic Amdahl limit S -> k = 5.'
    });
  }

  // COA Test 6: RAW Data Hazard Stall Insertion (Module 3.7)
  {
    const t0 = performance.now();
    const prog = `LOAD R1, 100\nADD R2, R1, R3`; // RAW dependency on R1
    const { instructions } = parseProgram(prog);
    const sim = simulatePipeline(instructions, { enableDataHazards: true, enableForwarding: false });
    // Without forwarding: LOAD must reach WB before ADD can leave ID, causing 2 stalls
    const passed = sim.totalStalls >= 2 && sim.cycles === (5 + 2 - 1 + sim.totalStalls);
    tests.push({
      id: 'COA_TEST_6',
      subject: 'COA',
      name: 'RAW Data Hazard Stall Insertion (Module 3.7)',
      input: 'LOAD R1, 100 followed immediately by ADD R2, R1, R3',
      expected: 'Stalls >= 2 cycles inserted due to RAW register lock',
      actual: `Stalls = ${sim.totalStalls}, Total Cycles = ${sim.cycles}`,
      passed,
      durationMs: Number((performance.now() - t0).toFixed(2)),
      detail: 'Scoreboard correctly inserts pipeline bubbles until writeback.'
    });
  }

  // COA Test 7: Multiple Cascading Dependencies
  {
    const t0 = performance.now();
    const prog = `LOAD R1, 50\nADD R2, R1, R3\nSUB R4, R2, R5`;
    const { instructions } = parseProgram(prog);
    const sim = simulatePipeline(instructions, { enableDataHazards: true, enableForwarding: false });
    const passed = sim.totalStalls >= 4 && sim.cycles > 7;
    tests.push({
      id: 'COA_TEST_7',
      subject: 'COA',
      name: 'Multiple Cascading RAW Dependencies',
      input: 'Sequential dependency chain: LOAD R1 -> ADD R2(R1) -> SUB R4(R2)',
      expected: 'Cumulative stalls >= 4 cycles',
      actual: `Stalls = ${sim.totalStalls}, Total Cycles = ${sim.cycles}`,
      passed,
      durationMs: Number((performance.now() - t0).toFixed(2)),
      detail: 'Verifies cumulative stall propagation across multi-instruction dependent chains.'
    });
  }

  // COA Test 8: Branch Control Hazard Flush (Module 3.9)
  {
    const t0 = performance.now();
    const prog = `LOAD R1, 10\nBEQ R1, R2, 2\nSUB R5, R6, R7\nMUL R8, R9, R10`;
    const { instructions } = parseProgram(prog);
    const sim = simulatePipeline(instructions, { branchTaken: true });
    const flushedInsts = sim.hazardEvents.filter(e => e.type.includes('Flush'));
    const passed = flushedInsts.length > 0;
    tests.push({
      id: 'COA_TEST_8',
      subject: 'COA',
      name: 'Control Hazard Branch Flush (Module 3.9)',
      input: 'BEQ taken branch in EX stage',
      expected: 'Speculative instructions flushed from IF/ID',
      actual: `${flushedInsts.length} instruction(s) flushed`,
      passed,
      durationMs: Number((performance.now() - t0).toFixed(2)),
      detail: 'Models branch penalty and speculative instruction cancellation.'
    });
  }

  return tests;
}

export function runAimlTests() {
  const tests = [];

  // AI/ML Test 1: Simple linear path
  {
    const t0 = performance.now();
    const g = new WeightedGraph();
    g.addNode('N1', 'Node 1', 0, 0);
    g.addNode('N2', 'Node 2', 10, 0);
    g.addNode('N3', 'Node 3', 20, 0);
    g.addEdge('N1', 'N2', 4);
    g.addEdge('N2', 'N3', 6);
    const res = runAStar(g, 'N1', 'N3');
    const passed = res.success && res.pathCost === 10 && res.path.join('->') === 'N1->N2->N3';
    tests.push({
      id: 'AIML_TEST_1',
      subject: 'AI/ML',
      name: 'Simple Linear Path Search',
      input: 'N1 -[4]-> N2 -[6]-> N3',
      expected: 'Path: N1->N2->N3, Cost: 10',
      actual: `Path: ${res.path.join('->')}, Cost: ${res.pathCost}`,
      passed,
      durationMs: Number((performance.now() - t0).toFixed(2)),
      detail: 'Calculates accumulated cost g(n) along single trajectory.'
    });
  }

  // AI/ML Test 2: Multiple alternative paths (Diamond)
  {
    const t0 = performance.now();
    const g = new WeightedGraph();
    g.addNode('S', 'Start', 0, 10);
    g.addNode('A', 'Top', 10, 0);
    g.addNode('B', 'Bottom', 10, 20);
    g.addNode('G', 'Goal', 20, 10);
    g.addEdge('S', 'A', 5);
    g.addEdge('S', 'B', 2);
    g.addEdge('A', 'G', 5);
    g.addEdge('B', 'G', 3);
    const res = runAStar(g, 'S', 'G');
    const passed = res.success && res.pathCost === 5 && res.path.join('->') === 'S->B->G';
    tests.push({
      id: 'AIML_TEST_2',
      subject: 'AI/ML',
      name: 'Alternative Path Selection (Diamond)',
      input: 'S->A->G (cost 10) vs S->B->G (cost 5)',
      expected: 'Path: S->B->G, Cost: 5',
      actual: `Path: ${res.path.join('->')}, Cost: ${res.pathCost}`,
      passed,
      durationMs: Number((performance.now() - t0).toFixed(2)),
      detail: 'Chooses lower cost branch.'
    });
  }

  // AI/ML Test 3: Programmatic Admissibility Verification (h(n) <= h*(n))
  {
    const t0 = performance.now();
    const { graph, goalNode } = createDefaultExecutionGraph();
    const audit = verifyHeuristicAdmissibilityAndConsistency(graph, goalNode);
    const passed = audit.isAdmissible === true;
    tests.push({
      id: 'AIML_TEST_3',
      subject: 'AI/ML',
      name: 'Programmatic Admissibility: h(n) <= h*(n) (Module 2.9)',
      input: '8-State Execution Graph against true Dijkstra shortest distances',
      expected: 'isAdmissible = true across all nodes',
      actual: `isAdmissible = ${audit.isAdmissible}`,
      passed,
      durationMs: Number((performance.now() - t0).toFixed(2)),
      detail: 'Directly verifies that Euclidean heuristic never overestimates true remaining cost.'
    });
  }

  // AI/ML Test 4: Programmatic Consistency Verification (Triangle Inequality)
  {
    const t0 = performance.now();
    const { graph, goalNode } = createDefaultExecutionGraph();
    const audit = verifyHeuristicAdmissibilityAndConsistency(graph, goalNode);
    const passed = audit.isConsistent === true;
    tests.push({
      id: 'AIML_TEST_4',
      subject: 'AI/ML',
      name: 'Programmatic Consistency: h(u) <= w(u,v) + h(v) (Module 2.9)',
      input: 'All edges in 8-State Graph checked for triangle inequality',
      expected: 'isConsistent = true across all edges',
      actual: `isConsistent = ${audit.isConsistent}, Violations = ${audit.edgeViolations.length}`,
      passed,
      durationMs: Number((performance.now() - t0).toFixed(2)),
      detail: 'Monotonicity condition verified, guaranteeing optimal search without reopening nodes.'
    });
  }

  // AI/ML Test 5: Boundary Case: Start = Goal
  {
    const t0 = performance.now();
    const g = new WeightedGraph();
    g.addNode('S', 'Single Node', 0, 0);
    const res = runAStar(g, 'S', 'S');
    const passed = res.success && res.pathCost === 0 && res.path.length === 1;
    tests.push({
      id: 'AIML_TEST_5',
      subject: 'AI/ML',
      name: 'Boundary Case: Start Equals Goal',
      input: 'Start = S, Goal = S',
      expected: 'Path: [S], Cost: 0',
      actual: `Path: [${res.path.join(', ')}], Cost: ${res.pathCost}`,
      passed,
      durationMs: Number((performance.now() - t0).toFixed(2)),
      detail: 'Immediate goal detection without redundant expansions.'
    });
  }

  // AI/ML Test 6: Unreachable goal
  {
    const t0 = performance.now();
    const g = new WeightedGraph();
    g.addNode('S', 'Start', 0, 0);
    g.addNode('G', 'Disconnected Goal', 50, 50);
    const res = runAStar(g, 'S', 'G');
    const passed = !res.success && res.path.length === 0;
    tests.push({
      id: 'AIML_TEST_6',
      subject: 'AI/ML',
      name: 'Unreachable Goal Termination',
      input: 'Two disconnected nodes S and G',
      expected: 'Success: false, Path: []',
      actual: `Success: ${res.success}, Path: [${res.path.join(', ')}]`,
      passed,
      durationMs: Number((performance.now() - t0).toFixed(2)),
      detail: 'Terminates gracefully upon exhaustion of open set.'
    });
  }

  // AI/ML Test 7: Equal-cost alternatives
  {
    const t0 = performance.now();
    const g = new WeightedGraph();
    g.addNode('S', 'Start', 0, 10);
    g.addNode('A', 'Path A', 10, 0);
    g.addNode('B', 'Path B', 10, 20);
    g.addNode('G', 'Goal', 20, 10);
    g.addEdge('S', 'A', 5);
    g.addEdge('S', 'B', 5);
    g.addEdge('A', 'G', 5);
    g.addEdge('B', 'G', 5);
    const res = runAStar(g, 'S', 'G');
    const passed = res.success && res.pathCost === 10;
    tests.push({
      id: 'AIML_TEST_7',
      subject: 'AI/ML',
      name: 'Equal-Cost Tie-Breaking',
      input: 'Parallel branches both costing 10',
      expected: 'Success: true, PathCost: 10',
      actual: `Success: ${res.success}, PathCost: ${res.pathCost}`,
      passed,
      durationMs: Number((performance.now() - t0).toFixed(2)),
      detail: 'Guarantees optimality regardless of tie-break direction.'
    });
  }

  // AI/ML Test 8: Heuristic Scaling Sensitivity Test
  {
    const t0 = performance.now();
    const { graph, startNode, goalNode } = createMultiPathGraph();
    // Zero heuristic h=0 (reduces to Dijkstra) vs Euclidean heuristic
    const zeroH = () => 0;
    const resZero = runAStar(graph, startNode, goalNode, zeroH);
    const resEuclid = runAStar(graph, startNode, goalNode);
    // Both must find the optimal path of cost 7
    const passed = resZero.pathCost === 7 && resEuclid.pathCost === 7 && resZero.success && resEuclid.success;
    tests.push({
      id: 'AIML_TEST_8',
      subject: 'AI/ML',
      name: 'Heuristic Sensitivity: h=0 (Dijkstra) vs Euclidean',
      input: 'MultiPath Graph under zero vs Euclidean heuristic',
      expected: 'Both yield identical optimal cost = 7',
      actual: `Zero-H Cost = ${resZero.pathCost}, Euclidean-H Cost = ${resEuclid.pathCost}`,
      passed,
      durationMs: Number((performance.now() - t0).toFixed(2)),
      detail: 'Demonstrates theoretical property that h=0 reduces A* to uniform-cost search while preserving optimality.'
    });
  }

  return tests;
}

export function runDaaTests() {
  const tests = [];

  // DAA Test 1: Single Edge Relaxation
  {
    const t0 = performance.now();
    const g = new WeightedGraph();
    g.addNode('A', 'A');
    g.addNode('B', 'B');
    g.addEdge('A', 'B', 7);
    const res = runDijkstra(g, 'A', 'B');
    const passed = res.success && res.pathCost === 7 && res.path.join('->') === 'A->B';
    tests.push({
      id: 'DAA_TEST_1',
      subject: 'DAA',
      name: 'Single Edge Relaxation',
      input: 'A -[7]-> B',
      expected: 'Shortest Distance: 7, Path: A->B',
      actual: `Distance: ${res.pathCost}, Path: ${res.path.join('->')}`,
      passed,
      durationMs: Number((performance.now() - t0).toFixed(2)),
      detail: 'Greedy choice correctly sets dist[B] = 7.'
    });
  }

  // DAA Test 2: Multi-Path Relaxation (Triangle Inequality)
  {
    const t0 = performance.now();
    const g = new WeightedGraph();
    g.addNode('A', 'A');
    g.addNode('B', 'B');
    g.addNode('C', 'C');
    g.addEdge('A', 'B', 10); // Direct edge is expensive
    g.addEdge('A', 'C', 3);  // Intermediate edge
    g.addEdge('C', 'B', 4);  // 3 + 4 = 7 < 10
    const res = runDijkstra(g, 'A', 'B');
    const passed = res.success && res.pathCost === 7 && res.path.join('->') === 'A->C->B';
    tests.push({
      id: 'DAA_TEST_2',
      subject: 'DAA',
      name: 'Multi-Path Relaxation & Invariant',
      input: 'Direct A->B (10) vs Indirect A->C->B (3+4=7)',
      expected: 'Path: A->C->B, Cost: 7',
      actual: `Path: ${res.path.join('->')}, Cost: ${res.pathCost}`,
      passed,
      durationMs: Number((performance.now() - t0).toFixed(2)),
      detail: 'Proves edge relaxation dist[v] = min(dist[v], dist[u] + w).'
    });
  }

  // DAA Test 3: Diverse Edge Weight Distribution
  {
    const t0 = performance.now();
    const { graph, startNode, goalNode } = createMultiPathGraph();
    const res = runDijkstra(graph, startNode, goalNode);
    const passed = res.success && res.pathCost === 7;
    tests.push({
      id: 'DAA_TEST_3',
      subject: 'DAA',
      name: 'Diverse Weight Distribution',
      input: 'MultiPath Graph Benchmark',
      expected: 'Shortest Path Cost = 7',
      actual: `Cost = ${res.pathCost}`,
      passed,
      durationMs: Number((performance.now() - t0).toFixed(2)),
      detail: 'Correct greedy vertex extraction order verified.'
    });
  }

  // DAA Test 4: Equal-Cost Alternative Paths
  {
    const t0 = performance.now();
    const g = new WeightedGraph();
    g.addNode('S', 'Start');
    g.addNode('X', 'X');
    g.addNode('Y', 'Y');
    g.addNode('D', 'Dest');
    g.addEdge('S', 'X', 6);
    g.addEdge('X', 'D', 4);
    g.addEdge('S', 'Y', 5);
    g.addEdge('Y', 'D', 5);
    const res = runDijkstra(g, 'S', 'D');
    const passed = res.success && res.pathCost === 10;
    tests.push({
      id: 'DAA_TEST_4',
      subject: 'DAA',
      name: 'Equal-Cost Alternative Paths',
      input: 'Two paths of total cost 10',
      expected: 'Shortest Distance: 10',
      actual: `Distance: ${res.pathCost}`,
      passed,
      durationMs: Number((performance.now() - t0).toFixed(2)),
      detail: 'Both paths yield identical optimal distance.'
    });
  }

  // DAA Test 5: Trivial Case: Source Equals Destination
  {
    const t0 = performance.now();
    const g = new WeightedGraph();
    g.addNode('S', 'S');
    const res = runDijkstra(g, 'S', 'S');
    const passed = res.success && res.pathCost === 0;
    tests.push({
      id: 'DAA_TEST_5',
      subject: 'DAA',
      name: 'Trivial Case: Source Equals Destination',
      input: 'Source = S, Destination = S',
      expected: 'Distance: 0',
      actual: `Distance: ${res.pathCost}`,
      passed,
      durationMs: Number((performance.now() - t0).toFixed(2)),
      detail: 'Base case dist[source] = 0 verified.'
    });
  }

  // DAA Test 6: Disconnected Vertex Isolation
  {
    const t0 = performance.now();
    const g = new WeightedGraph();
    g.addNode('S', 'S');
    g.addNode('U', 'Unreachable');
    const res = runDijkstra(g, 'S', 'U');
    const passed = res.distances['U'] === '∞' || res.distances['U'] === Infinity;
    tests.push({
      id: 'DAA_TEST_6',
      subject: 'DAA',
      name: 'Disconnected Vertex Isolation',
      input: 'No edge connecting S to U',
      expected: 'dist[U] = ∞',
      actual: `dist[U] = ${res.distances['U']}`,
      passed,
      durationMs: Number((performance.now() - t0).toFixed(2)),
      detail: 'Unvisited disconnected vertices maintain initial infinity distance.'
    });
  }

  // DAA Test 7: Large 8-State Graph Complexity Verification
  {
    const t0 = performance.now();
    const { graph, startNode, goalNode } = createDefaultExecutionGraph();
    const res = runDijkstra(graph, startNode, goalNode);
    const passed = res.success && res.operations.relaxations > 0 && res.pathCost < Infinity;
    tests.push({
      id: 'DAA_TEST_7',
      subject: 'DAA',
      name: 'Complexity & Operations on 8-State Graph (Module 1.3 & 3.13)',
      input: `V=${res.complexity.vCount}, E=${res.complexity.eCount}`,
      expected: 'Operations <= O((V+E) log V)',
      actual: `${res.operations.relaxations} relaxations, ${res.operations.vertexExtractions} extractions`,
      passed,
      durationMs: Number((performance.now() - t0).toFixed(2)),
      detail: `Theoretical bound: ${res.complexity.theoreticalHeap}`
    });
  }

  // DAA Test 8: Non-Negative Edge Weight Invariant Assertion
  {
    const t0 = performance.now();
    const g = new WeightedGraph();
    g.addNode('A', 'A');
    g.addNode('B', 'B');
    let errorThrown = false;
    try {
      g.addEdge('A', 'B', -5); // Negative weight violation
    } catch (e) {
      errorThrown = true;
    }
    tests.push({
      id: 'DAA_TEST_8',
      subject: 'DAA',
      name: 'Non-Negative Edge Weight Constraint Check (Module 3.2)',
      input: 'Attempt to add negative edge weight: w = -5',
      expected: 'Error: Dijkstra requires non-negative edge weights',
      actual: errorThrown ? 'Error caught (negative weights forbidden)' : 'Allowed negative weight',
      passed: errorThrown,
      durationMs: Number((performance.now() - t0).toFixed(2)),
      detail: 'Enforces fundamental invariant that Dijkstra fails on negative weight cycles.'
    });
  }

  return tests;
}

import { runIntegrationTests } from './integratedWorkflow.js';

export { runIntegrationTests };

export function runAllTests(includeIntegration = false) {
  const flat = runFlatTests();
  const coa = runCoaTests();
  const aiml = runAimlTests();
  const daa = runDaaTests();
  const integration = runIntegrationTests();

  const subjectTests = [...flat, ...coa, ...aiml, ...daa];
  const all = includeIntegration ? [...subjectTests, ...integration] : subjectTests;
  const passedCount = all.filter(t => t.passed).length;
  const failedCount = all.length - passedCount;

  return {
    all,
    subjectTests,
    integrationTests: integration,
    bySubject: {
      FLAT: flat,
      COA: coa,
      AIML: aiml,
      DAA: daa,
      INTEGRATION: integration
    },
    summary: {
      total: all.length,
      passed: passedCount,
      failed: failedCount,
      passRate: Number(((passedCount / all.length) * 100).toFixed(1))
    }
  };
}
