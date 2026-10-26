/**
 * DAA Engine: Dijkstra's Single-Source Shortest Path Algorithm
 * Academic Reference:
 *   - DAA Module 3.13: Dijkstra's Algorithm (PRIMARY)
 *   - DAA Module 1.3: Asymptotic Analysis and Amortized Complexity (O((V+E) log V))
 *   - DAA Module 1.7: Revisiting Graph Foundations
 *   - DAA Module 3.1: Introduction to Greedy Algorithms
 *   - DAA Module 3.2: Evaluating Greedy Strategies
 *   - DAA Module 3.15: Shortest Path Algorithms with Dijkstra
 *
 * Implements:
 * 1. Greedy vertex selection using Binary Min-Heap Priority Queue
 * 2. Edge relaxation: dist[v] = min(dist[v], dist[u] + weight(u, v))
 * 3. Shortest Path Tree (SPT) backpointer maintenance
 * 4. Step-by-step relaxation logging for pedagogical visualization
 * 5. Theoretical vs Empirical operation counter
 * Note: Pure DAA algorithmic implementation without third-party libraries.
 */

import { PriorityQueue } from './priorityQueue.js';

/**
 * Runs Dijkstra's algorithm from startNode to goalNode (or all nodes) on a WeightedGraph.
 * @param {import('./graph.js').WeightedGraph} graph
 * @param {string} startNode - ID of source node
 * @param {string} [goalNode] - Optional target node to terminate early
 * @returns {{
 *   path: string[],
 *   pathCost: number,
 *   distances: Record<string, number>,
 *   nodesExplored: number,
 *   iterations: number,
 *   steps: Array<Object>,
 *   relaxationLogs: Array<Object>,
 *   operations: { vertexExtractions: number, edgeExams: number, relaxations: number },
 *   complexity: { theoreticalHeap: string, theoreticalArray: string, vCount: number, eCount: number },
 *   success: boolean
 * }}
 */
export function runDijkstra(graph, startNode, goalNode = null) {
  const allNodes = graph.getAllNodes();
  const allEdges = graph.getAllEdges();
  const V = allNodes.length;
  const E = allEdges.length;

  const distances = new Map(); // id -> shortest known distance from start
  const parent = new Map(); // id -> predecessor node
  const visited = new Set(); // visited/settled vertices
  const pq = new PriorityQueue();

  // Operation counters for DAA Module 1.3 Asymptotic Analysis
  let vertexExtractions = 0;
  let edgeExams = 0;
  let relaxations = 0;

  // 1. Distance Initialization (Module 3.13)
  for (const n of allNodes) {
    distances.set(n.id, Infinity);
    parent.set(n.id, null);
  }

  // Source node distance is 0
  distances.set(startNode, 0);
  pq.insert(startNode, 0);

  const steps = [];
  const relaxationLogs = [];
  let iterations = 0;
  let success = false;

  // Initial step snapshot
  steps.push({
    iteration: 0,
    currentNode: null,
    action: 'INITIALIZE',
    currentDistances: getDistanceSnapshot(distances),
    visitedNodes: [],
    unvisitedNodes: allNodes.map(n => n.id),
    relaxedEdges: [],
    description: `Dijkstra initialized: Source '${startNode}' set to 0, all other ${V - 1} vertices set to ∞.`
  });

  // 2. Greedy Loop: Select minimum distance unvisited vertex
  while (!pq.isEmpty()) {
    iterations++;
    const entry = pq.extractMin();
    vertexExtractions++;
    const u = entry.key;
    const distU = distances.get(u);

    // If node was already processed with a smaller distance, skip
    if (visited.has(u)) continue;
    visited.add(u);

    // If a specific destination was targeted and reached
    if (goalNode && u === goalNode) {
      success = true;
      steps.push({
        iteration: iterations,
        currentNode: u,
        action: 'DESTINATION_REACHED',
        currentDistances: getDistanceSnapshot(distances),
        visitedNodes: Array.from(visited),
        unvisitedNodes: allNodes.map(n => n.id).filter(id => !visited.has(id)),
        relaxedEdges: [],
        description: `Target destination '${goalNode}' reached with permanent shortest distance ${distU}.`
      });
      break;
    }

    const neighbors = graph.getNeighbors(u);
    const relaxedInThisStep = [];

    // 3. Relax outgoing edges (Module 3.13)
    for (const edge of neighbors) {
      const v = edge.to;
      const weight = edge.weight;
      edgeExams++;

      if (visited.has(v)) continue;

      const alt = distU + weight;
      const currentV = distances.get(v);

      if (alt < currentV) {
        // Relaxation succeeds: dist[v] = dist[u] + weight(u, v)
        relaxations++;
        distances.set(v, alt);
        parent.set(v, u);
        pq.insert(v, alt);

        const logEntry = {
          iteration: iterations,
          from: u,
          to: v,
          weight,
          prevDist: currentV === Infinity ? '∞' : currentV,
          newDist: alt,
          improved: true
        };
        relaxationLogs.push(logEntry);
        relaxedInThisStep.push(logEntry);
      }
    }

    steps.push({
      iteration: iterations,
      currentNode: u,
      action: 'RELAX_OUTGOING',
      currentDistances: getDistanceSnapshot(distances),
      visitedNodes: Array.from(visited),
      unvisitedNodes: allNodes.map(n => n.id).filter(id => !visited.has(id)),
      relaxedEdges: relaxedInThisStep,
      description: `Greedily extracted vertex '${u}' (dist=${distU}). Examined ${neighbors.length} edges, relaxed ${relaxedInThisStep.length}.`
    });
  }

  // Path reconstruction if goalNode specified
  const path = [];
  let pathCost = Infinity;

  if (goalNode && (success || distances.get(goalNode) !== Infinity)) {
    success = true;
    pathCost = distances.get(goalNode);
    let curr = goalNode;
    while (curr !== null) {
      path.unshift(curr);
      curr = parent.get(curr);
    }
  }

  const finalDistances = {};
  for (const [id, d] of distances.entries()) {
    finalDistances[id] = d === Infinity ? '∞' : Number(d.toFixed(2));
  }

  return {
    path,
    pathCost: pathCost === Infinity ? Infinity : Number(pathCost.toFixed(2)),
    distances: finalDistances,
    nodesExplored: visited.size,
    iterations,
    steps,
    relaxationLogs,
    operations: {
      vertexExtractions,
      edgeExams,
      relaxations
    },
    complexity: {
      theoreticalHeap: `O((V + E) log V) = O((${V} + ${E}) log ${V}) ≈ ${Math.round((V + E) * Math.log2(Math.max(2, V)))} ops`,
      theoreticalArray: `O(V²) = O(${V}²) = ${V * V} ops`,
      vCount: V,
      eCount: E
    },
    success
  };
}

function getDistanceSnapshot(distancesMap) {
  const obj = {};
  for (const [k, v] of distancesMap.entries()) {
    obj[k] = v === Infinity ? '∞' : v;
  }
  return obj;
}
