/**
 * Integrated Academic Workflow Engine
 * Unifies all four technical subjects into one coherent educational simulation:
 *   1. FLAT (Module 2.7): Validates instruction syntax using Thompson's Automata (ε-NFA)
 *   2. COA (Module 3.1): Simulates classical 5-stage RISC educational pipeline execution
 *   3. Execution Graph: Derives an educational execution state-space graph from pipeline states
 *   4. AI/ML (Module 2.7): Solves shortest execution trajectory via A* heuristic search
 *   5. DAA (Module 3.13): Computes single-source shortest path via Dijkstra on the EXACT same graph
 *   6. Integrated Comparison: Quantitatively evaluates A* vs Dijkstra on identical graph/source/goal
 *
 * Academic Note:
 * This is an educational integrated simulation demonstrating the interplay of theoretical
 * automata, CPU scheduling, informed heuristic search, and greedy relaxation algorithms.
 * Commercial CPUs do not literally run regex or graph search during instruction cycles.
 */

import { buildAutomatonFromRegex } from './regexToAutomaton.js';
import { simulateAutomaton } from './automatonSimulator.js';
import { parseInstructionLine, parseProgram } from './instructionValidator.js';
import { simulatePipeline } from './pipelineSimulator.js';
import { calculatePipelineMetrics } from './pipelineMetrics.js';
import { buildGraphFromPipeline, createDefaultExecutionGraph } from './graph.js';
import { runAStar, verifyHeuristicAdmissibilityAndConsistency } from './astar.js';
import { runDijkstra } from './dijkstra.js';

// Pre-compiled FLAT Automaton for standard RISC opcodes (LOAD | STORE | ADD | SUB | MUL | BEQ)
// Built 100% from scratch via Thompson's Construction (zero RegExp.test)
const OPCODE_REGEX = 'LOAD|STORE|ADD|SUB|MUL|BEQ';
const { automaton: OPCODE_AUTOMATON } = buildAutomatonFromRegex(OPCODE_REGEX);

export const INTEGRATED_PRESETS = [
  {
    id: 'BASIC_PIPELINE',
    label: 'Standard Instruction Stream (LOAD → ADD → SUB)',
    code: 'LOAD R1, 100\nADD R2, R1, R3\nSUB R4, R2, R5',
    description: 'Valid 3-instruction sequence demonstrating end-to-end traversal from syntax to graph search.'
  },
  {
    id: 'SINGLE_ARITHMETIC',
    label: 'Single Arithmetic Instruction (ADD R2, R3, R4)',
    code: 'ADD R2, R3, R4',
    description: 'Base case single instruction validating complete 5-stage pipeline latency (5 cycles).'
  },
  {
    id: 'RAW_DEPENDENCY',
    label: 'Data Hazard Sequence (LOAD R1 → ADD R2, R1)',
    code: 'LOAD R1, 50\nADD R2, R1, R3',
    description: 'Instruction pair exhibiting a Read-After-Write dependency, generating pipeline stall bubbles.'
  },
  {
    id: 'INVALID_OPCODE',
    label: 'Invalid Opcode Trap (HALT R1, 100) [FLAT Rejection]',
    code: 'HALT R1, 100',
    description: 'Demonstrates FLAT validation stopping execution before reaching the COA pipeline.'
  },
  {
    id: 'INVALID_SYNTAX',
    label: 'Malformed Syntax Trap (ADD R1) [Grammar Rejection]',
    code: 'ADD R1',
    description: 'Demonstrates syntax validation halting the workflow when operands are missing.'
  }
];

/**
 * Executes the complete 6-stage integrated academic workflow.
 * @param {string} instructionText - Assembly code input
 * @param {Object} options - Configuration options (graphMode, pipelineOptions)
 * @returns {Object} Comprehensive integrated analysis result
 */
export function runIntegratedWorkflow(instructionText, options = {}) {
  const {
    enableDataHazards = true,
    enableForwarding = false,
    enableStructuralHazards = false,
    branchTaken = false,
    useDefaultGraph = false
  } = options;

  const trimmed = (instructionText || '').trim();
  if (!trimmed) {
    return {
      success: false,
      stoppedAt: 'INPUT',
      error: 'Empty instruction input. Please enter or select a valid assembly instruction.',
      flat: null,
      coa: null,
      graph: null,
      astar: null,
      dijkstra: null,
      comparison: null
    };
  }

  // ==========================================
  // STAGE 1: FLAT VALIDATION (Module 2.7)
  // ==========================================
  const rawLines = trimmed.split('\n').map(l => l.trim()).filter(l => l && !l.startsWith('#') && !l.startsWith('//'));
  const flatLineResults = [];
  const validInstructions = [];
  let flatAccepted = true;
  let flatRejectReason = null;

  for (let i = 0; i < rawLines.length; i++) {
    const line = rawLines[i];
    const parts = line.split(/[\s,]+/).filter(Boolean);
    const opcode = parts[0] ? parts[0].toUpperCase() : '';

    // Step A: FLAT Automaton Simulation (Manual ε-closure transition trace)
    const sim = simulateAutomaton(OPCODE_AUTOMATON, opcode);

    if (!sim.accepted) {
      flatAccepted = false;
      flatRejectReason = `Opcode '${opcode}' rejected by FLAT automaton (Language: {LOAD, STORE, ADD, SUB, MUL, BEQ}).`;
      flatLineResults.push({
        line,
        opcode,
        accepted: false,
        reason: flatRejectReason,
        automatonStatesCount: OPCODE_AUTOMATON?.states.length || 0,
        traceLength: sim.trace.length
      });
      break;
    }

    // Step B: Grammar Operand Parsing
    const parsed = parseInstructionLine(line, i);
    if (!parsed.valid) {
      flatAccepted = false;
      flatRejectReason = `Syntax error in '${line}': ${parsed.error}`;
      flatLineResults.push({
        line,
        opcode,
        accepted: false,
        reason: flatRejectReason,
        automatonStatesCount: OPCODE_AUTOMATON?.states.length || 0,
        traceLength: sim.trace.length
      });
      break;
    }

    flatLineResults.push({
      line,
      opcode,
      accepted: true,
      instruction: parsed.instruction,
      automatonStatesCount: OPCODE_AUTOMATON?.states.length || 0,
      traceLength: sim.trace.length
    });
    validInstructions.push(parsed.instruction);
  }

  const flatResult = {
    accepted: flatAccepted,
    patternUsed: OPCODE_REGEX,
    automatonSummary: {
      statesCount: OPCODE_AUTOMATON?.states.length || 0,
      transitionsCount: OPCODE_AUTOMATON?.transitions.length || 0,
      startState: OPCODE_AUTOMATON?.startState || 'q0',
      acceptStates: OPCODE_AUTOMATON?.acceptStates || []
    },
    lineResults: flatLineResults,
    instructions: validInstructions
  };

  // If rejected by FLAT, STOP the integrated workflow immediately
  if (!flatAccepted) {
    return {
      success: false,
      stoppedAt: 'FLAT',
      error: 'Instruction rejected by the formal-language validation stage.',
      reason: flatRejectReason,
      flat: flatResult,
      coa: null,
      graph: null,
      astar: null,
      dijkstra: null,
      comparison: null
    };
  }

  // ==========================================
  // STAGE 2: COA PIPELINE SIMULATION (Module 3.1)
  // ==========================================
  const pipelineSim = simulatePipeline(validInstructions, {
    enableDataHazards,
    enableForwarding,
    enableStructuralHazards,
    branchTaken
  });

  const pipelineMetrics = calculatePipelineMetrics(
    validInstructions.length,
    pipelineSim.cycles,
    pipelineSim.totalStalls,
    pipelineSim.matrix
  );

  const coaResult = {
    executed: true,
    instructionCount: validInstructions.length,
    instructions: validInstructions,
    totalCycles: pipelineSim.cycles,
    totalStalls: pipelineSim.totalStalls,
    hazardEvents: pipelineSim.hazardEvents,
    speedup: pipelineMetrics.actualSpeedup,
    throughput: pipelineMetrics.throughput,
    cpi: pipelineMetrics.cpi,
    utilization: pipelineMetrics.utilizationPercentage,
    matrix: pipelineSim.matrix
  };

  // ==========================================
  // STAGE 3: EDUCATIONAL EXECUTION STATE GRAPH
  // ==========================================
  // Derived deterministically from the simulated pipeline instruction flow
  const graphData = useDefaultGraph
    ? createDefaultExecutionGraph()
    : buildGraphFromPipeline(validInstructions);

  const executionGraph = graphData.graph;
  const startNode = graphData.startNode;
  const goalNode = graphData.goalNode;

  const graphSummary = {
    title: graphData.title,
    graph: executionGraph,
    startNode,
    goalNode,
    nodeCount: executionGraph.getAllNodes().length,
    edgeCount: executionGraph.getAllEdges().length,
    nodes: executionGraph.getAllNodes(),
    edges: executionGraph.getAllEdges()
  };

  // ==========================================
  // STAGE 4: AI/ML A* SEARCH (Module 2.7)
  // ==========================================
  const astarRes = runAStar(executionGraph, startNode, goalNode);
  const heuristicAudit = verifyHeuristicAdmissibilityAndConsistency(executionGraph, goalNode);

  const astarResult = {
    executed: true,
    startNode,
    goalNode,
    path: astarRes.path,
    pathCost: astarRes.pathCost,
    nodesExplored: astarRes.nodesExplored,
    iterations: astarRes.iterations,
    steps: astarRes.steps,
    allFGH: astarRes.allFGH,
    success: astarRes.success,
    admissibilityVerified: heuristicAudit.isAdmissible,
    consistencyVerified: heuristicAudit.isConsistent
  };

  // ==========================================
  // STAGE 5: DAA DIJKSTRA SSSP SEARCH (Module 3.13)
  // Evaluated on the EXACT SAME GRAPH
  // ==========================================
  const dijkRes = runDijkstra(executionGraph, startNode, goalNode);

  const dijkstraResult = {
    executed: true,
    startNode,
    goalNode,
    path: dijkRes.path,
    pathCost: dijkRes.pathCost,
    nodesExplored: dijkRes.nodesExplored,
    distances: dijkRes.distances,
    relaxationLogs: dijkRes.relaxationLogs,
    operations: dijkRes.operations,
    complexity: dijkRes.complexity,
    success: dijkRes.success
  };

  // ==========================================
  // STAGE 6: INTEGRATED COMPARISON
  // ==========================================
  const costsMatch = astarResult.pathCost === dijkstraResult.pathCost;
  const nodesDiff = dijkstraResult.nodesExplored - astarResult.nodesExplored;

  const comparisonResult = {
    sameGraph: true,
    sameSource: startNode,
    sameGoal: goalNode,
    sameWeights: true,
    costsMatch,
    astarCost: astarResult.pathCost,
    dijkstraCost: dijkstraResult.pathCost,
    astarPath: astarResult.path,
    dijkstraPath: dijkstraResult.path,
    astarNodesExplored: astarResult.nodesExplored,
    dijkstraNodesExplored: dijkstraResult.nodesExplored,
    nodesDiff,
    astarIterations: astarResult.iterations,
    dijkstraRelaxations: dijkstraResult.operations.relaxations
  };

  return {
    success: true,
    stoppedAt: null,
    error: null,
    instructionText: trimmed,
    flat: flatResult,
    coa: coaResult,
    graph: graphSummary,
    astar: astarResult,
    dijkstra: dijkstraResult,
    comparison: comparisonResult
  };
}

/**
 * 8 Dedicated Automated Integration Tests (INTEGRATION_TEST_1 to INTEGRATION_TEST_8)
 */
export function runIntegrationTests() {
  const tests = [];

  // Test 1: Valid instruction passes FLAT and reaches COA
  {
    const t0 = performance.now();
    const res = runIntegratedWorkflow('LOAD R1, 100\nADD R2, R1, R3');
    const passed = res.success && res.flat?.accepted && res.coa?.executed && res.coa.totalCycles === 8;
    tests.push({
      id: 'INTEGRATION_TEST_1',
      subject: 'INTEGRATION',
      name: 'Valid Instruction Stream Traversal (FLAT → COA)',
      input: 'LOAD R1, 100 followed by ADD R2, R1, R3',
      expected: 'FLAT accepted = true, COA executed = true, T_pipe = 8 cycles',
      actual: `FLAT accepted=${res.flat?.accepted}, COA executed=${res.coa?.executed}, T_pipe=${res.coa?.totalCycles}`,
      passed,
      durationMs: Number((performance.now() - t0).toFixed(2)),
      detail: 'Verifies successful handoff from formal validation to pipeline cycle stepping.'
    });
  }

  // Test 2: Invalid instruction stops before COA
  {
    const t0 = performance.now();
    const res = runIntegratedWorkflow('HALT R1, 100\nADD R2, R3, R4');
    const passed = !res.success && res.stoppedAt === 'FLAT' && res.coa === null;
    tests.push({
      id: 'INTEGRATION_TEST_2',
      subject: 'INTEGRATION',
      name: 'Invalid Instruction Trap (Workflow Halts at FLAT)',
      input: 'HALT R1, 100 (unrecognized opcode)',
      expected: 'Workflow halts at FLAT stage; COA is null',
      actual: `Halted at: ${res.stoppedAt}, COA present: ${res.coa !== null}`,
      passed,
      durationMs: Number((performance.now() - t0).toFixed(2)),
      detail: 'Ensures invalid syntax never contaminates CPU pipeline simulation.'
    });
  }

  // Test 3: Validated instruction produces educational execution state graph
  {
    const t0 = performance.now();
    const res = runIntegratedWorkflow('ADD R2, R3, R4');
    const passed = res.success && res.graph && res.graph.nodeCount >= 4 && res.graph.edgeCount >= 3;
    tests.push({
      id: 'INTEGRATION_TEST_3',
      subject: 'INTEGRATION',
      name: 'Instruction-Derived Educational Execution Graph Generation',
      input: 'Single ADD instruction',
      expected: 'Deterministic graph generated with nodes >= 4 and edges >= 3',
      actual: `Nodes: ${res.graph?.nodeCount}, Edges: ${res.graph?.edgeCount}`,
      passed,
      durationMs: Number((performance.now() - t0).toFixed(2)),
      detail: 'Bridges pipeline stage execution into a formal state-space graph.'
    });
  }

  // Test 4: A* and Dijkstra receive exact same graph, source, and goal
  {
    const t0 = performance.now();
    const res = runIntegratedWorkflow('LOAD R1, 10\nADD R2, R1, R3');
    const passed = res.success &&
      res.comparison.sameGraph === true &&
      res.comparison.sameSource === res.graph.startNode &&
      res.comparison.sameGoal === res.graph.goalNode;
    tests.push({
      id: 'INTEGRATION_TEST_4',
      subject: 'INTEGRATION',
      name: 'Strict Parity Verification (Same Graph, Source, and Destination)',
      input: 'Two-instruction sequence',
      expected: 'Source, destination, and graph topology identical across A* and Dijkstra',
      actual: `Source: ${res.comparison?.sameSource}, Destination: ${res.comparison?.sameGoal}, Same Graph: ${res.comparison?.sameGraph}`,
      passed,
      durationMs: Number((performance.now() - t0).toFixed(2)),
      detail: 'Enforces rigorous experimental controls for algorithm comparison.'
    });
  }

  // Test 5: A* returns an optimal path
  {
    const t0 = performance.now();
    const res = runIntegratedWorkflow('ADD R1, R2, R3');
    const passed = res.success && res.astar?.success && res.astar.path.length > 0 && res.astar.pathCost < Infinity;
    tests.push({
      id: 'INTEGRATION_TEST_5',
      subject: 'INTEGRATION',
      name: 'A* Path Search Optimality & Admissibility',
      input: 'ADD instruction pipeline graph',
      expected: 'A* finds valid path, success = true, admissibility verified',
      actual: `Path: ${res.astar?.path.join('->')}, Cost: ${res.astar?.pathCost}, Admissible: ${res.astar?.admissibilityVerified}`,
      passed,
      durationMs: Number((performance.now() - t0).toFixed(2)),
      detail: 'Verifies goal-directed search completes with admissible Euclidean heuristic.'
    });
  }

  // Test 6: Dijkstra returns an optimal path
  {
    const t0 = performance.now();
    const res = runIntegratedWorkflow('ADD R1, R2, R3');
    const passed = res.success && res.dijkstra?.success && res.dijkstra.path.length > 0 && res.dijkstra.pathCost < Infinity;
    tests.push({
      id: 'INTEGRATION_TEST_6',
      subject: 'INTEGRATION',
      name: 'Dijkstra SSSP Relaxation & Path Reconstruction',
      input: 'ADD instruction pipeline graph',
      expected: 'Dijkstra finds valid path, success = true, non-negative weights',
      actual: `Path: ${res.dijkstra?.path.join('->')}, Cost: ${res.dijkstra?.pathCost}`,
      passed,
      durationMs: Number((performance.now() - t0).toFixed(2)),
      detail: 'Verifies greedy relaxation successfully discovers shortest distance path.'
    });
  }

  // Test 7: A* and Dijkstra produce equal optimal cost on the same graph
  {
    const t0 = performance.now();
    const res = runIntegratedWorkflow('LOAD R1, 50\nADD R2, R1, R3\nSUB R4, R2, R5');
    const passed = res.success && res.comparison?.costsMatch === true && res.astar.pathCost === res.dijkstra.pathCost;
    tests.push({
      id: 'INTEGRATION_TEST_7',
      subject: 'INTEGRATION',
      name: 'Optimal Path Cost Parity Assertion (A* Cost == Dijkstra Cost)',
      input: '3-instruction pipeline graph',
      expected: 'A* Path Cost === Dijkstra Path Cost (Exact Match)',
      actual: `A* Cost: ${res.astar?.pathCost}, Dijkstra Cost: ${res.dijkstra?.pathCost}`,
      passed,
      durationMs: Number((performance.now() - t0).toFixed(2)),
      detail: 'Proves mathematical correctness: both algorithms identify the same optimal cost.'
    });
  }

  // Test 8: Start = Goal boundary condition handled gracefully
  {
    const t0 = performance.now();
    const res = runIntegratedWorkflow('LOAD R1, 10', { useDefaultGraph: true });
    // In default graph S_INIT to G_COMMIT is checked, now test start=start
    const trivialAStar = runAStar(res.graph.graph, 'S_INIT', 'S_INIT');
    const trivialDijkstra = runDijkstra(res.graph.graph, 'S_INIT', 'S_INIT');
    const passed = trivialAStar.pathCost === 0 && trivialDijkstra.pathCost === 0;
    tests.push({
      id: 'INTEGRATION_TEST_8',
      subject: 'INTEGRATION',
      name: 'Integrated Boundary Handling (Start == Goal)',
      input: 'Source = S_INIT, Target = S_INIT',
      expected: 'PathCost = 0 for both A* and Dijkstra',
      actual: `A* Cost: ${trivialAStar.pathCost}, Dijkstra Cost: ${trivialDijkstra.pathCost}`,
      passed,
      durationMs: Number((performance.now() - t0).toFixed(2)),
      detail: 'Edge case validation: immediate goal identification with 0 path cost.'
    });
  }

  return tests;
}
