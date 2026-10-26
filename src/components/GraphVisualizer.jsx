import React from 'react';

export default function GraphVisualizer({
  graph,
  startNode,
  goalNode,
  currentNode = null,
  openSet = [],
  closedSet = [],
  path = [],
  onNodeClick = null
}) {
  if (!graph) {
    return (
      <div className="svg-canvas-container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '360px', color: '#94a3b8' }}>
        No graph data loaded.
      </div>
    );
  }

  const nodes = graph.getAllNodes();
  const edges = graph.getAllEdges();

  const openSetKeys = new Set(openSet.map(n => typeof n === 'string' ? n : n.id));
  const closedSetKeys = new Set(closedSet);
  const pathSet = new Set(path);

  // Set of edges on optimal path: "u->v"
  const pathEdgeSet = new Set();
  for (let i = 0; i < path.length - 1; i++) {
    pathEdgeSet.add(`${path[i]}->${path[i + 1]}`);
  }

  return (
    <div className="svg-canvas-container">
      <svg className="svg-canvas" viewBox="0 0 650 380">
        <defs>
          {/* Regular edge arrow */}
          <marker
            id="graph-arrow"
            viewBox="0 0 10 10"
            refX="24"
            refY="5"
            markerWidth="6"
            markerHeight="6"
            orient="auto-start-reverse"
          >
            <path d="M 0 1 L 10 5 L 0 9 z" fill="#94a3b8" />
          </marker>

          {/* Optimal path arrow */}
          <marker
            id="path-arrow"
            viewBox="0 0 10 10"
            refX="24"
            refY="5"
            markerWidth="7"
            markerHeight="7"
            orient="auto-start-reverse"
          >
            <path d="M 0 1 L 10 5 L 0 9 z" fill="#16a34a" />
          </marker>
        </defs>

        {/* Edges */}
        {edges.map((e, idx) => {
          const from = graph.getNode(e.from);
          const to = graph.getNode(e.to);
          if (!from || !to) return null;

          const isPathEdge = pathEdgeSet.has(`${e.from}->${e.to}`);
          const midX = (from.x + to.x) / 2;
          const midY = (from.y + to.y) / 2;

          return (
            <g key={`edge-${idx}`}>
              <line
                x1={from.x}
                y1={from.y}
                x2={to.x}
                y2={to.y}
                stroke={isPathEdge ? '#16a34a' : '#cbd5e1'}
                strokeWidth={isPathEdge ? '3.5' : '1.8'}
                markerEnd={isPathEdge ? 'url(#path-arrow)' : 'url(#graph-arrow)'}
              />

              {/* Edge Weight Pill */}
              <rect
                x={midX - 11}
                y={midY - 9}
                width="22"
                height="17"
                rx="4"
                fill="#ffffff"
                stroke={isPathEdge ? '#16a34a' : '#cbd5e1'}
                strokeWidth="1.2"
              />
              <text
                x={midX}
                y={midY + 1}
                fill={isPathEdge ? '#15803d' : '#475569'}
                fontSize="11"
                fontWeight="700"
                textAnchor="middle"
                dominantBaseline="central"
              >
                {e.weight}
              </text>
            </g>
          );
        })}

        {/* Nodes */}
        {nodes.map(n => {
          const isStart = n.id === startNode;
          const isGoal = n.id === goalNode;
          const isCurrent = n.id === currentNode;
          const inPath = pathSet.has(n.id);
          const inOpen = openSetKeys.has(n.id);
          const inClosed = closedSetKeys.has(n.id);

          let fillColor = '#ffffff';
          let strokeColor = '#64748b';
          let strokeWidth = '2';

          if (isCurrent) {
            fillColor = '#fef08a';
            strokeColor = '#ca8a04';
            strokeWidth = '3.5';
          } else if (inPath) {
            fillColor = '#dcfce7';
            strokeColor = '#16a34a';
            strokeWidth = '3';
          } else if (isStart) {
            fillColor = '#fef3c7';
            strokeColor = '#d97706';
            strokeWidth = '2.5';
          } else if (isGoal) {
            fillColor = '#dbeafe';
            strokeColor = '#2563eb';
            strokeWidth = '2.5';
          } else if (inClosed) {
            fillColor = '#f1f5f9';
            strokeColor = '#94a3b8';
          } else if (inOpen) {
            fillColor = '#e0f2fe';
            strokeColor = '#0284c7';
          }

          return (
            <g
              key={n.id}
              transform={`translate(${n.x}, ${n.y})`}
              onClick={() => onNodeClick && onNodeClick(n.id)}
              style={{ cursor: onNodeClick ? 'pointer' : 'default' }}
            >
              <circle
                r="20"
                fill={fillColor}
                stroke={strokeColor}
                strokeWidth={strokeWidth}
              />
              <text
                textAnchor="middle"
                dominantBaseline="central"
                fill="#0f172a"
                fontSize="11"
                fontWeight="700"
              >
                {n.id}
              </text>

              {/* Sub-label under node */}
              <text
                y="30"
                textAnchor="middle"
                fill="#475569"
                fontSize="9"
                fontWeight="600"
              >
                {isStart ? '★ START' : isGoal ? '🎯 GOAL' : n.label}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}
