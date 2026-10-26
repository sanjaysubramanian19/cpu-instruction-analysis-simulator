/**
 * Formatting Utilities for Academic Display
 */

export function formatNumber(val, decimals = 2) {
  if (val === undefined || val === null || isNaN(val)) return '—';
  if (val === Infinity) return '∞';
  return Number(val).toFixed(decimals);
}

export function formatPercent(val) {
  if (val === undefined || val === null || isNaN(val)) return '—%';
  return `${Number(val).toFixed(1)}%`;
}

export function getStageColor(stage) {
  switch (stage) {
    case 'IF':
      return 'bg-blue-100 text-blue-800 border-blue-300';
    case 'ID':
      return 'bg-amber-100 text-amber-800 border-amber-300';
    case 'EX':
      return 'bg-emerald-100 text-emerald-800 border-emerald-300';
    case 'MEM':
      return 'bg-purple-100 text-purple-800 border-purple-300';
    case 'WB':
      return 'bg-rose-100 text-rose-800 border-rose-300';
    case 'STALL':
      return 'bg-red-200 text-red-900 border-red-400 font-bold';
    case 'FLUSH':
      return 'bg-gray-200 text-gray-700 border-gray-400 italic';
    default:
      return 'bg-transparent text-gray-400';
  }
}

export function getSubjectColor(subject) {
  switch (subject) {
    case 'COA':
      return {
        badge: 'bg-indigo-100 text-indigo-800 border-indigo-200',
        border: 'border-indigo-500',
        text: 'text-indigo-600',
        bgLight: 'bg-indigo-50'
      };
    case 'AI/ML':
      return {
        badge: 'bg-emerald-100 text-emerald-800 border-emerald-200',
        border: 'border-emerald-500',
        text: 'text-emerald-600',
        bgLight: 'bg-emerald-50'
      };
    case 'DAA':
      return {
        badge: 'bg-amber-100 text-amber-800 border-amber-200',
        border: 'border-amber-500',
        text: 'text-amber-600',
        bgLight: 'bg-amber-50'
      };
    case 'FLAT':
      return {
        badge: 'bg-cyan-100 text-cyan-800 border-cyan-200',
        border: 'border-cyan-500',
        text: 'text-cyan-600',
        bgLight: 'bg-cyan-50'
      };
    default:
      return {
        badge: 'bg-gray-100 text-gray-800 border-gray-200',
        border: 'border-gray-500',
        text: 'text-gray-600',
        bgLight: 'bg-gray-50'
      };
  }
}
