/** Clamp value between min and max */
export function clamp(val: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, val))
}

/** Dot product of two 2D vectors */
export function dot(a: [number, number], b: [number, number]): number {
  return a[0] * b[0] + a[1] * b[1]
}

/** Sign function: returns 1, -1, or 0 */
export function sign(x: number): number {
  if (x > 0) return 1
  if (x < 0) return -1
  return 0
}

/** Format a number for display (2 decimal places, handles -0) */
export function fmt(n: number, decimals: number = 2): string {
  const val = Math.abs(n) < 1e-10 ? 0 : n
  return val.toFixed(decimals)
}
