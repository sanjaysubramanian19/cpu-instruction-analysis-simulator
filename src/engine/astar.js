/**
 * AI/ML Engine: A* Search Algorithm
 * Academic Reference:
 *   - AI/ML Module 2.7: A* Search Fundamentals: The Gold Standard of Search (PRIMARY)
 *   - AI/ML Module 2.1: The AI Search Engine: Exploring Possibility Space
 *   - AI/ML Module 2.5: Heuristics 101: Guiding AI with Smart Estimates
 *   - AI/ML Module 2.8: A* in Action: Building Optimal Pathfinders
 *   - AI/ML Module 2.9: Designing Good Heuristics: The Art Behind Smart Search
 *
 * Implements:
 * 1. f(n) = g(n) + h(n) evaluation function
 * 2. Binary Min-Heap Open Set & Set-based Closed Set
 * 3. Step-by-step state recording for interactive visualization
 * 4. Path reconstruction via parent backpointers
 * 5. Heuristic Admissibility check: h(n) <= h*(n)
 * Note: Pure AI search technique. No machine learning training is claimed.
 */

import { PriorityQueue } from './priorityQueue.js';
import { calculateEuclideanHeuristic } from './graph.js';
import { runDijkstra } from './dijkstra.js';

/**
 * Programmatically verifies heuristic admissibility and consistency against true shortest paths.
 * Academic Reference: AI/ML Module 2.5 & 2.9 (Admissibility: h(n) <= h*(n), Consistency: h(u) <= c(u,v) + h(v))
 * @param {import('./graph.js').WeightedGraph} graph
 * @param {string} goalNode - Target goal state
 * @param {Function} [customHeuristic] - Heuristic function
 * @returns {{
 *   isAdmissible: boolean,
 *   isConsistent: boolean,
 *   nodeDetails: Record<string, { h: number, hStar: number, admissible: boolean }>,
 *   edgeViolations: Array<{ from: string, to: string, hU: number, weight: number, hV: number }>
 * }}
 */
export function verifyHeuristicAdmissibilityAndConsistency(graph, goalNode, customHeuristic = null) {
  const goalObj = graph.getNode(goalNode);
  if (!goalObj) {
    return { isAdmissible: true, isConsistent: true, nodeDetails: {}, edgeViolations: [] };
  }

  const heuristic = customHeuristic || ((nodeA, nodeB) => calculateEuclideanHeuristic(nodeA, nodeB));
  const nodes = graph.getAllNodes();
  const edges = graph.getAllEdges();

  let isAdmissible = true;
  const nodeDetails = {};

  // 1. Check Admissibility for all nodes: h(n) <= h*(n)
  for (const n of nodes) {
    const hVal = heuristic(n, goalObj);
    // True distance to goal computed via Dijkstra
    const trueDistRes = runDijkstra(graph, n.id, goalNode);
    const hStar = trueDistRes.pathCost;

    // If goal is unreachable from n, h(n) <= infinity is trivially true
    const nodeAdmissible = hStar === Infinity ? true : (hVal <= hStar + 1e-4);
    if (!nodeAdmissible) {
      isAdmissible = false;
    }

    nodeDetails[n.id] = {
      h: Number(hVal.toFixed(2)),
      hStar: hStar === Infinity ? Infinity : Number(hStar.toFixed(2)),
      admissible: nodeAdmissible
    };
  }

  // 2. Check Consistency (Triangle Inequality) for all edges: h(u) <= weight(u, v) + h(v)
  let isConsistent = true;
  const edgeViolations = [];

  for (const edge of edges) {
    const uNode = graph.getNode(edge.from);
    const vNode = graph.getNode(edge.to);
    const hU = heuristic(uNode, goalObj);
    const hV = heuristic(vNode, goalObj);

    if (hU > edge.weight + hV + 1e-4) {
      isConsistent = false;
      edgeViolations.push({
        from: edge.from,
        to: edge.to,
        hU: Number(hU.toFixed(2)),
        weight: edge.weight,
        hV: Number(hV.toFixed(2))
      });
    }
  }

  return {
    isAdmissible,
    isConsistent,
    nodeDetails,
    edgeViolations
  };
}

/**
 * Runs the A* search algorithm from startNode to goalNode on a WeightedGraph.
 * @param {import('./graph.js').WeightedGraph} graph
 * @param {string} startNode - ID of start node
 * @param {string} goalNode - ID of goal node
 * @param {Function} [customHeuristic] - (nodeA, nodeB) => number
 * @returns {{
 *   path: string[],
 *   pathCost: number,
 *   nodesExplored: number,
 *   iterations: number,
 *   steps: Array<Object>,
 *   allFGH: Record<string, { g: number, h: number, f: number, parent: string | null }>,
 *   success: boolean,
 *   admissible: boolean
 * }}
 */
export function runAStar(graph, startNode, goalNode, customHeuristic = null) {
  const goalObj = graph.getNode(goalNode);
  const startObj = graph.getNode(startNode);

  if (!startObj || !goalObj) {
    return {
      path: [],
      pathCost: Infinity,
      nodesExplored: 0,
      iterations: 0,
      steps: [],
      allFGH: {},
      success: false,
      admissible: true
    };
  }

  const heuristic = customHeuristic || ((nodeA, nodeB) => calculateEuclideanHeuristic(nodeA, nodeB));

  // Initialize data structures
  const gScore = new Map(); // id -> accumulated cost g(n)
  const hScore = new Map(); // id -> heuristic estimate h(n)
  const fScore = new Map(); // id -> total evaluation f(n)
  const parent = new Map(); // id -> predecessor
  const closedSet = new Set();
  const openQueue = new PriorityQueue();

  const allNodes = graph.getAllNodes();
  for (const n of allNodes) {
    gScore.set(n.id, Infinity);
    hScore.set(n.id, heuristic(n, goalObj));
    fScore.set(n.id, Infinity);
    parent.set(n.id, null);
  }

  // Start node initialization
  gScore.set(startNode, 0);
  const startH = heuristic(startObj, goalObj);
  fScore.set(startNode, startH);
  openQueue.insert(startNode, startH);

  const steps = [];
  let iterations = 0;
  let success = false;

  // Record initial step
  steps.push({
    iteration: 0,
    currentNode: null,
    action: 'INITIALIZE',
    openSet: [{ id: startNode, f: startH, g: 0, h: startH }],
    closedSet: [],
    relaxedEdges: [],
    description: `A* initialized with Start=${startNode} (g=0, h=${startH}, f=${startH}) and Goal=${goalNode}.`
  });

  // Main A* Loop
  while (!openQueue.isEmpty()) {
    iterations++;
    const currentEntry = openQueue.extractMin();
    const currId = currentEntry.key;
    const currG = gScore.get(currId);
    const currH = hScore.get(currId);
    const currF = fScore.get(currId);

    closedSet.add(currId);

    // Goal test
    if (currId === goalNode) {
      success = true;
      steps.push({
        iteration: iterations,
        currentNode: currId,
        action: 'GOAL_REACHED',
        openSet: openQueue.toArray().map(e => ({
          id: e.key,
          f: fScore.get(e.key),
          g: gScore.get(e.key),
          h: hScore.get(e.key)
        })),
        closedSet: Array.from(closedSet),
        relaxedEdges: [],
        description: `Goal node '${goalNode}' reached with optimal f=${currF.toFixed(2)}.`
      });
      break;
    }

    const neighbors = graph.getNeighbors(currId);
    const relaxedInThisStep = [];

    for (const edge of neighbors) {
      const neighborId = edge.to;
      const weight = edge.weight;

      if (closedSet.has(neighborId)) {
        continue;
      }

      const tentativeG = currG + weight;
      const prevG = gScore.get(neighborId);

      if (tentativeG < prevG) {
        parent.set(neighborId, currId);
        gScore.set(neighborId, tentativeG);
        const h = hScore.get(neighborId);
        const f = tentativeG + h;
        fScore.set(neighborId, f);

        openQueue.insert(neighborId, f);
        relaxedInThisStep.push({
          from: currId,
          to: neighborId,
          weight,
          tentativeG,
          h,
          f,
          improved: true
        });
      }
    }

    steps.push({
      iteration: iterations,
      currentNode: currId,
      action: 'EXPAND_NODE',
      openSet: openQueue.toArray().map(e => ({
        id: e.key,
        f: Number(fScore.get(e.key).toFixed(2)),
        g: Number(gScore.get(e.key).toFixed(2)),
        h: Number(hScore.get(e.key).toFixed(2))
      })),
      closedSet: Array.from(closedSet),
      relaxedEdges: relaxedInThisStep,
      description: `Expanded node '${currId}' [g=${currG.toFixed(2)}, h=${currH.toFixed(2)}, f=${currF.toFixed(2)}]. Evaluated ${neighbors.length} outgoing transitions.`
    });
  }

  // Reconstruct optimal path
  const path = [];
  if (success) {
    let curr = goalNode;
    while (curr !== null) {
      path.unshift(curr);
      curr = parent.get(curr);
    }
  }

  const pathCost = success ? gScore.get(goalNode) : Infinity;

  // Compile summary table of all nodes
  const allFGH = {};
  for (const n of allNodes) {
    allFGH[n.id] = {
      g: gScore.get(n.id) === Infinity ? '∞' : Number(gScore.get(n.id).toFixed(2)),
      h: Number(hScore.get(n.id).toFixed(2)),
      f: fScore.get(n.id) === Infinity ? '∞' : Number(fScore.get(n.id).toFixed(2)),
      parent: parent.get(n.id),
      inClosedSet: closedSet.has(n.id),
      inOpenSet: openQueue.contains(n.id)
    };
  }

  // Programmatic Admissibility & Consistency verification against true Dijkstra distances
  const heuristicAudit = verifyHeuristicAdmissibilityAndConsistency(graph, goalNode, customHeuristic);

  return {
    path,
    pathCost: pathCost === Infinity ? Infinity : Number(pathCost.toFixed(2)),
    nodesExplored: closedSet.size,
    iterations,
    steps,
    allFGH,
    success,
    admissible: heuristicAudit.isAdmissible,
    consistent: heuristicAudit.isConsistent,
    heuristicAudit
  };
}
