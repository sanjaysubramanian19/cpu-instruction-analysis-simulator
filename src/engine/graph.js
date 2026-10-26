/**
 * Common Engine: Directed Weighted Graph & State-Space Representations
 * Academic Reference:
 *   - DAA Module 1.7: Revisiting Graph Foundations (Adjacency List Model)
 *   - AI/ML Module 2.1: The AI Search Engine: Exploring Possibility Space
 *   - AI/ML Module 2.5: Heuristics 101: Guiding AI with Smart Estimates
 *   - AI/ML Module 2.9: Designing Good Heuristics: The Art Behind Smart Search
 */

export class WeightedGraph {
  constructor() {
    this.nodes = new Map(); // id -> { id, label, x, y, metadata }
    this.adjacency = new Map(); // id -> Array<{ to: string, weight: number }>
  }

  addNode(id, label = id, x = 0, y = 0, metadata = {}) {
    this.nodes.set(id, { id, label, x, y, metadata });
    if (!this.adjacency.has(id)) {
      this.adjacency.set(id, []);
    }
  }

  addEdge(from, to, weight) {
    if (!this.nodes.has(from) || !this.nodes.has(to)) {
      throw new Error(`Cannot add edge: node ${from} or ${to} does not exist.`);
    }
    if (weight < 0) {
      throw new Error(`Academic constraint violated: Dijkstra requires non-negative edge weights (w=${weight}).`);
    }

    const edges = this.adjacency.get(from);
    // Avoid duplicate edges
    const existing = edges.find(e => e.to === to);
    if (existing) {
      existing.weight = weight;
    } else {
      edges.push({ to, weight });
    }
  }

  getNeighbors(nodeId) {
    return this.adjacency.get(nodeId) || [];
  }

  getNode(nodeId) {
    return this.nodes.get(nodeId);
  }

  getAllNodes() {
    return Array.from(this.nodes.values());
  }

  getAllEdges() {
    const list = [];
    for (const [from, edges] of this.adjacency.entries()) {
      for (const e of edges) {
        list.push({ from, to: e.to, weight: e.weight });
      }
    }
    return list;
  }

  clone() {
    const g = new WeightedGraph();
    for (const node of this.nodes.values()) {
      g.addNode(node.id, node.label, node.x, node.y, { ...node.metadata });
    }
    for (const [from, edges] of this.adjacency.entries()) {
      for (const e of edges) {
        g.addEdge(from, e.to, e.weight);
      }
    }
    return g;
  }
}

/**
 * Computes Euclidean Distance Heuristic between two nodes.
 * Guaranteed Admissible when coordinates match edge cost scaling.
 * Academic Reference: AI/ML Module 2.5 & 2.9 (Admissibility: h(n) <= h*(n))
 */
export function calculateEuclideanHeuristic(nodeA, nodeB, scale = 0.005) {
  if (!nodeA || !nodeB) return 0;
  const dx = nodeA.x - nodeB.x;
  const dy = nodeA.y - nodeB.y;
  return Number((Math.sqrt(dx * dx + dy * dy) * scale).toFixed(2));
}

/**
 * Computes Manhattan Distance Heuristic between two nodes.
 */
export function calculateManhattanHeuristic(nodeA, nodeB, scale = 0.004) {
  if (!nodeA || !nodeB) return 0;
  const dx = Math.abs(nodeA.x - nodeB.x);
  const dy = Math.abs(nodeA.y - nodeB.y);
  return Number(((dx + dy) * scale).toFixed(2));
}

/**
 * Standard Presets for Lab Demonstrations
 */

/**
 * Preset 1: Educational State-Space Execution Graph
 * Models 8 micro-architectural execution states with diverging branch paths.
 */
export function createDefaultExecutionGraph() {
  const g = new WeightedGraph();

  // Nodes with coordinates (x: 50..550, y: 50..350)
  g.addNode('S_INIT', 'S: Fetch Initial', 70, 180, { role: 'start' });
  g.addNode('S_ID1', 'Decode I1', 180, 90, { role: 'stage' });
  g.addNode('S_ID2', 'Decode I2', 180, 270, { role: 'stage' });
  g.addNode('S_EX_ALU', 'Execute ALU', 320, 70, { role: 'stage' });
  g.addNode('S_EX_MEM', 'Execute MEM', 320, 210, { role: 'stage' });
  g.addNode('S_HAZARD', 'Hazard Stall', 320, 310, { role: 'hazard' });
  g.addNode('S_WB1', 'Writeback Fast', 450, 120, { role: 'stage' });
  g.addNode('S_WB2', 'Writeback Sync', 450, 260, { role: 'stage' });
  g.addNode('G_COMMIT', 'G: Commit State', 560, 180, { role: 'goal' });

  // Directed edges with non-negative clock-cycle costs
  g.addEdge('S_INIT', 'S_ID1', 3);
  g.addEdge('S_INIT', 'S_ID2', 5);
  g.addEdge('S_ID1', 'S_EX_ALU', 4);
  g.addEdge('S_ID1', 'S_EX_MEM', 6);
  g.addEdge('S_ID2', 'S_EX_MEM', 3);
  g.addEdge('S_ID2', 'S_HAZARD', 2);
  g.addEdge('S_EX_ALU', 'S_WB1', 5);
  g.addEdge('S_EX_MEM', 'S_WB1', 4);
  g.addEdge('S_EX_MEM', 'S_WB2', 6);
  g.addEdge('S_HAZARD', 'S_WB2', 5);
  g.addEdge('S_WB1', 'G_COMMIT', 3);
  g.addEdge('S_WB2', 'G_COMMIT', 4);

  return {
    graph: g,
    startNode: 'S_INIT',
    goalNode: 'G_COMMIT',
    title: '8-State Execution & Scheduling Graph'
  };
}

/**
 * Preset 2: Multi-Path Benchmark Graph
 * Tests heuristic divergence where A* visits fewer nodes than Dijkstra.
 */
export function createMultiPathGraph() {
  const g = new WeightedGraph();

  g.addNode('A', 'Start (A)', 60, 180, { role: 'start' });
  g.addNode('B', 'Node B', 180, 80, { role: 'intermediate' });
  g.addNode('C', 'Node C', 180, 280, { role: 'intermediate' });
  g.addNode('D', 'Node D', 320, 80, { role: 'intermediate' });
  g.addNode('E', 'Node E', 320, 180, { role: 'intermediate' });
  g.addNode('F', 'Node F', 320, 280, { role: 'intermediate' });
  g.addNode('G', 'Goal (G)', 480, 180, { role: 'goal' });

  g.addEdge('A', 'B', 4);
  g.addEdge('A', 'C', 2);
  g.addEdge('B', 'D', 5);
  g.addEdge('C', 'E', 8);
  g.addEdge('C', 'F', 4);
  g.addEdge('D', 'G', 3);
  g.addEdge('E', 'G', 2);
  g.addEdge('F', 'G', 7);
  g.addEdge('B', 'E', 1);

  return {
    graph: g,
    startNode: 'A',
    goalNode: 'G',
    title: 'Multi-Path Convergence Benchmark'
  };
}

/**
 * Builds a dynamic execution state-space graph from a simulated instruction sequence.
 * Directly links COA pipeline stages into the common graph engine!
 */
export function buildGraphFromPipeline(instructions) {
  const g = new WeightedGraph();
  const n = instructions.length;

  if (n === 0) {
    return createDefaultExecutionGraph();
  }

  // Create start node
  g.addNode('START', 'Pipeline Start', 50, 180, { role: 'start' });

  // For each instruction, create an EX stage node and a WB node
  instructions.forEach((inst, idx) => {
    const xBase = 150 + idx * 100;
    const yTop = 100 + (idx % 2 === 0 ? -30 : 30);
    const yBot = 240 + (idx % 2 === 0 ? -30 : 30);

    const exId = `EX_${inst.id}`;
    const wbId = `WB_${inst.id}`;

    g.addNode(exId, `${inst.id}: EX (${inst.opcode})`, xBase, yTop, { role: 'stage' });
    g.addNode(wbId, `${inst.id}: WB`, xBase + 50, yBot, { role: 'stage' });

    // Edge from start to first instruction
    if (idx === 0) {
      g.addEdge('START', exId, 2);
    } else {
      // Connect previous to current
      const prevEx = `EX_${instructions[idx - 1].id}`;
      g.addEdge(prevEx, exId, 3);
    }

    // Connect EX to WB
    g.addEdge(exId, wbId, 2);
  });

  const lastWb = `WB_${instructions[n - 1].id}`;
  const goalX = 220 + n * 100;
  g.addNode('COMMIT', 'Commit All', goalX, 180, { role: 'goal' });
  g.addEdge(lastWb, 'COMMIT', 2);

  return {
    graph: g,
    startNode: 'START',
    goalNode: 'COMMIT',
    title: `Dynamic Graph from ${n} Pipeline Instructions`
  };
}
