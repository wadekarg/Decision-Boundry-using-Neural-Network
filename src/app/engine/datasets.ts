import type { Point } from './types'

export interface DatasetPreset {
  id: string
  label: string
  points: Point[]
}

/**
 * Generate random linearly separable data.
 * Picks a random line through the origin area, then places points on each side.
 */
export function generateRandomSeparable(count = 16, range = 4.5, margin = 0.4): Point[] {
  const pts: Point[] = [];
  // Random line: a*x1 + b*x2 + c = 0
  const angle = Math.random() * Math.PI;
  const a = Math.cos(angle);
  const b = Math.sin(angle);
  const c = (Math.random() - 0.5) * 2; // small offset

  const half = Math.floor(count / 2);
  let pos = 0, neg = 0;

  // Keep generating until we have enough of each class
  let safety = 0;
  while ((pos < half || neg < half) && safety < 1000) {
    safety++;
    const x1 = (Math.random() * 2 - 1) * range;
    const x2 = (Math.random() * 2 - 1) * range;
    const val = a * x1 + b * x2 + c;

    if (Math.abs(val) < margin) continue; // too close to boundary

    if (val > 0 && pos < half) {
      pts.push({ x1: Math.round(x1 * 10) / 10, x2: Math.round(x2 * 10) / 10, label: 1 });
      pos++;
    } else if (val < 0 && neg < half) {
      pts.push({ x1: Math.round(x1 * 10) / 10, x2: Math.round(x2 * 10) / 10, label: -1 });
      neg++;
    }
  }

  return pts;
}

/**
 * Generate random NOT linearly separable data (XOR-like pattern).
 * Places points in 4 quadrants with alternating labels so no single line can separate them.
 */
export function generateRandomNonSeparable(count = 16, range = 4.5): Point[] {
  const pts: Point[] = [];
  const quarter = Math.floor(count / 4);

  // Quadrant assignments: top-left & bottom-right = +1, top-right & bottom-left = -1
  const quadrants: { xSign: number; ySign: number; label: 1 | -1 }[] = [
    { xSign: -1, ySign: 1, label: 1 },
    { xSign: 1, ySign: -1, label: 1 },
    { xSign: 1, ySign: 1, label: -1 },
    { xSign: -1, ySign: -1, label: -1 },
  ];

  for (const q of quadrants) {
    for (let i = 0; i < quarter; i++) {
      const x1 = q.xSign * (0.5 + Math.random() * (range - 0.5));
      const x2 = q.ySign * (0.5 + Math.random() * (range - 0.5));
      pts.push({
        x1: Math.round(x1 * 10) / 10,
        x2: Math.round(x2 * 10) / 10,
        label: q.label,
      });
    }
  }

  return pts;
}

export const DATASET_PRESETS: DatasetPreset[] = [
  {
    id: 'linearlySeparable',
    label: 'Linearly Separable',
    points: [
      { x1: -3, x2: 4, label: 1 },
      { x1: -2, x2: 3, label: 1 },
      { x1: -1, x2: 5, label: 1 },
      { x1: 0, x2: 3, label: 1 },
      { x1: 1, x2: 4, label: 1 },
      { x1: -4, x2: 1, label: 1 },
      { x1: -3, x2: 2, label: 1 },
      { x1: 2, x2: -1, label: -1 },
      { x1: 3, x2: -2, label: -1 },
      { x1: 4, x2: -3, label: -1 },
      { x1: 1, x2: -2, label: -1 },
      { x1: 3, x2: 0, label: -1 },
      { x1: 5, x2: -1, label: -1 },
      { x1: 4, x2: -4, label: -1 },
    ],
  },
  {
    id: 'xor',
    label: 'XOR',
    points: [
      { x1: -3, x2: -3, label: -1 },
      { x1: -4, x2: -2, label: -1 },
      { x1: -2, x2: -4, label: -1 },
      { x1: 3, x2: 3, label: -1 },
      { x1: 4, x2: 2, label: -1 },
      { x1: 2, x2: 4, label: -1 },
      { x1: -3, x2: 3, label: 1 },
      { x1: -4, x2: 2, label: 1 },
      { x1: -2, x2: 4, label: 1 },
      { x1: 3, x2: -3, label: 1 },
      { x1: 4, x2: -2, label: 1 },
      { x1: 2, x2: -4, label: 1 },
    ],
  },
  {
    id: 'clusters',
    label: 'Clusters',
    points: [
      // Cluster 1 (class +1) centered around (-4, 4)
      { x1: -4, x2: 4, label: 1 },
      { x1: -5, x2: 5, label: 1 },
      { x1: -3, x2: 5, label: 1 },
      { x1: -5, x2: 3, label: 1 },
      { x1: -3, x2: 3, label: 1 },
      { x1: -4, x2: 5, label: 1 },
      { x1: -4, x2: 3, label: 1 },
      // Cluster 2 (class -1) centered around (4, -4)
      { x1: 4, x2: -4, label: -1 },
      { x1: 5, x2: -5, label: -1 },
      { x1: 3, x2: -5, label: -1 },
      { x1: 5, x2: -3, label: -1 },
      { x1: 3, x2: -3, label: -1 },
      { x1: 4, x2: -5, label: -1 },
      { x1: 4, x2: -3, label: -1 },
    ],
  },
  {
    id: 'circular',
    label: 'Circular',
    points: (() => {
      const pts: Point[] = []
      // Inner ring: class +1
      for (let i = 0; i < 8; i++) {
        const angle = (i / 8) * 2 * Math.PI
        pts.push({
          x1: Math.round(2 * Math.cos(angle) * 10) / 10,
          x2: Math.round(2 * Math.sin(angle) * 10) / 10,
          label: 1,
        })
      }
      // Outer ring: class -1
      for (let i = 0; i < 12; i++) {
        const angle = (i / 12) * 2 * Math.PI
        pts.push({
          x1: Math.round(5 * Math.cos(angle) * 10) / 10,
          x2: Math.round(5 * Math.sin(angle) * 10) / 10,
          label: -1,
        })
      }
      return pts
    })(),
  },
]
