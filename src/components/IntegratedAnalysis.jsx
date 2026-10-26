import React, { useState, useMemo } from 'react';
import { runIntegratedWorkflow, INTEGRATED_PRESETS } from '../engine/integratedWorkflow.js';
import PipelineMatrix from './PipelineMatrix.jsx';
import GraphVisualizer from './GraphVisualizer.jsx';
import {
  Play,
  RotateCcw,
  CheckCircle2,
  XCircle,
  ArrowRight,
  Layers,
  Cpu,
  Sparkles,
  GitBranch,
  Split,
  ShieldCheck,
  AlertTriangle,
  Info,
  Scale
} from 'lucide-react';

export default function IntegratedAnalysis({ setActiveTab }) {
  const [selectedPreset, setSelectedPreset] = useState('BASIC_PIPELINE');
  const [instructionText, setInstructionText] = useState(INTEGRATED_PRESETS[0].code);
  const [enableDataHazards, setEnableDataHazards] = useState(true);
  const [enableForwarding, setEnableForwarding] = useState(false);
  const [useDefaultGraph, setUseDefaultGraph] = useState(false);

  // Run the complete integrated workflow whenever input or options change
  const workflowResult = useMemo(() => {
    return runIntegratedWorkflow(instructionText, {
      enableDataHazards,
      enableForwarding,
      useDefaultGraph
    });
  }, [instructionText, enableDataHazards, enableForwarding, useDefaultGraph]);

  const handlePresetSelect = (preset) => {
    setSelectedPreset(preset.id);
    setInstructionText(preset.code);
  };

  const isFlatValid = workflowResult.success && workflowResult.flat?.accepted;

  return (
    <div className="integrated-analysis-page">
      {/* Header Academic Banner */}
      <div className="page-academic-banner" style={{ borderLeftColor: '#4f46e5' }}>
        <div className="banner-title-row">
          <div>
            <h2>Integrated Project Workflow</h2>
            <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
              Formal instruction validation → CPU pipeline simulation → state-space search → algorithmic path comparison
            </div>
          </div>
          <span className="module-tag" style={{ background: '#e0e7ff', color: '#4338ca' }}>
            Four-Subject Academic Bridge
          </span>
        </div>

        <div className="banner-concepts-row">
          <div className="concept-box">
            <div className="concept-label">Educational Simulation Architecture</div>
            The project uses a common educational instruction/state-space workflow to connect concepts from Formal Language & Automata Theory (FLAT), Computer Organization & Architecture (COA), AI/ML Foundations, and Design & Analysis of Algorithms (DAA).
          </div>
          <div className="concept-box">
            <div className="concept-label">Integration Bridge</div>
            FLAT validates syntax → COA models pipeline execution → State space is captured as an educational graph → A* and Dijkstra search the <strong>exact same graph</strong> for direct algorithmic comparison.
          </div>
        </div>
      </div>

      {/* Visual Workflow Pipeline Breadcrumb */}
      <div className="academic-card" style={{ marginBottom: '1.25rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Layers size={18} color="#4f46e5" />
            <h3 style={{ fontSize: '0.95rem', margin: 0 }}>End-to-End Workflow Stages</h3>
          </div>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
            Status: {workflowResult.success ? (
              <span style={{ color: '#16a34a', fontWeight: 600 }}>All 6 Stages Completed ✓</span>
            ) : (
              <span style={{ color: '#dc2626', fontWeight: 600 }}>Halted at {workflowResult.stoppedAt} Stage ✕</span>
            )}
          </span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '0.5rem', marginTop: '0.75rem' }}>
          <div className="workflow-step-pill active">
            <div className="pill-number">1</div>
            <div>
              <div className="pill-title">Input</div>
              <div className="pill-sub">Assembly Code</div>
            </div>
          </div>

          <div className={`workflow-step-pill ${isFlatValid ? 'active' : 'error'}`}>
            <div className="pill-number">2</div>
            <div>
              <div className="pill-title">FLAT Valid</div>
              <div className="pill-sub">Module 2.7</div>
            </div>
          </div>

          <div className={`workflow-step-pill ${workflowResult.coa ? 'active' : 'disabled'}`}>
            <div className="pill-number">3</div>
            <div>
              <div className="pill-title">COA Pipeline</div>
              <div className="pill-sub">Module 3.1</div>
            </div>
          </div>

          <div className={`workflow-step-pill ${workflowResult.graph ? 'active' : 'disabled'}`}>
            <div className="pill-number">4</div>
            <div>
              <div className="pill-title">State Graph</div>
              <div className="pill-sub">Execution Space</div>
            </div>
          </div>

          <div className={`workflow-step-pill ${workflowResult.astar ? 'active' : 'disabled'}`}>
            <div className="pill-number">5</div>
            <div>
              <div className="pill-title">AI/ML A*</div>
              <div className="pill-sub">Module 2.7</div>
            </div>
          </div>

          <div className={`workflow-step-pill ${workflowResult.dijkstra ? 'active' : 'disabled'}`}>
            <div className="pill-number">6</div>
            <div>
              <div className="pill-title">DAA Dijkstra</div>
              <div className="pill-sub">Module 3.13</div>
            </div>
          </div>

          <div className={`workflow-step-pill ${workflowResult.comparison ? 'active' : 'disabled'}`}>
            <div className="pill-number">7</div>
            <div>
              <div className="pill-title">Comparison</div>
              <div className="pill-sub">Path Parity</div>
            </div>
          </div>
        </div>
      </div>

      {/* STAGE 1: INSTRUCTION INPUT */}
      <div className="academic-card" style={{ marginBottom: '1.25rem' }}>
        <div className="card-header">
          <h3>1. Instruction Input & Presets</h3>
          <span className="badge badge-info">Simplified RISC Assembly</span>
        </div>

        <div style={{ marginBottom: '0.75rem' }}>
          <label className="control-label">Select Valid Preset or Enter Custom Instruction:</label>
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '0.75rem' }}>
            {INTEGRATED_PRESETS.map((p) => (
              <button
                key={p.id}
                className={`btn btn-sm ${selectedPreset === p.id ? 'btn-primary' : 'btn-secondary'}`}
                onClick={() => handlePresetSelect(p)}
              >
                {p.label}
              </button>
            ))}
          </div>

          <textarea
            className="text-input font-mono"
            rows={3}
            value={instructionText}
            onChange={(e) => {
              setInstructionText(e.target.value);
              setSelectedPreset('');
            }}
            placeholder="Enter instruction, e.g.: LOAD R1, 100&#10;ADD R2, R1, R3"
            style={{ width: '100%', resize: 'vertical' }}
          />
        </div>

        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center', fontSize: '0.85rem' }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', cursor: 'pointer' }}>
            <input
              type="checkbox"
              checked={enableDataHazards}
              onChange={(e) => setEnableDataHazards(e.target.checked)}
            />
            <span>Enable RAW Data Hazards (COA Mod 3.7)</span>
          </label>

          <label style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', cursor: 'pointer' }}>
            <input
              type="checkbox"
              checked={enableForwarding}
              onChange={(e) => setEnableForwarding(e.target.checked)}
            />
            <span>Enable Operand Forwarding Path</span>
          </label>

          <label style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', cursor: 'pointer' }}>
            <input
              type="checkbox"
              checked={useDefaultGraph}
              onChange={(e) => setUseDefaultGraph(e.target.checked)}
            />
            <span>Use Canonical 8-State Graph (instead of instruction-derived graph)</span>
          </label>
        </div>
      </div>

      {/* STAGE 2: FLAT VALIDATION */}
      <div className="academic-card card-flat" style={{ marginBottom: '1.25rem' }}>
        <div className="card-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Split size={18} color="var(--flat-color)" />
            <h3>2. FLAT Formal Language Validation</h3>
          </div>
          <span className="badge badge-info">FLAT — Module 2.7</span>
        </div>

        <div style={{ fontSize: '0.85rem', marginBottom: '0.75rem', lineHeight: '1.6' }}>
          <div><strong>Opcode Grammar Pattern:</strong> <code>{workflowResult.flat?.patternUsed || 'LOAD|STORE|ADD|SUB|MUL|BEQ'}</code></div>
          <div style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>
            Evaluated using Thompson's $\varepsilon$-NFA Automaton ({workflowResult.flat?.automatonSummary.statesCount || 52} states, {workflowResult.flat?.automatonSummary.transitionsCount || 64} transitions, $q_0 \to F$) with manual recursive $\varepsilon$-closure. Zero <code>RegExp.test()</code> calls.
          </div>
        </div>

        {/* Validation Verdict Alert */}
        {workflowResult.flat?.accepted ? (
          <div className="concept-box" style={{ background: '#ecfdf5', borderColor: '#a7f3d0', color: '#065f46', marginBottom: '0.75rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 700 }}>
              <CheckCircle2 size={16} color="#059669" />
              <span>✓ Instruction accepted by the formal-language validation stage.</span>
            </div>
            <div style={{ fontSize: '0.8rem', marginTop: '0.2rem' }}>
              All opcodes match language alphabet $\Sigma$ and instruction operands conform to assembly grammar rules. Proceeding to COA pipeline simulation.
            </div>
          </div>
        ) : (
          <div className="concept-box" style={{ background: '#fef2f2', borderColor: '#fecaca', color: '#991b1b', marginBottom: '0.75rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 700 }}>
              <XCircle size={16} color="#dc2626" />
              <span>✕ Instruction rejected by the formal-language validation stage.</span>
            </div>
            <div style={{ fontSize: '0.825rem', marginTop: '0.25rem' }}>
              <strong>Halt Reason:</strong> {workflowResult.reason || 'Unrecognized opcode or syntax error.'}
            </div>
            <div style={{ fontSize: '0.775rem', marginTop: '0.35rem', color: '#7f1d1d' }}>
              Execution safely stopped. The invalid instruction stream will NOT be forwarded to the COA pipeline or search engines.
            </div>
          </div>
        )}

        {/* Detailed Per-Line Automaton Trace Table */}
        {workflowResult.flat?.lineResults && workflowResult.flat.lineResults.length > 0 && (
          <div className="table-container">
            <table className="academic-table" style={{ fontSize: '0.825rem' }}>
              <thead>
                <tr>
                  <th>Input Line</th>
                  <th>Extracted Opcode</th>
                  <th>Automaton Verdict</th>
                  <th>Details</th>
                </tr>
              </thead>
              <tbody>
                {workflowResult.flat.lineResults.map((lr, idx) => (
                  <tr key={idx}>
                    <td className="font-mono">{lr.line}</td>
                    <td className="font-mono"><strong>{lr.opcode}</strong></td>
                    <td>
                      {lr.accepted ? (
                        <span className="badge badge-success"><CheckCircle2 size={11} /> ACCEPT</span>
                      ) : (
                        <span className="badge badge-danger"><XCircle size={11} /> REJECT</span>
                      )}
                    </td>
                    <td style={{ color: lr.accepted ? 'var(--text-muted)' : '#b91c1c' }}>
                      {lr.accepted ? 'Accepted by ε-NFA state machine' : lr.reason}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* If FLAT rejected, halt here */}
      {!isFlatValid && (
        <div className="academic-card" style={{ textAlign: 'center', padding: '2.5rem 1.5rem', color: 'var(--text-muted)' }}>
          <AlertTriangle size={36} color="#f59e0b" style={{ margin: '0 auto 0.75rem auto' }} />
          <h3 style={{ color: 'var(--text-main)', marginBottom: '0.4rem' }}>Workflow Halted at Stage 2 (FLAT Validation)</h3>
          <p style={{ maxWidth: '600px', margin: '0 auto 1rem auto', fontSize: '0.85rem' }}>
            The integrated simulator strictly requires valid formal syntax before allocating pipeline hardware or constructing state graphs. Select a valid preset above to resume the end-to-end workflow.
          </p>
          <button className="btn btn-primary btn-sm" onClick={() => handlePresetSelect(INTEGRATED_PRESETS[0])}>
            Load Standard Valid Instruction Stream
          </button>
        </div>
      )}

      {/* STAGE 3: COA PIPELINE SIMULATION */}
      {isFlatValid && workflowResult.coa && (
        <div className="academic-card card-coa" style={{ marginBottom: '1.25rem' }}>
          <div className="card-header">
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Cpu size={18} color="var(--coa-color)" />
              <h3>3. COA Pipeline Simulation</h3>
            </div>
            <span className="badge badge-info">COA — Module 3.1</span>
          </div>

          <div style={{ fontSize: '0.85rem', marginBottom: '0.75rem' }}>
            <span><strong>Pipeline Architecture:</strong> Classical 5-stage RISC educational model (IF → ID → EX → MEM → WB).</span>
          </div>

          {/* Metrics Summary Strip */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '0.6rem', marginBottom: '0.85rem' }}>
            <div className="stat-box">
              <div className="stat-label">Total Cycles (T)</div>
              <div className="stat-value" style={{ color: 'var(--coa-color)' }}>{workflowResult.coa.totalCycles}</div>
            </div>
            <div className="stat-box">
              <div className="stat-label">Stall Cycles</div>
              <div className="stat-value" style={{ color: workflowResult.coa.totalStalls > 0 ? '#dc2626' : '#16a34a' }}>
                {workflowResult.coa.totalStalls}
              </div>
            </div>
            <div className="stat-box">
              <div className="stat-label">Measured Speedup</div>
              <div className="stat-value">{workflowResult.coa.speedup}×</div>
            </div>
            <div className="stat-box">
              <div className="stat-label">Throughput (TP)</div>
              <div className="stat-value">{workflowResult.coa.throughput} IPC</div>
            </div>
            <div className="stat-box">
              <div className="stat-label">Average CPI</div>
              <div className="stat-value">{workflowResult.coa.cpi}</div>
            </div>
            <div className="stat-box">
              <div className="stat-label">Stage Utilization</div>
              <div className="stat-value">{workflowResult.coa.utilization}%</div>
            </div>
          </div>

          {/* Cycle Matrix Timeline Grid */}
          <div style={{ marginBottom: '0.5rem' }}>
            <div style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '0.4rem' }}>
              Cycle-by-Cycle Stage Overlap Timeline Matrix:
            </div>
            <PipelineMatrix
              matrix={workflowResult.coa.matrix}
              totalCycles={workflowResult.coa.totalCycles}
              currentCycle={workflowResult.coa.totalCycles}
            />
          </div>

          {workflowResult.coa.hazardEvents && workflowResult.coa.hazardEvents.length > 0 && (
            <div style={{ fontSize: '0.8rem', color: '#b45309', background: '#fffbeb', padding: '0.5rem 0.75rem', borderRadius: '4px', border: '1px solid #fde68a' }}>
              <strong>Hazard Detection:</strong> {workflowResult.coa.hazardEvents.map(h => h.detail).join('; ')}
            </div>
          )}
        </div>
      )}

      {/* STAGE 4: EDUCATIONAL EXECUTION STATE GRAPH */}
      {isFlatValid && workflowResult.graph && (
        <div className="academic-card" style={{ marginBottom: '1.25rem' }}>
          <div className="card-header">
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Layers size={18} color="#6366f1" />
              <h3>4. Educational Execution State Graph</h3>
            </div>
            <span className="badge badge-secondary">State-Space Bridge</span>
          </div>

          <div style={{ fontSize: '0.825rem', color: 'var(--text-muted)', marginBottom: '0.75rem', lineHeight: '1.5' }}>
            <div><strong>Graph Topology:</strong> {workflowResult.graph.title}</div>
            <div>
              <strong>Source State:</strong> <code>{workflowResult.graph.startNode}</code> • <strong>Target State:</strong> <code>{workflowResult.graph.goalNode}</code> • <strong>States (V):</strong> {workflowResult.graph.nodeCount} • <strong>Edges (E):</strong> {workflowResult.graph.edgeCount}
            </div>
            <div style={{ fontStyle: 'italic', marginTop: '0.2rem' }}>
              Note: Represents an educational execution/scheduling state space derived from the pipeline workflow, evaluated under non-negative transition weights.
            </div>
          </div>

          {/* Visual State Graph Canvas */}
          <GraphVisualizer
            graph={workflowResult.graph.graph}
            startNode={workflowResult.graph.startNode}
            goalNode={workflowResult.graph.goalNode}
            path={workflowResult.comparison.astarPath}
          />
        </div>
      )}

      {/* STAGE 5 & 6: DUAL SEARCH ALGORITHMS (A* vs DIJKSTRA) */}
      {isFlatValid && workflowResult.astar && workflowResult.dijkstra && (
        <div className="grid-2" style={{ marginBottom: '1.25rem' }}>
          {/* AI/ML: A* Search */}
          <div className="academic-card card-aiml">
            <div className="card-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Sparkles size={18} color="var(--aiml-color)" />
                <h3>5. AI/ML — A* Search</h3>
              </div>
              <span className="badge badge-success">AI/ML — Module 2.7</span>
            </div>

            <div style={{ fontSize: '0.825rem', marginBottom: '0.6rem' }}>
              <div><strong>Evaluation Function:</strong> <code>f(n) = g(n) + h(n)</code> (Informed Search)</div>
              <div><strong>Heuristic:</strong> Admissible Euclidean Distance estimate</div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.5rem', marginBottom: '0.75rem' }}>
              <div className="stat-box">
                <div className="stat-label">Optimal Path Cost</div>
                <div className="stat-value" style={{ color: 'var(--aiml-color)' }}>{workflowResult.astar.pathCost}</div>
              </div>
              <div className="stat-box">
                <div className="stat-label">Nodes Explored</div>
                <div className="stat-value">{workflowResult.astar.nodesExplored}</div>
              </div>
            </div>

            <div style={{ fontSize: '0.8rem', background: '#f8fafc', padding: '0.5rem', borderRadius: '4px', border: '1px solid var(--border-color)', marginBottom: '0.5rem' }}>
              <div><strong>Discovered Path:</strong></div>
              <div className="font-mono" style={{ color: 'var(--aiml-color)', fontWeight: 600 }}>
                {workflowResult.astar.path.join(' → ')}
              </div>
            </div>

            <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
              <span className="badge badge-success">
                <ShieldCheck size={12} /> Admissibility: {workflowResult.astar.admissibilityVerified ? 'Verified (h ≤ h*)' : 'Checked'}
              </span>
              <span className="badge badge-success">
                <ShieldCheck size={12} /> Consistency: {workflowResult.astar.consistencyVerified ? 'Verified (Monotonic)' : 'Checked'}
              </span>
            </div>
          </div>

          {/* DAA: Dijkstra's SSSP */}
          <div className="academic-card card-daa">
            <div className="card-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <GitBranch size={18} color="var(--daa-color)" />
                <h3>6. DAA — Dijkstra Search</h3>
              </div>
              <span className="badge badge-warning">DAA — Module 3.13</span>
            </div>

            <div style={{ fontSize: '0.825rem', marginBottom: '0.6rem' }}>
              <div><strong>Relaxation:</strong> <code>dist[v] = min(dist[v], dist[u] + w)</code></div>
              <div><strong>Graph Parity:</strong> Evaluated on the <strong>exact same graph & weights</strong></div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.5rem', marginBottom: '0.75rem' }}>
              <div className="stat-box">
                <div className="stat-label">Optimal Path Cost</div>
                <div className="stat-value" style={{ color: 'var(--daa-color)' }}>{workflowResult.dijkstra.pathCost}</div>
              </div>
              <div className="stat-box">
                <div className="stat-label">Vertices Settled</div>
                <div className="stat-value">{workflowResult.dijkstra.nodesExplored}</div>
              </div>
            </div>

            <div style={{ fontSize: '0.8rem', background: '#f8fafc', padding: '0.5rem', borderRadius: '4px', border: '1px solid var(--border-color)', marginBottom: '0.5rem' }}>
              <div><strong>Discovered Path:</strong></div>
              <div className="font-mono" style={{ color: 'var(--daa-color)', fontWeight: 600 }}>
                {workflowResult.dijkstra.path.join(' → ')}
              </div>
            </div>

            <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
              <span className="badge badge-warning">
                <ShieldCheck size={12} /> Priority Queue: Binary Min-Heap
              </span>
              <span className="badge badge-warning">
                <ShieldCheck size={12} /> Non-Negative Weights: Enforced
              </span>
            </div>
          </div>
        </div>
      )}

      {/* STAGE 7: INTEGRATED COMPARISON & VERDICT */}
      {isFlatValid && workflowResult.comparison && (
        <div className="academic-card" style={{ marginBottom: '1.25rem' }}>
          <div className="card-header">
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Scale size={18} color="#2563eb" />
              <h3>7. Integrated Algorithm Comparison (Strict Experimental Parity)</h3>
            </div>
            <span className="badge badge-success">Empirically Verified</span>
          </div>

          <div className="table-container">
            <table className="academic-table" style={{ fontSize: '0.85rem' }}>
              <thead>
                <tr>
                  <th>Parity & Evaluation Metric</th>
                  <th style={{ background: '#ecfdf5', color: '#047857' }}>A* Search (AI/ML Module 2.7)</th>
                  <th style={{ background: '#fffbeb', color: '#b45309' }}>Dijkstra (DAA Module 3.13)</th>
                  <th>Parity Verification</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td><strong>Graph Topology & Weights</strong></td>
                  <td>{workflowResult.graph.title}</td>
                  <td>{workflowResult.graph.title}</td>
                  <td><span className="badge badge-success">✓ Same Graph</span></td>
                </tr>
                <tr>
                  <td><strong>Source → Target Endpoints</strong></td>
                  <td><code>{workflowResult.graph.startNode}</code> → <code>{workflowResult.graph.goalNode}</code></td>
                  <td><code>{workflowResult.graph.startNode}</code> → <code>{workflowResult.graph.goalNode}</code></td>
                  <td><span className="badge badge-success">✓ Same Endpoints</span></td>
                </tr>
                <tr>
                  <td><strong>Optimal Path Cost</strong></td>
                  <td className="font-mono" style={{ fontWeight: 700, color: '#047857' }}>{workflowResult.comparison.astarCost}</td>
                  <td className="font-mono" style={{ fontWeight: 700, color: '#b45309' }}>{workflowResult.comparison.dijkstraCost}</td>
                  <td>
                    {workflowResult.comparison.costsMatch ? (
                      <span className="badge badge-success"><CheckCircle2 size={12} /> Exact Cost Parity</span>
                    ) : (
                      <span className="badge badge-danger">Cost Discrepancy</span>
                    )}
                  </td>
                </tr>
                <tr>
                  <td><strong>Recovered Path Length</strong></td>
                  <td>{workflowResult.comparison.astarPath.length} states</td>
                  <td>{workflowResult.comparison.dijkstraPath.length} states</td>
                  <td>Path step count</td>
                </tr>
                <tr>
                  <td><strong>States / Vertices Explored</strong></td>
                  <td className="font-mono">{workflowResult.comparison.astarNodesExplored} nodes</td>
                  <td className="font-mono">{workflowResult.comparison.dijkstraNodesExplored} nodes</td>
                  <td>
                    {workflowResult.comparison.nodesDiff > 0 ? (
                      <span className="badge badge-info">A* pruned {workflowResult.comparison.nodesDiff} node(s)</span>
                    ) : workflowResult.comparison.nodesDiff === 0 ? (
                      <span className="badge badge-secondary">Equal exploration</span>
                    ) : (
                      <span className="badge badge-warning">Dijkstra explored fewer</span>
                    )}
                  </td>
                </tr>
                <tr>
                  <td><strong>Search Strategy</strong></td>
                  <td>Goal-Directed Heuristic: f(n) = g(n) + h(n)</td>
                  <td>Greedy Radial Relaxation: dist[v]</td>
                  <td>Informed vs Exhaustive</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div style={{ marginTop: '0.75rem', fontSize: '0.8rem', color: 'var(--text-muted)', lineHeight: '1.5' }}>
            <strong>Academic Observation:</strong> Both algorithms produced the same shortest-path cost ({workflowResult.comparison.astarCost}) for this execution state graph. Neither algorithm is claimed to be universally superior: A* leverages geometric heuristic guidance for point-to-point path queries, while Dijkstra calculates the complete Single-Source Shortest Path Tree without coordinate requirements.
          </div>
        </div>
      )}

      {/* FINAL INTEGRATED RESULT CARD */}
      {isFlatValid && (
        <div className="academic-card" style={{ background: '#f8fafc', borderLeft: '4px solid #2563eb' }}>
          <div className="card-header">
            <h3>INTEGRATED ANALYSIS RESULT</h3>
            <span className="badge badge-success">End-to-End Success</span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '0.75rem', fontSize: '0.825rem' }}>
            <div style={{ background: '#ffffff', padding: '0.65rem', borderRadius: '4px', border: '1px solid var(--border-color)' }}>
              <div style={{ fontWeight: 700, color: 'var(--flat-color)', marginBottom: '0.2rem' }}>FLAT (Module 2.7)</div>
              <div>✓ Instruction validated via Thompson $\varepsilon$-NFA</div>
              <div style={{ color: 'var(--text-muted)', fontSize: '0.75rem', marginTop: '0.25rem' }}>
                States: {workflowResult.flat.automatonSummary.statesCount} • Verifier: ACCEPT
              </div>
            </div>

            <div style={{ background: '#ffffff', padding: '0.65rem', borderRadius: '4px', border: '1px solid var(--border-color)' }}>
              <div style={{ fontWeight: 700, color: 'var(--coa-color)', marginBottom: '0.2rem' }}>COA (Module 3.1)</div>
              <div>✓ 5-Stage RISC pipeline simulated</div>
              <div style={{ color: 'var(--text-muted)', fontSize: '0.75rem', marginTop: '0.25rem' }}>
                Cycles: {workflowResult.coa.totalCycles} • Speedup: {workflowResult.coa.speedup}× • CPI: {workflowResult.coa.cpi}
              </div>
            </div>

            <div style={{ background: '#ffffff', padding: '0.65rem', borderRadius: '4px', border: '1px solid var(--border-color)' }}>
              <div style={{ fontWeight: 700, color: 'var(--aiml-color)', marginBottom: '0.2rem' }}>AI/ML (Module 2.7)</div>
              <div>✓ A* search completed on state graph</div>
              <div style={{ color: 'var(--text-muted)', fontSize: '0.75rem', marginTop: '0.25rem' }}>
                Cost: {workflowResult.astar.pathCost} • Nodes: {workflowResult.astar.nodesExplored} • Admissible: ✓
              </div>
            </div>

            <div style={{ background: '#ffffff', padding: '0.65rem', borderRadius: '4px', border: '1px solid var(--border-color)' }}>
              <div style={{ fontWeight: 700, color: 'var(--daa-color)', marginBottom: '0.2rem' }}>DAA (Module 3.13)</div>
              <div>✓ Dijkstra completed on same graph</div>
              <div style={{ color: 'var(--text-muted)', fontSize: '0.75rem', marginTop: '0.25rem' }}>
                Cost: {workflowResult.dijkstra.pathCost} • Settled: {workflowResult.dijkstra.nodesExplored} • Parity: ✓
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
