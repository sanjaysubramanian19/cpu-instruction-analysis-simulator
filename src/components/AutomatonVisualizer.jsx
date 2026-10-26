import React, { useMemo } from 'react';

export default function AutomatonVisualizer({ automaton, activeStates = [] }) {
  if (!automaton || !automaton.states || automaton.states.length === 0) {
    return (
      <div className="svg-canvas-container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '320px', color: '#94a3b8' }}>
        No automaton generated yet. Enter a regular expression and click "Convert to Automaton".
      </div>
    );
  }

  const { states, transitions, startState, acceptStates } = automaton;

  // Calculate layout coordinates for states
  const layout = useMemo(() => {
    const coords = {};
    const n = states.length;
    const width = 800;
    const height = 340;
    const marginX = 80;
    const stepX = n > 1 ? (width - 2 * marginX) / (n - 1) : 0;

    states.forEach((state, idx) => {
      // Stagger y to prevent overlapping lines for branch states
      let yOffset = 170;
      const num = parseInt(state.replace('q', ''), 10) || idx;
      if (num % 2 === 1) yOffset -= 55;
      else if (num % 3 === 0 && num !== 0) yOffset += 55;

      coords[state] = {
        x: marginX + idx * Math.min(stepX, 110),
        y: yOffset
      };
    });

    return coords;
  }, [states]);

  const activeSet = new Set(activeStates);
  const acceptSet = new Set(acceptStates);

  return (
    <div className="svg-canvas-container">
      <svg className="svg-canvas" viewBox="0 0 850 340">
        <defs>
          {/* Arrow marker for standard transitions */}
          <marker
            id="arrow"
            viewBox="0 0 10 10"
            refX="22"
            refY="5"
            markerWidth="6"
            markerHeight="6"
            orient="auto-start-reverse"
          >
            <path d="M 0 1 L 10 5 L 0 9 z" fill="#64748b" />
          </marker>
          {/* Arrow marker for epsilon transitions */}
          <marker
            id="arrow-eps"
            viewBox="0 0 10 10"
            refX="22"
            refY="5"
            markerWidth="6"
            markerHeight="6"
            orient="auto-start-reverse"
          >
            <path d="M 0 1 L 10 5 L 0 9 z" fill="#0891b2" />
          </marker>
        </defs>

        {/* Start State Indicator Arrow */}
        {layout[startState] && (
          <g>
            <line
              x1={layout[startState].x - 45}
              y1={layout[startState].y}
              x2={layout[startState].x - 22}
              y2={layout[startState].y}
              stroke="#2563eb"
              strokeWidth="2.5"
              markerEnd="url(#arrow)"
            />
            <text
              x={layout[startState].x - 50}
              y={layout[startState].y - 8}
              fill="#2563eb"
              fontSize="11"
              fontWeight="700"
              textAnchor="end"
            >
              Start
            </text>
          </g>
        )}

        {/* Transitions (Curved Arcs) */}
        {transitions.map((t, idx) => {
          const from = layout[t.from];
          const to = layout[t.to];
          if (!from || !to) return null;

          const isEpsilon = t.symbol === 'ε';
          const isSelfLoop = t.from === t.to;
          const isBackward = from.x > to.x;

          let pathD = '';
          let textX = 0;
          let textY = 0;

          if (isSelfLoop) {
            // Self loop arc above node
            pathD = `M ${from.x - 10} ${from.y - 18} C ${from.x - 25} ${from.y - 50}, ${from.x + 25} ${from.y - 50}, ${from.x + 10} ${from.y - 18}`;
            textX = from.x;
            textY = from.y - 45;
          } else if (isBackward) {
            // Backward arc curved below
            const curveHeight = 45;
            pathD = `M ${from.x} ${from.y + 18} Q ${(from.x + to.x) / 2} ${Math.max(from.y, to.y) + curveHeight}, ${to.x} ${to.y + 18}`;
            textX = (from.x + to.x) / 2;
            textY = Math.max(from.y, to.y) + curveHeight - 8;
          } else {
            // Forward curved arc
            const dx = to.x - from.x;
            const curveOffset = dx > 150 ? -35 : -15;
            const midX = (from.x + to.x) / 2;
            const midY = (from.y + to.y) / 2 + curveOffset;
            pathD = `M ${from.x} ${from.y} Q ${midX} ${midY}, ${to.x} ${to.y}`;
            textX = midX;
            textY = midY - 6;
          }

          return (
            <g key={`t-${idx}`}>
              <path
                d={pathD}
                fill="none"
                stroke={isEpsilon ? '#0891b2' : '#64748b'}
                strokeWidth={isEpsilon ? '1.8' : '2'}
                strokeDasharray={isEpsilon ? '4 2' : 'none'}
                markerEnd={isEpsilon ? 'url(#arrow-eps)' : 'url(#arrow)'}
              />
              <rect
                x={textX - 10}
                y={textY - 9}
                width="20"
                height="15"
                rx="3"
                fill="#ffffff"
                stroke={isEpsilon ? '#bae6fd' : '#cbd5e1'}
                strokeWidth="1"
              />
              <text
                x={textX}
                y={textY + 2}
                fill={isEpsilon ? '#0284c7' : '#1e293b'}
                fontSize="11"
                fontWeight="700"
                textAnchor="middle"
                dominantBaseline="central"
              >
                {t.symbol}
              </text>
            </g>
          );
        })}

        {/* Automaton States */}
        {states.map(state => {
          const pt = layout[state];
          if (!pt) return null;
          const isStart = state === startState;
          const isAccept = acceptSet.has(state);
          const isActive = activeSet.has(state);

          return (
            <g key={state} transform={`translate(${pt.x}, ${pt.y})`}>
              {/* Outer circle for accepting state */}
              {isAccept && (
                <circle
                  r="23"
                  fill="none"
                  stroke={isActive ? '#16a34a' : '#0891b2'}
                  strokeWidth="2.5"
                />
              )}

              {/* Main State Circle */}
              <circle
                r="18"
                fill={isActive ? '#bbf7d0' : isAccept ? '#e0f2fe' : isStart ? '#fef3c7' : '#ffffff'}
                stroke={isActive ? '#15803d' : isAccept ? '#0284c7' : isStart ? '#d97706' : '#64748b'}
                strokeWidth={isActive ? '3' : '2'}
              />

              {/* State Label */}
              <text
                textAnchor="middle"
                dominantBaseline="central"
                fill="#0f172a"
                fontSize="11"
                fontWeight="700"
              >
                {state}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}
