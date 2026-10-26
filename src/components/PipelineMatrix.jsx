import React from 'react';

export default function PipelineMatrix({ matrix = [], currentCycle = 0, totalCycles = 0 }) {
  if (!matrix || matrix.length === 0 || totalCycles === 0) {
    return (
      <div style={{ padding: '2rem', textAlign: 'center', color: '#94a3b8' }}>
        No pipeline execution data available. Click "Start" or "Next Cycle".
      </div>
    );
  }

  // Create array of cycle numbers 1..totalCycles
  const cycleNumbers = Array.from({ length: totalCycles }, (_, i) => i + 1);

  const getCellClass = (stage) => {
    switch (stage) {
      case 'IF': return 'stage-if';
      case 'ID': return 'stage-id';
      case 'EX': return 'stage-ex';
      case 'MEM': return 'stage-mem';
      case 'WB': return 'stage-wb';
      case 'STALL': return 'stage-stall';
      case 'FLUSH': return 'stage-flush';
      default: return '';
    }
  };

  return (
    <div className="matrix-container">
      <table className="pipeline-grid">
        <thead>
          <tr>
            <th style={{ textAlign: 'left', minWidth: '120px' }}>Instruction</th>
            {cycleNumbers.map(c => (
              <th
                key={c}
                style={{
                  background: c === currentCycle ? '#3b82f6' : '#f1f5f9',
                  color: c === currentCycle ? '#ffffff' : '#334155',
                  transition: 'background 0.15s ease'
                }}
              >
                C{c}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {matrix.map((row) => (
            <tr key={row.instruction.id}>
              <td style={{ fontWeight: 600, background: '#f8fafc', whiteSpace: 'nowrap' }}>
                <span style={{ color: '#4f46e5' }}>{row.instruction.id}:</span> {row.instruction.raw}
              </td>
              {cycleNumbers.map((c, colIdx) => {
                const stage = row.stages[colIdx] || '';
                const isCurrentActive = c === currentCycle && stage !== '' && stage !== 'STALL';
                return (
                  <td
                    key={c}
                    className={getCellClass(stage)}
                    style={{
                      outline: isCurrentActive ? '2px solid #2563eb' : 'none',
                      opacity: c > currentCycle && currentCycle > 0 ? 0.35 : 1.0,
                      transition: 'opacity 0.2s ease'
                    }}
                  >
                    {stage}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
