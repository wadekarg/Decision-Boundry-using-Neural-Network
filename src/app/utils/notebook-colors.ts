/** Notebook/Sketch themed colors for canvas rendering */

// ── Region coloring (meshgrid) ──
// For hardLimit activation: 1 = positive class, 0 = negative class
// For all others: > 0 = positive, < 0 = negative
export function regionColor(value: number, isHardLimit = false): string {
  const isPositive = isHardLimit ? value > 0.5 : value > 0;

  if (isPositive) {
    const alpha = isHardLimit ? 0.18 : Math.min(0.22, Math.abs(value) * 0.22);
    return `rgba(39, 174, 96, ${alpha})`; // green-ink
  } else {
    const alpha = isHardLimit ? 0.18 : Math.min(0.22, Math.max(Math.abs(value), 0.3) * 0.22);
    return `rgba(192, 57, 43, ${alpha})`; // red-pen
  }
}

// ── Boundary line ──
export const BOUNDARY_COLOR = '#2B5C8A';      // ink-blue
export const BOUNDARY_GLOW = 'rgba(43, 92, 138, 0.3)';

// ── Point colors ──
export function pointFill(label: 1 | -1): string {
  return label === 1 ? '#27AE60' : '#C0392B';
}

export function pointStroke(): string {
  return '#4A4A4A'; // pencil-grey
}

// ── Chart colors ──
export const CHART_ERROR_COLOR = '#C0392B';
export const CHART_ACCURACY_COLOR = '#27AE60';
export const CHART_GRID_COLOR = 'rgba(173, 216, 230, 0.4)';
export const CHART_AXIS_COLOR = '#8B8B8B';

// ── Canvas background ──
export const CANVAS_BG = '#FDF6E3';           // cream
export const GRID_LINE_COLOR = 'rgba(173, 216, 230, 0.3)';
export const AXIS_COLOR = 'rgba(74, 74, 74, 0.3)';
export const AXIS_LABEL_COLOR = 'rgba(74, 74, 74, 0.5)';
export const TICK_LABEL_COLOR = 'rgba(74, 74, 74, 0.4)';
