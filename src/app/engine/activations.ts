import type { ActivationType } from './types'

export interface ActivationMeta {
  id: ActivationType
  label: string
  formula: string       // KaTeX display formula
  fn: (x: number) => number
}

function hardLimit(x: number): number {
  return x >= 0 ? 1 : 0
}

function symmetricalHardLimit(x: number): number {
  return x >= 0 ? 1 : -1
}

function linear(x: number): number {
  return x
}

function tanhFn(x: number): number {
  return Math.tanh(x)
}

export const ACTIVATIONS: Record<ActivationType, ActivationMeta> = {
  hardLimit: {
    id: 'hardLimit',
    label: 'Hard Limit',
    formula: 'f(n) = \\begin{cases} 1 & n \\geq 0 \\\\ 0 & n < 0 \\end{cases}',
    fn: hardLimit,
  },
  symmetricalHardLimit: {
    id: 'symmetricalHardLimit',
    label: 'Sym. Hard Limit',
    formula: 'f(n) = \\begin{cases} +1 & n \\geq 0 \\\\ -1 & n < 0 \\end{cases}',
    fn: symmetricalHardLimit,
  },
  linear: {
    id: 'linear',
    label: 'Linear',
    formula: 'f(n) = n',
    fn: linear,
  },
  tanh: {
    id: 'tanh',
    label: 'Tanh',
    formula: 'f(n) = \\tanh(n)',
    fn: tanhFn,
  },
}

export const ACTIVATION_LIST: ActivationType[] = ['symmetricalHardLimit', 'hardLimit', 'linear', 'tanh']
