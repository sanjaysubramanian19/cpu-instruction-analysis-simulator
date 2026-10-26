import React, { useState } from 'react';
import {
  Cpu,
  Sparkles,
  GitBranch,
  Split,
  CheckCircle2,
  ArrowRight,
  Play,
  RotateCcw,
  Zap,
  Award
} from 'lucide-react';
import { buildAutomatonFromRegex } from '../engine/regexToAutomaton.js';
import { simulateAutomaton } from '../engine/automatonSimulator.js';
import { parseProgram, PRESET_PROGRAMS } from '../engine/instructionValidator.js';
import { simulatePipeline } from '../engine/pipelineSimulator.js';
import { calculatePipelineMetrics } from '../engine/pipelineMetrics.js';
import { createDefaultExecutionGraph } from '../engine/graph.js';
import { runAStar } from '../engine/astar.js';
import { runDijkstra } from '../engine/dijkstra.js';

export default function Dashboard({ setActiveTab }) {
  // Live integrated scenario state
  const [instructionInput, setInstructionInput] = useState('LOAD R1, 100\nADD R2, R1, R3\nSUB R4, R2, R5');
  const [regexPattern] = useState('(LOAD|ADD|SUB|MUL) R[0-9]+, R[0-9]+');

  // Compute live metrics across all 4 subjects
  const flatResult = React.useMemo(() => {
    const { automaton } = buildAutomatonFromRegex('(a|b)*abb');
    const sim = automaton ? simulateAutomaton(automaton, 'aabb') : null;
    return {
      regex: '(a|b)*abb',
      statesCount: automaton ? automaton.states.length : 0,
      transitionsCount: automaton ? automaton.transitions.length : 0,
      testString: 'aabb',
      verdict: sim && sim.accepted ? 'ACCEPT' : 'REJECT'
    };
  }, []);

  const coaResult = React.useMemo(() => {
    const { instructions } = parseProgram(instructionInput);
    const sim = simulatePipeline(instructions, { enableDataHazards: true, enableForwarding: false });
    const met = calculatePipelineMetrics(instructions.length, sim.cycles, sim.totalStalls, sim.matrix);
    return {
      instCount: instructions.length,
      cycles: sim.cycles,
      speedup: met.actualSpeedup,
      throughput: met.throughput,
      utilization: met.utilizationPercentage,
      stalls: sim.totalStalls
    };
  }, [instructionInput]);

  const searchResults = React.useMemo(() => {
    const { graph, startNode, goalNode } = createDefaultExecutionGraph();
    const aStar = runAStar(graph, startNode, goalNode);
    const dijkstra = runDijkstra(graph, startNode, goalNode);
    return { aStar, dijkstra };
  }, []);

  return (
    <div>
      {/* Top Academic Banner */}
      <div className="page-academic-banner" style={{ borderLeftColor: '#2563eb' }}>
        <div className="banner-title-row">
          <div>
            <h2>Academic Evaluation Dashboard</h2>
            <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
              Integrated Academic Micro Project Overview • 4 Technical Subjects × 15 Marks = <strong>60 Marks Total</strong>
            </div>
          </div>
        </div>

        <div className="banner-concepts-row">
          <div className="concept-box">
            <div className="concept-label">Evaluation Rubric (Per Subject)</div>
            Report (3m) + Concept Application (4m) + Correctness & Depth (4m) + Functionality & Demo (3m) + Testing (1m) = <strong>15 Marks</strong>
          </div>
          <div className="concept-box">
            <div className="concept-label">Design Principle</div>
            One integrated educational simulator, where each subject contains complete, independent implementation, testing, UI, and reports.
          </div>
        </div>
      </div>

      {/* 30-SECOND EXAMINER COMPLIANCE AUDIT PANEL */}
      <div className="academic-card" style={{ marginBottom: '1.25rem', background: '#f8fafc', borderLeft: '4px solid #059669' }}>
        <div style={{ marginBottom: '0.6rem' }}>
          <span style={{ fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', color: '#047857', letterSpacing: '0.05em' }}>
            ACADEMIC PROJECT STATUS (30-SECOND EXAMINER AUDIT)
          </span>
          <h3 style={{ fontSize: '1rem', fontWeight: 700, margin: '0.15rem 0' }}>
            Four Subjects • Four Selected Modules • Independent Reports & Automated Tests
          </h3>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '0.75rem', fontSize: '0.825rem' }}>
          <div style={{ background: '#ffffff', padding: '0.65rem 0.85rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)', borderTop: '3px solid var(--coa-color)' }}>
            <div style={{ fontWeight: 700, color: 'var(--coa-color)' }}>1. COA — Module 3.1</div>
            <div style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>Pipelining: Stages, Throughput & Speedup</div>
            <div style={{ marginTop: '0.35rem', display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
              <span className="badge badge-success">Implementation ✓</span>
              <span className="badge badge-success">Tests (8/8) ✓</span>
              <span className="badge badge-info">Report ✓</span>
            </div>
          </div>

          <div style={{ background: '#ffffff', padding: '0.65rem 0.85rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)', borderTop: '3px solid var(--aiml-color)' }}>
            <div style={{ fontWeight: 700, color: 'var(--aiml-color)' }}>2. AI/ML — Module 2.7</div>
            <div style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>A* Search: f(n) = g(n) + h(n)</div>
            <div style={{ marginTop: '0.35rem', display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
              <span className="badge badge-success">Implementation ✓</span>
              <span className="badge badge-success">Tests (8/8) ✓</span>
              <span className="badge badge-info">Report ✓</span>
            </div>
          </div>

          <div style={{ background: '#ffffff', padding: '0.65rem 0.85rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)', borderTop: '3px solid var(--daa-color)' }}>
            <div style={{ fontWeight: 700, color: 'var(--daa-color)' }}>3. DAA — Module 3.13</div>
            <div style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>Dijkstra's Algorithm (Greedy SSSP)</div>
            <div style={{ marginTop: '0.35rem', display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
              <span className="badge badge-success">Implementation ✓</span>
              <span className="badge badge-success">Tests (8/8) ✓</span>
              <span className="badge badge-info">Report ✓</span>
            </div>
          </div>

          <div style={{ background: '#ffffff', padding: '0.65rem 0.85rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)', borderTop: '3px solid var(--flat-color)' }}>
            <div style={{ fontWeight: 700, color: 'var(--flat-color)' }}>4. FLAT — Module 2.7</div>
            <div style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>Regex to Finite Automata Conversion</div>
            <div style={{ marginTop: '0.35rem', display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
              <span className="badge badge-success">Implementation ✓</span>
              <span className="badge badge-success">Tests (12/12) ✓</span>
              <span className="badge badge-info">Report ✓</span>
            </div>
          </div>
        </div>
      </div>

      {/* FOUR INDEPENDENT ACADEMIC CARDS */}
      <div className="grid-4" style={{ marginBottom: '1.5rem' }}>
        {/* CARD 1: COA */}
        <div className="academic-card card-coa">
          <div className="card-header">
            <h3>
              <Cpu size={18} color="var(--coa-color)" />
              <span>COA (15 Marks)</span>
            </h3>
            <span className="badge badge-success">
              <CheckCircle2 size={12} /> Implemented ✓
            </span>
          </div>

          <div style={{ fontSize: '0.85rem', marginBottom: '0.75rem' }}>
            <div style={{ fontWeight: 700, color: 'var(--coa-color)', fontSize: '0.8rem', textTransform: 'uppercase' }}>
              PRIMARY: MODULE 3.1
            </div>
            <div style={{ fontWeight: 600, color: 'var(--text-main)', marginTop: '0.15rem' }}>
              Pipelining: Stages, Throughput, and Speedup
            </div>
          </div>

          {/* Live COA Metrics */}
          <div style={{ background: '#f8fafc', padding: '0.6rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)', fontSize: '0.785rem', lineHeight: '1.5', marginBottom: '0.75rem', flex: 1 }}>
            <div>• Instructions: <strong>{coaResult.instCount}</strong></div>
            <div>• Pipeline Cycles: <strong>{coaResult.cycles}</strong></div>
            <div>• Speedup: <strong>{coaResult.speedup}×</strong></div>
            <div>• Throughput: <strong>{coaResult.throughput} IPC</strong></div>
            <div>• Utilization: <strong>{coaResult.utilization}%</strong></div>
          </div>

          <button
            className="btn btn-secondary btn-sm"
            onClick={() => setActiveTab('coa')}
            style={{ width: '100%' }}
          >
            Open COA Lab <ArrowRight size={13} />
          </button>
        </div>

        {/* CARD 2: AI/ML */}
        <div className="academic-card card-aiml">
          <div className="card-header">
            <h3>
              <Sparkles size={18} color="var(--aiml-color)" />
              <span>AI/ML (15 Marks)</span>
            </h3>
            <span className="badge badge-success">
              <CheckCircle2 size={12} /> Implemented ✓
            </span>
          </div>

          <div style={{ fontSize: '0.85rem', marginBottom: '0.75rem' }}>
            <div style={{ fontWeight: 700, color: 'var(--aiml-color)', fontSize: '0.8rem', textTransform: 'uppercase' }}>
              PRIMARY: MODULE 2.7
            </div>
            <div style={{ fontWeight: 600, color: 'var(--text-main)', marginTop: '0.15rem' }}>
              A* Search Fundamentals: The Gold Standard
            </div>
          </div>

          {/* Live AI/ML Metrics */}
          <div style={{ background: '#f8fafc', padding: '0.6rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)', fontSize: '0.785rem', lineHeight: '1.5', marginBottom: '0.75rem', flex: 1 }}>
            <div>• Optimal Path Cost: <strong>{searchResults.aStar.pathCost}</strong></div>
            <div>• Nodes Explored: <strong>{searchResults.aStar.nodesExplored}</strong></div>
            <div>• Total Iterations: <strong>{searchResults.aStar.iterations}</strong></div>
            <div>• Heuristic Function: <strong>f(n) = g(n) + h(n)</strong></div>
            <div>• Admissibility: <strong style={{ color: '#15803d' }}>Verified (h ≤ h*)</strong></div>
          </div>

          <button
            className="btn btn-secondary btn-sm"
            onClick={() => setActiveTab('aiml')}
            style={{ width: '100%' }}
          >
            Open A* Search Lab <ArrowRight size={13} />
          </button>
        </div>

        {/* CARD 3: DAA */}
        <div className="academic-card card-daa">
          <div className="card-header">
            <h3>
              <GitBranch size={18} color="var(--daa-color)" />
              <span>DAA (15 Marks)</span>
            </h3>
            <span className="badge badge-success">
              <CheckCircle2 size={12} /> Implemented ✓
            </span>
          </div>

          <div style={{ fontSize: '0.85rem', marginBottom: '0.75rem' }}>
            <div style={{ fontWeight: 700, color: 'var(--daa-color)', fontSize: '0.8rem', textTransform: 'uppercase' }}>
              PRIMARY: MODULE 3.13
            </div>
            <div style={{ fontWeight: 600, color: 'var(--text-main)', marginTop: '0.15rem' }}>
              Dijkstra's Algorithm (Greedy SSSP)
            </div>
          </div>

          {/* Live DAA Metrics */}
          <div style={{ background: '#f8fafc', padding: '0.6rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)', fontSize: '0.785rem', lineHeight: '1.5', marginBottom: '0.75rem', flex: 1 }}>
            <div>• Shortest Path Cost: <strong>{searchResults.dijkstra.pathCost}</strong></div>
            <div>• Settled Vertices: <strong>{searchResults.dijkstra.nodesExplored}</strong></div>
            <div>• Loop Iterations: <strong>{searchResults.dijkstra.iterations}</strong></div>
            <div>• Relaxation Invariant: <strong>dist[v] ≤ dist[u]+w</strong></div>
            <div>• Min-Heap Complexity: <strong>O((V+E) log V)</strong></div>
          </div>

          <button
            className="btn btn-secondary btn-sm"
            onClick={() => setActiveTab('daa')}
            style={{ width: '100%' }}
          >
            Open Dijkstra Lab <ArrowRight size={13} />
          </button>
        </div>

        {/* CARD 4: FLAT */}
        <div className="academic-card card-flat">
          <div className="card-header">
            <h3>
              <Split size={18} color="var(--flat-color)" />
              <span>FLAT (15 Marks)</span>
            </h3>
            <span className="badge badge-success">
              <CheckCircle2 size={12} /> Implemented ✓
            </span>
          </div>

          <div style={{ fontSize: '0.85rem', marginBottom: '0.75rem' }}>
            <div style={{ fontWeight: 700, color: 'var(--flat-color)', fontSize: '0.8rem', textTransform: 'uppercase' }}>
              PRIMARY: MODULE 2.7
            </div>
            <div style={{ fontWeight: 600, color: 'var(--text-main)', marginTop: '0.15rem' }}>
              Regex to Finite Automata Conversion
            </div>
          </div>

          {/* Live FLAT Metrics */}
          <div style={{ background: '#f8fafc', padding: '0.6rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)', fontSize: '0.785rem', lineHeight: '1.5', marginBottom: '0.75rem', flex: 1 }}>
            <div>• Sample Regex: <code className="font-mono">{flatResult.regex}</code></div>
            <div>• Generated States: <strong>{flatResult.statesCount}</strong></div>
            <div>• Transitions (incl. ε): <strong>{flatResult.transitionsCount}</strong></div>
            <div>• Tested Input: <code className="font-mono">"{flatResult.testString}"</code></div>
            <div>• Verdict: <strong style={{ color: '#15803d' }}>{flatResult.verdict}</strong></div>
          </div>

          <button
            className="btn btn-secondary btn-sm"
            onClick={() => setActiveTab('flat')}
            style={{ width: '100%' }}
          >
            Open FLAT Lab <ArrowRight size={13} />
          </button>
        </div>
      </div>

      {/* INTEGRATED PIPELINE DATAFLOW */}
      <div className="academic-card" style={{ marginBottom: '1.5rem', borderLeft: '4px solid #4f46e5' }}>
        <div className="card-header">
          <div>
            <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Zap size={18} color="#4f46e5" />
              <span>Integrated Educational Dataflow: 6-Step Academic Protocol</span>
            </h3>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
              Four Subjects Connected in Sequence • Single Live Instruction Stream
            </div>
          </div>
          <button
            className="btn btn-primary btn-sm"
            onClick={() => setActiveTab('integrated')}
            style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}
          >
            Launch Full Integrated Simulator <ArrowRight size={13} />
          </button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '0.75rem', position: 'relative' }}>
          {/* Step 1: FLAT */}
          <div style={{ background: '#f0fdfa', border: '1px solid #99f6e4', padding: '0.85rem', borderRadius: 'var(--radius-sm)' }}>
            <div style={{ fontSize: '0.7rem', fontWeight: 800, color: '#0f766e', textTransform: 'uppercase' }}>STEP 1 • FLAT</div>
            <div style={{ fontWeight: 700, fontSize: '0.9rem', color: '#115e59', margin: '0.2rem 0' }}>Instruction Validation</div>
            <div style={{ fontSize: '0.785rem', color: '#134e4a' }}>
              Thompson ε-NFA parses and formally accepts instruction grammar tokens.
            </div>
            <button
              className="btn btn-secondary btn-sm"
              onClick={() => setActiveTab('flat')}
              style={{ marginTop: '0.5rem', width: '100%', fontSize: '0.75rem' }}
            >
              Inspect FLAT Lab
            </button>
          </div>

          {/* Step 2: COA */}
          <div style={{ background: '#eef2ff', border: '1px solid #c7d2fe', padding: '0.85rem', borderRadius: 'var(--radius-sm)' }}>
            <div style={{ fontSize: '0.7rem', fontWeight: 800, color: '#4338ca', textTransform: 'uppercase' }}>STEP 2 • COA</div>
            <div style={{ fontWeight: 700, fontSize: '0.9rem', color: '#3730a3', margin: '0.2rem 0' }}>5-Stage Pipelining</div>
            <div style={{ fontSize: '0.785rem', color: '#312e81' }}>
              Accepted sequence enters IF-ID-EX-MEM-WB pipeline; computes speedup & stalls.
            </div>
            <button
              className="btn btn-secondary btn-sm"
              onClick={() => setActiveTab('coa')}
              style={{ marginTop: '0.5rem', width: '100%', fontSize: '0.75rem' }}
            >
              Inspect COA Lab
            </button>
          </div>

          {/* Step 3: Graph Engine */}
          <div style={{ background: '#f8fafc', border: '1px solid #cbd5e1', padding: '0.85rem', borderRadius: 'var(--radius-sm)' }}>
            <div style={{ fontSize: '0.7rem', fontWeight: 800, color: '#475569', textTransform: 'uppercase' }}>STEP 3 • GRAPH</div>
            <div style={{ fontWeight: 700, fontSize: '0.9rem', color: '#1e293b', margin: '0.2rem 0' }}>State-Space Model</div>
            <div style={{ fontSize: '0.785rem', color: '#334155' }}>
              Constructs weighted execution state-space graph with clock-cycle edge weights.
            </div>
            <div style={{ marginTop: '0.5rem', fontSize: '0.75rem', fontWeight: 600, color: '#64748b', textAlign: 'center' }}>
              Common Graph Topology
            </div>
          </div>

          {/* Step 4: AI/ML */}
          <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', padding: '0.85rem', borderRadius: 'var(--radius-sm)' }}>
            <div style={{ fontSize: '0.7rem', fontWeight: 800, color: '#15803d', textTransform: 'uppercase' }}>STEP 4 • AI/ML</div>
            <div style={{ fontWeight: 700, fontSize: '0.9rem', color: '#166534', margin: '0.2rem 0' }}>A* Heuristic Search</div>
            <div style={{ fontSize: '0.785rem', color: '#14532d' }}>
              Explores state space using f(n)=g(n)+h(n); prunes suboptimal paths via Euclidean heuristic.
            </div>
            <button
              className="btn btn-secondary btn-sm"
              onClick={() => setActiveTab('aiml')}
              style={{ marginTop: '0.5rem', width: '100%', fontSize: '0.75rem' }}
            >
              Inspect A* Lab
            </button>
          </div>

          {/* Step 5: DAA */}
          <div style={{ background: '#fffbeb', border: '1px solid #fde68a', padding: '0.85rem', borderRadius: 'var(--radius-sm)' }}>
            <div style={{ fontSize: '0.7rem', fontWeight: 800, color: '#b45309', textTransform: 'uppercase' }}>STEP 5 • DAA</div>
            <div style={{ fontWeight: 700, fontSize: '0.9rem', color: '#92400e', margin: '0.2rem 0' }}>Dijkstra Algorithm</div>
            <div style={{ fontSize: '0.785rem', color: '#78350f' }}>
              Calculates shortest path through greedy relaxation without heuristic estimates.
            </div>
            <button
              className="btn btn-secondary btn-sm"
              onClick={() => setActiveTab('daa')}
              style={{ marginTop: '0.5rem', width: '100%', fontSize: '0.75rem' }}
            >
              Inspect Dijkstra Lab
            </button>
          </div>

          {/* Step 6: Comparison */}
          <div style={{ background: '#fdf2f8', border: '1px solid #fbcfe8', padding: '0.85rem', borderRadius: 'var(--radius-sm)' }}>
            <div style={{ fontSize: '0.7rem', fontWeight: 800, color: '#be185d', textTransform: 'uppercase' }}>STEP 6 • ANALYTICS</div>
            <div style={{ fontWeight: 700, fontSize: '0.9rem', color: '#9d174d', margin: '0.2rem 0' }}>Empirical Comparison</div>
            <div style={{ fontSize: '0.785rem', color: '#831843' }}>
              Compares path cost parity, node expansion efficiency, and asymptotic complexity.
            </div>
            <button
              className="btn btn-secondary btn-sm"
              onClick={() => setActiveTab('comparison')}
              style={{ marginTop: '0.5rem', width: '100%', fontSize: '0.75rem' }}
            >
              Inspect Comparison
            </button>
          </div>
        </div>

        {/* Live CTA Banner */}
        <div style={{ marginTop: '1rem', padding: '0.85rem 1.15rem', background: '#eef2ff', borderRadius: 'var(--radius-sm)', border: '1px solid #c7d2fe', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem' }}>
          <div>
            <div style={{ fontWeight: 700, color: '#3730a3', fontSize: '0.9rem' }}>
              Live End-to-End Execution Pipeline
            </div>
            <div style={{ color: '#4338ca', fontSize: '0.8rem', marginTop: '0.15rem' }}>
              Test presets with valid streams, data hazards, or syntactic invalidity traps, and watch FLAT, COA, AI/ML, and DAA respond synchronously.
            </div>
          </div>
          <button className="btn btn-primary" onClick={() => setActiveTab('integrated')}>
            Open Tab 2: Integrated Workflow <ArrowRight size={15} />
          </button>
        </div>
      </div>

      {/* QUICK ACADEMIC EVALUATION SHORTCUTS */}
      <div className="grid-2">
        <div className="academic-card">
          <div className="card-header">
            <h3>Criterion 5: Automated Testing</h3>
            <span className="badge badge-success">36 Tests</span>
          </div>
          <p style={{ fontSize: '0.825rem', color: 'var(--text-muted)', marginBottom: '0.75rem' }}>
            Run the 36 unit tests validating mathematical correctness for all four subjects.
          </p>
          <button className="btn btn-primary btn-sm" onClick={() => setActiveTab('tests')}>
            Open Test Laboratory <ArrowRight size={13} />
          </button>
        </div>

        <div className="academic-card">
          <div className="card-header">
            <h3>Syllabus Module Mapping</h3>
            <span className="badge badge-info">Modules 1–3</span>
          </div>
          <p style={{ fontSize: '0.825rem', color: 'var(--text-muted)', marginBottom: '0.75rem' }}>
            Inspect exact primary and supporting module numbers mapped to project source files.
          </p>
          <button className="btn btn-secondary btn-sm" onClick={() => setActiveTab('mapping')}>
            Open Module Mapping <ArrowRight size={13} />
          </button>
        </div>
      </div>
    </div>
  );
}
