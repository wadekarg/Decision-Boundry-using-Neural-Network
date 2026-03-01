import { Injectable, signal, computed } from '@angular/core';
import type { Point, PerceptronState, TrainingStep, EpochResult, ActivationType } from '../engine/types';
import { ACTIVATIONS } from '../engine/activations';
import { trainStep, forward } from '../engine/perceptron';
import type { ActivationMeta } from '../engine/activations';

/** Evaluate all points against given weights and return accuracy (0-1). */
function batchAccuracy(pts: Point[], state: PerceptronState, activation: ActivationMeta): number {
  if (pts.length === 0) return 0;
  const isHL = activation.id === 'hardLimit';
  let correct = 0;
  for (const p of pts) {
    const output = forward(state, p.x1, p.x2, activation);
    const predictedPositive = isHL ? output > 0.5 : output >= 0;
    if ((p.label >= 0 && predictedPositive) || (p.label < 0 && !predictedPositive)) {
      correct++;
    }
  }
  return correct / pts.length;
}

export type LabStatus = 'idle' | 'running' | 'paused' | 'done';

function randomWeight(): number {
  return Math.round((Math.random() * 2 - 1) * 100) / 100; // random in [-1, 1], 2 decimal places
}

function randomWeights(): PerceptronState {
  return { w1: randomWeight(), w2: randomWeight(), bias: randomWeight() };
}

@Injectable({ providedIn: 'root' })
export class LabStoreService {
  // ── Data ──
  readonly points = signal<Point[]>([]);

  // ── Perceptron state ──
  readonly w1 = signal(randomWeight());
  readonly w2 = signal(randomWeight());
  readonly bias = signal(randomWeight());

  // ── Activation ──
  readonly activationType = signal<ActivationType>('symmetricalHardLimit');

  // ── Learning rate ──
  readonly learningRate = signal(0.1);

  // ── Training ──
  readonly status = signal<LabStatus>('idle');
  readonly speed = signal(200);
  readonly maxEpochs = signal(100);
  readonly currentEpoch = signal(0);
  readonly currentStepInEpoch = signal(0);
  readonly trainingHistory = signal<EpochResult[]>([]);
  readonly allSteps = signal<TrainingStep[]>([]);

  // ── Derived ──
  readonly perceptronState = computed<PerceptronState>(() => ({
    w1: this.w1(),
    w2: this.w2(),
    bias: this.bias(),
  }));

  readonly activation = computed(() => ACTIVATIONS[this.activationType()]);

  // ── Mutations ──

  addPoint(p: Point): void {
    this.points.update(pts => [...pts, p]);
  }

  setPoints(pts: Point[]): void {
    this.points.set(pts);
  }

  clearPoints(): void {
    this.points.set([]);
    this.trainingHistory.set([]);
    this.allSteps.set([]);
    this.currentEpoch.set(0);
    this.currentStepInEpoch.set(0);
    this.status.set('idle');
  }

  stepOnce(): void {
    const pts = this.points();
    if (pts.length === 0) return;

    const activation = this.activation();
    const idx = this.currentStepInEpoch() % pts.length;
    const state = this.perceptronState();
    const { newState, step } = trainStep(state, pts[idx], idx, activation, this.learningRate());

    const newStepInEpoch = this.currentStepInEpoch() + 1;
    const newAllSteps = [...this.allSteps(), step];

    this.w1.set(newState.w1);
    this.w2.set(newState.w2);
    this.bias.set(newState.bias);
    this.allSteps.set(newAllSteps);

    if (newStepInEpoch >= pts.length) {
      const epochSteps = newAllSteps.slice(-pts.length);
      let totalError = 0;
      for (const es of epochSteps) {
        totalError += Math.abs(es.error);
      }
      const accuracy = batchAccuracy(pts, newState, activation);
      const newEpochNum = this.currentEpoch() + 1;
      const done = newEpochNum >= this.maxEpochs();

      this.currentStepInEpoch.set(0);
      this.currentEpoch.set(newEpochNum);
      this.trainingHistory.update(h => [...h, {
        epoch: newEpochNum,
        totalError,
        accuracy,
        steps: epochSteps,
      }]);
      if (done) this.status.set('done');
    } else {
      this.currentStepInEpoch.set(newStepInEpoch);
    }
  }

  /** Run one full epoch. Returns true if training should continue. */
  runEpoch(): boolean {
    const pts = this.points();
    if (pts.length === 0) return false;

    const activation = this.activation();
    let state = this.perceptronState();
    const epochSteps: TrainingStep[] = [];

    for (let i = 0; i < pts.length; i++) {
      const { newState, step } = trainStep(state, pts[i], i, activation, this.learningRate());
      state = newState;
      epochSteps.push(step);
    }

    let totalError = 0;
    for (const es of epochSteps) {
      totalError += Math.abs(es.error);
    }
    const accuracy = batchAccuracy(pts, state, activation);
    const newEpochNum = this.currentEpoch() + 1;
    const done = newEpochNum >= this.maxEpochs();

    this.w1.set(state.w1);
    this.w2.set(state.w2);
    this.bias.set(state.bias);
    this.currentStepInEpoch.set(0);
    this.currentEpoch.set(newEpochNum);
    this.allSteps.update(s => [...s, ...epochSteps]);
    this.trainingHistory.update(h => [...h, {
      epoch: newEpochNum,
      totalError,
      accuracy,
      steps: epochSteps,
    }]);
    if (done) this.status.set('done');

    return !done;
  }

  play(): void {
    this.status.set('running');
  }

  pause(): void {
    this.status.set('paused');
  }

  reset(): void {
    const rw = randomWeights();
    this.w1.set(rw.w1);
    this.w2.set(rw.w2);
    this.bias.set(rw.bias);
    this.status.set('idle');
    this.currentEpoch.set(0);
    this.currentStepInEpoch.set(0);
    this.trainingHistory.set([]);
    this.allSteps.set([]);
  }
}
