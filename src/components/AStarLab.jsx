import React, { useState, useEffect, useRef } from 'react';
import { createDefaultExecutionGraph, createMultiPathGraph } from '../engine/graph.js';
import { runAStar } from '../engine/astar.js';
import GraphVisualizer from './GraphVisualizer.jsx';
import { Play, Pause, SkipForward, RotateCcw, CheckCircle, ShieldCheck, Compass } from 'lucide-react';

export default function AStarLab() {
  const [selectedTopology, setSelectedTopology] = useState('DEFAULT');
  const [activeGraphData, setActiveGraphData] = useState(() => createDefaultExecutionGraph());
  const [startNode, setStartNode] = useState('S_INIT');
  const [goalNode, setGoalNode] = useState('G_COMMIT');

  const [aStarResult, setAStarResult] = useState(null);
  const [currentStepIdx, setCurrentStepIdx] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const playTimerRef = useRef(null);

  // Compute A* whenever graph, start, or goal changes
  useEffect(() => {
    if (activeGraphData?.graph) {
      const res = runAStar(activeGraphData.graph, startNode, goalNode);
      setAStarResult(res);
      setCurrentStepIdx(res.steps.length > 0 ? res.steps.length - 1 : 0);
      setIsPlaying(false);
    }
  }, [activeGraphData, startNode, goalNode]);

  // Stepping timer
  useEffect(() => {
    if (isPlaying) {
      playTimerRef.current = setInterval(() => {
        setCurrentStepIdx(prev => {
          if (!aStarResult || prev >= aStarResult.steps.length - 1) {
            setIsPlaying(false);
            return prev;
          }
          return prev + 1;
        });
      }, 700);
    } else {
      clearInterval(playTimerRef.current);
    }
    return () => clearInterval(playTimerRef.current);
  }, [isPlaying, aStarResult]);

  const handleTopologyChange = (topo) => {
    setSelectedTopology(topo);
    if (topo === 'DEFAULT') {
      const d = createDefaultExecutionGraph();
      setActiveGraphData(d);
      setStartNode(d.startNode);
      setGoalNode(d.goalNode);
    } else {
      const m = createMultiPathGraph();
      setActiveGraphData(m);
      setStartNode(m.startNode);
      setGoalNode(m.goalNode);
    }
  };

  const currentStep = aStarResult?.steps[currentStepIdx] || null;

  return (
    <div>
      {/* Academic Header Banner */}
      <div className="page-academic-banner" style={{ borderLeftColor: 'var(--aiml-color)' }}>
        <div className="banner-title-row">
          <div>
            <h2>AI/ML – A* Search Lab</h2>
            <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
              AI/ML Foundations • Evaluation: <strong>15 Marks</strong>
            </div>
          </div>
          <span className="module-tag" style={{ background: '#ecfdf5', color: '#047857', borderColor: '#a7f3d0' }}>
            Primary Concept: Module 2.7
          </span>
        </div>

        <div className="banner-concepts-row">
          <div className="concept-box">
            <div className="concept-label">Primary Module (4 Marks)</div>
            <strong>Module 2.7:</strong> A* Search Fundamentals: The Gold Standard of Search [f(n) = g(n) + h(n)]
          </div>
          <div className="concept-box">
            <div className="concept-label">Supporting Syllabus Modules</div>
            <span><strong>Module 2.1:</strong> Search Space • <strong>Module 2.5:</strong> Heuristics • <strong>Module 2.8:</strong> A* in Action • <strong>Module 2.9:</strong> Designing Good Heuristics (Admissibility)</span>
          </div>
        </div>
      </div>

      {/* Top Configuration & Metrics */}
      <div className="grid-2">
        <div className="academic-card card-aiml">
          <div className="card-header">
            <h3>A. Search Space & Heuristic Setup</h3>
            <span className="badge badge-info">State Space</span>
          </div>

          <div className="control-group">
            <label className="control-label">Select Graph Topology Preset:</label>
            <div className="btn-group" style={{ marginBottom: '0.75rem' }}>
              <button
                className={`btn btn-sm ${selectedTopology === 'DEFAULT' ? 'btn-primary' : 'btn-secondary'}`}
                onClick={() => handleTopologyChange('DEFAULT')}
              >
                8-State Execution Graph
              </button>
              <button
                className={`btn btn-sm ${selectedTopology === 'MULTIPATH' ? 'btn-primary' : 'btn-secondary'}`}
                onClick={() => handleTopologyChange('MULTIPATH')}
              >
                Multi-Path Benchmark
              </button>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '1rem' }}>
            <div>
              <label className="control-label">Start Node:</label>
              <select
                className="select-input"
                value={startNode}
                onChange={(e) => setStartNode(e.target.value)}
              >
                {activeGraphData?.graph?.getAllNodes().map(n => (
                  <option key={n.id} value={n.id}>{n.id} ({n.label})</option>
                ))}
              </select>
            </div>
            <div>
              <label className="control-label">Goal Node:</label>
              <select
                className="select-input"
                value={goalNode}
                onChange={(e) => setGoalNode(e.target.value)}
              >
                {activeGraphData?.graph?.getAllNodes().map(n => (
                  <option key={n.id} value={n.id}>{n.id} ({n.label})</option>
                ))}
              </select>
            </div>
          </div>

          {/* Academic Heuristic Card */}
          <div className="concept-box" style={{ background: '#f0fdf4', borderColor: '#bbf7d0' }}>
            <div className="concept-label" style={{ color: '#15803d' }}>
              Module 2.5 & 2.9: Admissible Heuristic Verification
            </div>
            <div style={{ fontSize: '0.8rem', lineHeight: '1.5' }}>
              <div>• <strong>Formula:</strong> f(n) = g(n) + h(n)</div>
              <div>• <strong>g(n):</strong> Exact accumulated path cost from {startNode}</div>
              <div>• <strong>h(n):</strong> Euclidean straight-line distance estimate to {goalNode}</div>
              <div>• <strong>Admissibility Condition:</strong> h(n) ≤ h*(n) ({aStarResult?.admissible ? 'Strictly Admissible ✓' : 'Suboptimal'})</div>
              <div style={{ marginTop: '0.35rem', color: '#15803d', fontWeight: 600 }}>
                Guaranteed to find optimal path without expanding entire graph.
              </div>
            </div>
          </div>
        </div>

        {/* Section E: Live A* Results */}
        <div className="academic-card card-aiml">
          <div className="card-header">
            <h3>B. Search Metrics & Optimal Path</h3>
            <span className="badge badge-success">Optimality Guaranteed</span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.75rem', marginBottom: '1rem' }}>
            <div className="stat-box">
              <div className="stat-value">{aStarResult ? aStarResult.pathCost : '—'}</div>
              <div className="stat-label">Optimal Path Cost</div>
            </div>
            <div className="stat-box">
              <div className="stat-value">{aStarResult ? aStarResult.nodesExplored : '—'}</div>
              <div className="stat-label">Nodes Explored</div>
            </div>
            <div className="stat-box">
              <div className="stat-value">{aStarResult ? aStarResult.iterations : '—'}</div>
              <div className="stat-label">Total Iterations</div>
            </div>
          </div>

          {/* Optimal Path Trace */}
          <div style={{ background: '#f8fafc', padding: '0.75rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)', marginBottom: '1rem' }}>
            <div style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-muted)' }}>
              Recovered Optimal Path:
            </div>
            <div style={{ fontSize: '1rem', fontWeight: 700, color: '#15803d', marginTop: '0.2rem', fontFamily: 'monospace' }}>
              {aStarResult && aStarResult.path.length > 0 ? aStarResult.path.join(' ➔ ') : 'No path found'}
            </div>
          </div>

          {/* Step description */}
          <div style={{ fontSize: '0.8rem', background: '#ecfdf5', padding: '0.5rem 0.75rem', borderRadius: 'var(--radius-sm)', border: '1px solid #a7f3d0' }}>
            <strong>Step {currentStepIdx} / {aStarResult ? aStarResult.steps.length - 1 : 0}:</strong> {currentStep?.description || 'Ready to run.'}
          </div>
        </div>
      </div>

      {/* Graph Visualizer & Step Playback */}
      <div className="academic-card card-aiml" style={{ marginBottom: '1.25rem' }}>
        <div className="card-header">
          <h3>C. Interactive State-Space Graph & Step-by-Step Traversal</h3>
          <div className="btn-group">
            <button
              className="btn btn-sm btn-primary"
              onClick={() => {
                if (currentStepIdx >= (aStarResult?.steps?.length || 1) - 1) {
                  setCurrentStepIdx(0);
                }
                setIsPlaying(!isPlaying);
              }}
            >
              {isPlaying ? <Pause size={14} /> : <Play size={14} />}
              {isPlaying ? 'Pause' : 'Play Traversal'}
            </button>
            <button
              className="btn btn-sm btn-secondary"
              disabled={!aStarResult || currentStepIdx >= aStarResult.steps.length - 1}
              onClick={() => setCurrentStepIdx(prev => Math.min(aStarResult.steps.length - 1, prev + 1))}
            >
              <SkipForward size={14} /> Next Step
            </button>
            <button
              className="btn btn-sm btn-secondary"
              onClick={() => setCurrentStepIdx(0)}
            >
              <RotateCcw size={14} /> Reset
            </button>
          </div>
        </div>

        <GraphVisualizer
          graph={activeGraphData?.graph}
          startNode={startNode}
          goalNode={goalNode}
          currentNode={currentStep?.currentNode}
          openSet={currentStep?.openSet || []}
          closedSet={currentStep?.closedSet || []}
          path={aStarResult?.path || []}
        />
      </div>

      {/* All Nodes F, G, H Evaluation Table */}
      <div className="academic-card card-aiml">
        <div className="card-header">
          <h3>D. Frontier Evaluation Matrix: g(n), h(n), f(n) for All States (Module 2.7)</h3>
          <span className="badge badge-info">Open & Closed Sets</span>
        </div>

        <div className="table-container">
          <table className="academic-table">
            <thead>
              <tr>
                <th>State ID</th>
                <th>g(n) [Accumulated]</th>
                <th>h(n) [Heuristic Estimate]</th>
                <th>f(n) = g(n) + h(n)</th>
                <th>Parent State</th>
                <th>Set Status</th>
              </tr>
            </thead>
            <tbody>
              {aStarResult && Object.keys(aStarResult.allFGH).map(id => {
                const row = aStarResult.allFGH[id];
                const inClosed = row.inClosedSet;
                const inOpen = row.inOpenSet;
                return (
                  <tr key={id} style={{ background: id === currentStep?.currentNode ? '#fef08a' : 'transparent' }}>
                    <td><strong>{id}</strong></td>
                    <td className="font-mono">{row.g}</td>
                    <td className="font-mono">{row.h}</td>
                    <td className="font-mono" style={{ fontWeight: 700, color: '#047857' }}>{row.f}</td>
                    <td className="font-mono">{row.parent || '— (root)'}</td>
                    <td>
                      {inClosed ? (
                        <span className="badge badge-secondary" style={{ background: '#f1f5f9', color: '#64748b' }}>Closed Set</span>
                      ) : inOpen ? (
                        <span className="badge badge-info">Open Set (PQ)</span>
                      ) : (
                        <span style={{ color: '#94a3b8', fontSize: '0.75rem' }}>Unvisited</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
