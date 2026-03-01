import type { PerceptronState } from './types'
import type { ActivationMeta } from './activations'
import { forward } from './perceptron'

export interface MeshgridResult {
  /** Grid resolution (N x N) */
  resolution: number
  /** Flat array of output values, row-major, length = resolution^2 */
  values: Float64Array
  xMin: number
  xMax: number
  yMin: number
  yMax: number
}

/** Evaluate the perceptron on a grid for region coloring */
export function computeMeshgrid(
  state: PerceptronState,
  activation: ActivationMeta,
  resolution: number = 50,
  xMin: number = -10,
  xMax: number = 10,
  yMin: number = -10,
  yMax: number = 10
): MeshgridResult {
  const values = new Float64Array(resolution * resolution)
  const dx = (xMax - xMin) / (resolution - 1)
  const dy = (yMax - yMin) / (resolution - 1)

  for (let row = 0; row < resolution; row++) {
    const x2 = yMax - row * dy // top to bottom
    for (let col = 0; col < resolution; col++) {
      const x1 = xMin + col * dx
      values[row * resolution + col] = forward(state, x1, x2, activation)
    }
  }

  return { resolution, values, xMin, xMax, yMin, yMax }
}
