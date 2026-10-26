import React, { useState, useEffect, useRef } from 'react';
import { createDefaultExecutionGraph, createMultiPathGraph } from '../engine/graph.js';
import { runDijkstra } from '../engine/dijkstra.js';
import GraphVisualizer from './GraphVisualizer.jsx';
import { Play, Pause, SkipForward, RotateCcw, CheckCircle, Calculator, Zap } from 'lucide-react';

export default function DijkstraLab() {
  const [selectedTopology, setSelectedTopology] = useState('DEFAULT');
  const [activeGraphData, setActiveGraphData] = useState(() => createDefaultExecutionGraph());
  const [startNode, setStartNode] = useState('S_INIT');
  const [goalNode, setGoalNode] = useState('G_COMMIT');

  const [dijkstraResult, setDijkstraResult] = useState(null);
  const [currentStepIdx, setCurrentStepIdx] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const playTimerRef = useRef(null);

  // Compute Dijkstra whenever graph, start, or goal changes
  useEffect(() => {
    if (activeGraphData?.graph) {
      const res = runDijkstra(activeGraphData.graph, startNode, goalNode);
      setDijkstraResult(res);
      setCurrentStepIdx(res.steps.length > 0 ? res.steps.length - 1 : 0);
      setIsPlaying(false);
    }
  }, [activeGraphData, startNode, goalNode]);

  // Stepping timer
  useEffect(() => {
    if (isPlaying) {
      playTimerRef.current = setInterval(() => {
        setCurrentStepIdx(prev => {
          if (!dijkstraResult || prev >= dijkstraResult.steps.length - 1) {
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
  }, [isPlaying, dijkstraResult]);

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

  const currentStep = dijkstraResult?.steps[currentStepIdx] || null;

  return (
    <div>
      {/* Academic Header Banner */}
      <div className="page-academic-banner" style={{ borderLeftColor: 'var(--daa-color)' }}>
        <div className="banner-title-row">
          <div>
            <h2>DAA – Dijkstra Algorithm Lab</h2>
            <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
              Design and Analysis of Algorithms • Evaluation: <strong>15 Marks</strong>
            </div>
          </div>
          <span className="module-tag" style={{ background: '#fffbeb', color: '#b45309', borderColor: '#fde68a' }}>
            Primary Concept: Module 3.13
          </span>
        </div>

        <div className="banner-concepts-row">
          <div className="concept-box">
            <div className="concept-label">Primary Module (4 Marks)</div>
            <strong>Module 3.13:</strong> Dijkstra's Algorithm (Greedy Single-Source Shortest Path & SPT)
          </div>
          <div className="concept-box">
            <div className="concept-label">Supporting Syllabus Modules</div>
            <span><strong>Module 1.3:</strong> Asymptotic Analysis • <strong>Module 1.7:</strong> Graph Foundations • <strong>Module 3.1:</strong> Greedy Algorithms • <strong>Module 3.2:</strong> Evaluating Greedy Strategies • <strong>Module 3.15:</strong> Shortest Path Algorithms</span>
          </div>
        </div>
      </div>

      {/* Top Configuration & Complexity Cards */}
      <div className="grid-2">
        <div className="academic-card card-daa">
          <div className="card-header">
            <h3>A. Graph Topology & Invariants</h3>
            <span className="badge badge-warning">Greedy Strategy</span>
          </div>

          <div className="control-group">
            <label className="control-label">Select Graph Topology Preset (Identical to A* Lab):</label>
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
              <label className="control-label">Source Node:</label>
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
              <label className="control-label">Target Destination:</label>
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

          {/* Academic Relaxation Invariant */}
          <div className="concept-box" style={{ background: '#fffbeb', borderColor: '#fde68a' }}>
            <div className="concept-label" style={{ color: '#b45309' }}>
              Module 3.13: Edge Relaxation Condition & Non-Negative Weights
            </div>
            <div style={{ fontSize: '0.8rem', lineHeight: '1.5' }}>
              <div>• <strong>Relaxation Formula:</strong> dist[v] = min(dist[v], dist[u] + weight(u, v))</div>
              <div>• <strong>Greedy Invariant:</strong> Once a node u is extracted from the min-heap, dist[u] is permanently optimal.</div>
              <div>• <strong>Non-Negative Weights:</strong> Requires w(u, v) ≥ 0 to guarantee that expanding a node never decreases already settled distances.</div>
            </div>
          </div>
        </div>

        {/* Section E: Complexity Analysis & Operations */}
        <div className="academic-card card-daa">
          <div className="card-header">
            <h3>B. Asymptotic Complexity (Module 1.3 & 3.13)</h3>
            <span className="badge badge-info">O((V+E) log V)</span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.75rem', marginBottom: '1rem' }}>
            <div className="stat-box">
              <div className="stat-value">{dijkstraResult ? dijkstraResult.pathCost : '—'}</div>
              <div className="stat-label">Shortest Path Cost</div>
            </div>
            <div className="stat-box">
              <div className="stat-value">{dijkstraResult ? dijkstraResult.nodesExplored : '—'}</div>
              <div className="stat-label">Settled Vertices (Visited)</div>
            </div>
            <div className="stat-box">
              <div className="stat-value">{dijkstraResult ? dijkstraResult.operations.relaxations : '—'}</div>
              <div className="stat-label">Edge Relaxations</div>
            </div>
          </div>

          {/* Asymptotic Comparison Box */}
          <div className="concept-box" style={{ marginBottom: '1rem' }}>
            <div className="concept-label">Module 1.3: Asymptotic Bounds vs Empirical Counts</div>
            <div style={{ fontSize: '0.785rem', fontFamily: 'monospace', lineHeight: '1.6' }}>
              <div>• Min-Heap Binary Tree: <strong>{dijkstraResult?.complexity?.theoreticalHeap}</strong></div>
              <div>• Dense Array Matrix: <strong>{dijkstraResult?.complexity?.theoreticalArray}</strong></div>
              <div>• Vertex Extractions: <strong>{dijkstraResult?.operations?.vertexExtractions}</strong> (O(V log V))</div>
              <div>• Edge Relaxations Performed: <strong>{dijkstraResult?.operations?.relaxations}</strong> (O(E log V))</div>
            </div>
          </div>

          {/* Optimal Path Trace */}
          <div style={{ background: '#f8fafc', padding: '0.75rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)' }}>
            <div style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-muted)' }}>
              Shortest Path Tree (SPT) Path:
            </div>
            <div style={{ fontSize: '1rem', fontWeight: 700, color: '#d97706', marginTop: '0.2rem', fontFamily: 'monospace' }}>
              {dijkstraResult && dijkstraResult.path.length > 0 ? dijkstraResult.path.join(' ➔ ') : 'No path found'}
            </div>
          </div>
        </div>
      </div>

      {/* Graph Visualizer & Relaxation Stepper */}
      <div className="academic-card card-daa" style={{ marginBottom: '1.25rem' }}>
        <div className="card-header">
          <h3>C. Interactive Graph Traversal & Greedy Vertex Settling</h3>
          <div className="btn-group">
            <button
              className="btn btn-sm btn-primary"
              onClick={() => {
                if (currentStepIdx >= (dijkstraResult?.steps?.length || 1) - 1) {
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
              disabled={!dijkstraResult || currentStepIdx >= dijkstraResult.steps.length - 1}
              onClick={() => setCurrentStepIdx(prev => Math.min(dijkstraResult.steps.length - 1, prev + 1))}
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
          openSet={currentStep?.unvisitedNodes || []}
          closedSet={currentStep?.visitedNodes || []}
          path={dijkstraResult?.path || []}
        />
      </div>

      {/* Distance Table & Relaxation Event Log */}
      <div className="grid-2">
        {/* Distance Table */}
        <div className="academic-card card-daa">
          <div className="card-header">
            <h3>D. Distance Array dist[v] from Source '{startNode}'</h3>
            <span className="badge badge-info">Settled vs Unvisited</span>
          </div>

          <div className="table-container" style={{ maxHeight: '260px' }}>
            <table className="academic-table">
              <thead>
                <tr>
                  <th>Vertex v</th>
                  <th>Current dist[v]</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {activeGraphData?.graph?.getAllNodes().map(n => {
                  const distVal = currentStep?.currentDistances ? currentStep.currentDistances[n.id] : dijkstraResult?.distances[n.id];
                  const isSettled = currentStep?.visitedNodes?.includes(n.id);
                  return (
                    <tr key={n.id} style={{ background: n.id === currentStep?.currentNode ? '#fef08a' : 'transparent' }}>
                      <td><strong>{n.id}</strong> ({n.label})</td>
                      <td className="font-mono" style={{ fontWeight: 700, color: distVal !== '∞' ? '#b45309' : '#94a3b8' }}>
                        {distVal}
                      </td>
                      <td>
                        {isSettled ? (
                          <span className="badge badge-success">Settled (Visited)</span>
                        ) : (
                          <span className="badge badge-secondary" style={{ background: '#f1f5f9', color: '#64748b' }}>Unvisited</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Relaxation Logs */}
        <div className="academic-card card-daa">
          <div className="card-header">
            <h3>E. Edge Relaxation History Log (Module 3.13)</h3>
            <span className="badge badge-warning">dist[v] Updated</span>
          </div>

          <div className="table-container" style={{ maxHeight: '260px' }}>
            <table className="academic-table">
              <thead>
                <tr>
                  <th>Iter</th>
                  <th>Edge (u → v)</th>
                  <th>w(u, v)</th>
                  <th>Old dist[v]</th>
                  <th>New dist[v]</th>
                </tr>
              </thead>
              <tbody>
                {dijkstraResult?.relaxationLogs?.map((log, idx) => (
                  <tr key={idx}>
                    <td>{log.iteration}</td>
                    <td className="font-mono"><strong>{log.from} → {log.to}</strong></td>
                    <td className="font-mono">{log.weight}</td>
                    <td className="font-mono" style={{ color: '#94a3b8' }}>{log.prevDist}</td>
                    <td className="font-mono" style={{ fontWeight: 700, color: '#16a34a' }}>{log.newDist}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
