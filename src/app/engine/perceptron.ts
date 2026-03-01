import type { Point, PerceptronState, TrainingStep } from './types'
import type { ActivationMeta } from './activations'

/** Compute net input: w1*x1 + w2*x2 + bias */
export function netInput(state: PerceptronState, x1: number, x2: number): number {
  return state.w1 * x1 + state.w2 * x2 + state.bias
}

/** Forward pass: compute output for a single point */
export function forward(state: PerceptronState, x1: number, x2: number, activation: ActivationMeta): number {
  return activation.fn(netInput(state, x1, x2))
}

/** Train one step on a single point. Returns the step info and new state. */
export function trainStep(
  state: PerceptronState,
  point: Point,
  pointIndex: number,
  activation: ActivationMeta,
  learningRate: number
): { newState: PerceptronState; step: TrainingStep } {
  const net = netInput(state, point.x1, point.x2)
  const output = activation.fn(net)
  // For hardLimit (output {0,1}), map target from {-1,+1} to {0,1} so error=0 when correct
  const target = activation.id === 'hardLimit' ? (point.label === 1 ? 1 : 0) : point.label
  const error = target - output

  const w1After = state.w1 + learningRate * error * point.x1
  const w2After = state.w2 + learningRate * error * point.x2
  const biasAfter = state.bias + learningRate * error

  return {
    newState: { w1: w1After, w2: w2After, bias: biasAfter },
    step: {
      pointIndex,
      point,
      netInput: net,
      output,
      error,
      w1Before: state.w1,
      w2Before: state.w2,
      biasBefore: state.bias,
      w1After,
      w2After,
      biasAfter,
    },
  }
}

/** Compute boundary line endpoints for the current weights.
 *  Returns two points [x1, x2] for drawing, or null if degenerate. */
export function computeBoundaryLine(
  state: PerceptronState,
  xMin: number,
  xMax: number
): { x1Start: number; x2Start: number; x1End: number; x2End: number } | null {
  const { w1, w2, bias } = state

  // Boundary: w1*x1 + w2*x2 + bias = 0
  if (Math.abs(w2) > 1e-10) {
    // x2 = -(w1*x1 + bias) / w2
    const x2AtXMin = -(w1 * xMin + bias) / w2
    const x2AtXMax = -(w1 * xMax + bias) / w2
    return { x1Start: xMin, x2Start: x2AtXMin, x1End: xMax, x2End: x2AtXMax }
  }

  if (Math.abs(w1) > 1e-10) {
    // Vertical line: x1 = -bias / w1
    const x1Val = -bias / w1
    return { x1Start: x1Val, x2Start: xMin, x1End: x1Val, x2End: xMax }
  }

  // Both zero: no boundary
  return null
}
