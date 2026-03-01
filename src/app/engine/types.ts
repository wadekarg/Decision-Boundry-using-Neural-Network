export interface Point {
  x1: number
  x2: number
  label: 1 | -1
}

export interface PerceptronState {
  w1: number
  w2: number
  bias: number
}

export interface TrainingStep {
  pointIndex: number
  point: Point
  netInput: number
  output: number
  error: number
  w1Before: number
  w2Before: number
  biasBefore: number
  w1After: number
  w2After: number
  biasAfter: number
}

export interface EpochResult {
  epoch: number
  totalError: number
  accuracy: number
  steps: TrainingStep[]
}

export type ActivationType = 'hardLimit' | 'symmetricalHardLimit' | 'linear' | 'tanh'
