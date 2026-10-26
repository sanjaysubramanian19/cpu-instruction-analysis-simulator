import React, { useState, useMemo } from 'react';
import { createDefaultExecutionGraph, createMultiPathGraph } from '../engine/graph.js';
import { runAStar } from '../engine/astar.js';
import { runDijkstra } from '../engine/dijkstra.js';
import GraphVisualizer from './GraphVisualizer.jsx';
import { Split, CheckCircle2, AlertCircle } from 'lucide-react';

export default function Comparison() {
  const [selectedTopology, setSelectedTopology] = useState('DEFAULT');
  const [activeGraphData, setActiveGraphData] = useState(() => createDefaultExecutionGraph());
  const [startNode, setStartNode] = useState('S_INIT');
  const [goalNode, setGoalNode] = useState('G_COMMIT');

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

  // Run both algorithms simultaneously on identical graph and parameters
  const { aStar, dijkstra } = useMemo(() => {
    if (!activeGraphData?.graph) return { aStar: null, dijkstra: null };
    const a = runAStar(activeGraphData.graph, startNode, goalNode);
    const d = runDijkstra(activeGraphData.graph, startNode, goalNode);
    return { aStar: a, dijkstra: d };
  }, [activeGraphData, startNode, goalNode]);

  const costsMatch = aStar?.pathCost === dijkstra?.pathCost;
  const nodesDiff = (dijkstra?.nodesExplored || 0) - (aStar?.nodesExplored || 0);

  return (
    <div>
      {/* Header Banner */}
      <div className="page-academic-banner" style={{ borderLeftColor: '#6366f1' }}>
        <div className="banner-title-row">
          <div>
            <h2>Integrated Comparative Lab: A* (AI/ML) vs Dijkstra (DAA)</h2>
            <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
              Side-by-side empirical performance comparison on identical graph topologies
            </div>
          </div>
          <span className="module-tag" style={{ background: '#e0e7ff', color: '#4338ca' }}>
            AI/ML Mod 2.7 vs DAA Mod 3.13
          </span>
        </div>

        <div className="banner-concepts-row">
          <div className="concept-box">
            <div className="concept-label">AI/ML Subject: A* Search</div>
            <strong>Module 2.7:</strong> Informed Heuristic Search: f(n) = g(n) + h(n), guided by Euclidean geometric estimate.
          </div>
          <div className="concept-box">
            <div className="concept-label">DAA Subject: Dijkstra's Algorithm</div>
            <strong>Module 3.13:</strong> Uniform-Cost Greedy Relaxation: dist[v] = min(dist[v], dist[u] + w), radial expansion without heuristic.
          </div>
        </div>
      </div>

      {/* Topology and Endpoint Selection */}
      <div className="academic-card" style={{ marginBottom: '1.25rem' }}>
        <div className="card-header">
          <h3>Test Configuration (Strict Parity Controls)</h3>
          <span className="badge badge-info">Same Graph, Start, Goal</span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
          <div>
            <label className="control-label">Graph Topology:</label>
            <div className="btn-group">
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

          <div>
            <label className="control-label">Common Source Node:</label>
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
            <label className="control-label">Common Target Destination:</label>
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
      </div>

      {/* Comparison Metrics Table */}
      <div className="academic-card" style={{ marginBottom: '1.25rem' }}>
        <div className="card-header">
          <h3>Dynamic Empirical Comparison Matrix</h3>
          <span className="badge badge-success">Generated at Runtime</span>
        </div>

        <div className="table-container">
          <table className="academic-table" style={{ fontSize: '0.9rem' }}>
            <thead>
              <tr>
                <th style={{ width: '25%' }}>Evaluation Parameter</th>
                <th style={{ width: '35%', background: '#ecfdf5', color: '#047857' }}>
                  A* Search (AI/ML Module 2.7)
                </th>
                <th style={{ width: '35%', background: '#fffbeb', color: '#b45309' }}>
                  Dijkstra's Algorithm (DAA Module 3.13)
                </th>
                <th style={{ width: '15%' }}>Observation</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><strong>Final Path Cost</strong></td>
                <td className="font-mono" style={{ fontWeight: 700, color: '#047857' }}>
                  {aStar ? aStar.pathCost : '—'}
                </td>
                <td className="font-mono" style={{ fontWeight: 700, color: '#b45309' }}>
                  {dijkstra ? dijkstra.pathCost : '—'}
                </td>
                <td>
                  {costsMatch ? (
                    <span className="badge badge-success"><CheckCircle2 size={12} /> Cost Parity (Optimal)</span>
                  ) : (
                    <span className="badge badge-danger">Cost Mismatch</span>
                  )}
                </td>
              </tr>
              <tr>
                <td><strong>Nodes Explored (Closed/Visited)</strong></td>
                <td className="font-mono" style={{ fontWeight: 700 }}>
                  {aStar?.nodesExplored} nodes
                </td>
                <td className="font-mono" style={{ fontWeight: 700 }}>
                  {dijkstra?.nodesExplored} nodes
                </td>
                <td>
                  {nodesDiff > 0 ? (
                    <span className="badge badge-info">A* pruned {nodesDiff} node(s)</span>
                  ) : nodesDiff === 0 ? (
                    <span className="badge badge-secondary">Equal exploration</span>
                  ) : (
                    <span className="badge badge-warning">Dijkstra explored fewer</span>
                  )}
                </td>
              </tr>
              <tr>
                <td><strong>Algorithm Iterations</strong></td>
                <td className="font-mono">{aStar?.iterations} cycles</td>
                <td className="font-mono">{dijkstra?.iterations} cycles</td>
                <td>Loop cycles to goal</td>
              </tr>
              <tr>
                <td><strong>Heuristic Guidance h(n)</strong></td>
                <td><span className="badge badge-success">Yes (Euclidean Admissible)</span></td>
                <td><span className="badge badge-secondary">No (Blind / Uniform)</span></td>
                <td>h(n) = 0 reduces A* to Dijkstra</td>
              </tr>
              <tr>
                <td><strong>Search Space Strategy</strong></td>
                <td>Goal-Directed Priority: f(n) = g(n) + h(n)</td>
                <td>Greedy Shortest Distance: dist[v]</td>
                <td>Informed vs Exhaustive</td>
              </tr>
              <tr>
                <td><strong>Optimality Guarantee</strong></td>
                <td>Guaranteed optimal if h(n) ≤ h*(n)</td>
                <td>Guaranteed optimal for w(u,v) ≥ 0</td>
                <td>Both guarantee shortest path</td>
              </tr>
              <tr>
                <td><strong>Recovered Optimal Path</strong></td>
                <td className="font-mono" style={{ fontSize: '0.8rem', color: '#047857' }}>
                  {aStar?.path.join(' → ') || 'None'}
                </td>
                <td className="font-mono" style={{ fontSize: '0.8rem', color: '#b45309' }}>
                  {dijkstra?.path.join(' → ') || 'None'}
                </td>
                <td>Path reconstruction</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Side by Side Graph Displays */}
      <div className="grid-2">
        <div className="academic-card card-aiml">
          <div className="card-header">
            <h3>A* Path Traversal (AI/ML)</h3>
            <span className="badge badge-success">Cost: {aStar?.pathCost}</span>
          </div>
          <GraphVisualizer
            graph={activeGraphData?.graph}
            startNode={startNode}
            goalNode={goalNode}
            path={aStar?.path || []}
            closedSet={Array.from(new Set(aStar?.steps.flatMap(s => s.closedSet || [])))}
          />
        </div>

        <div className="academic-card card-daa">
          <div className="card-header">
            <h3>Dijkstra Path Traversal (DAA)</h3>
            <span className="badge badge-warning">Cost: {dijkstra?.pathCost}</span>
          </div>
          <GraphVisualizer
            graph={activeGraphData?.graph}
            startNode={startNode}
            goalNode={goalNode}
            path={dijkstra?.path || []}
            closedSet={Array.from(new Set(dijkstra?.steps.flatMap(s => s.visitedNodes || [])))}
          />
        </div>
      </div>

      {/* Academic Disclaimers & Insights */}
      <div className="concept-box" style={{ marginTop: '1rem', background: '#f8fafc' }}>
        <div className="concept-label">Academic Evaluation Analysis & Integrity Disclaimers</div>
        <div style={{ fontSize: '0.825rem', color: 'var(--text-main)', lineHeight: '1.6' }}>
          <div>
            1. <strong>Path Optimality Parity:</strong> Both algorithms yield identical optimal shortest path costs (<strong>{aStar?.pathCost}</strong>), proving correctness of the scratch implementations.
          </div>
          <div>
            2. <strong>Search Space Pruning:</strong> A* leverages the Euclidean heuristic estimate $h(n)$ to direct frontier expansion toward the goal, visiting <strong>{aStar?.nodesExplored}</strong> nodes compared to Dijkstra's <strong>{dijkstra?.nodesExplored}</strong> nodes in this experiment.
          </div>
          <div>
            3. <strong>Objective Comparison:</strong> A* is not inherently "better" in all topologies. In environments with misleading heuristics or zero-heuristic scenarios ($h(n) = 0$), A* reduces to Dijkstra's algorithm. Furthermore, Dijkstra constructs the complete Single-Source Shortest Path Tree (SPT) to all reachable destinations in a single run, whereas A* is optimized for point-to-point queries.
          </div>
        </div>
      </div>
    </div>
  );
}
