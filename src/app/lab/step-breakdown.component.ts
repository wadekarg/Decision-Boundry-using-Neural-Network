import { Component, inject, signal, effect, computed } from '@angular/core';
import { LabStoreService } from '../services/lab-store.service';
import { KatexComponent } from '../shared/katex.component';
import { fmt } from '../utils/math';
import type { TrainingStep, EpochResult } from '../engine/types';

@Component({
  selector: 'app-step-breakdown',
  imports: [KatexComponent],
  template: `
    <div class="notebook-panel">
      @if (store.allSteps().length === 0) {
        <h3 class="section-label">Training Breakdown</h3>
        <p class="empty-msg">No training steps yet. Add data points and click Step or Play.</p>
      } @else {
        <!-- Tabs -->
        <div class="tab-row">
          <button class="tab-btn" [class.active]="tab() === 'epoch'" (click)="tab.set('epoch')">By Epoch</button>
          <button class="tab-btn" [class.active]="tab() === 'step'" (click)="tab.set('step')">By Step</button>
        </div>

        <!-- ════════ EPOCH TAB ════════ -->
        @if (tab() === 'epoch') {
          <div class="header-row">
            <h3 class="section-label">Epoch Breakdown</h3>
            <span class="step-counter">Epoch {{ epochIdx() + 1 }} / {{ store.trainingHistory().length }}</span>
          </div>

          <div class="step-nav">
            <button class="btn btn-sm" (click)="prevEpoch()" [disabled]="epochIdx() === 0">&larr;</button>
            <input type="range" [min]="0" [max]="store.trainingHistory().length - 1"
                   [value]="epochIdx()"
                   (input)="epochIdx.set(toNum($event))" />
            <button class="btn btn-sm" (click)="nextEpoch()" [disabled]="epochIdx() >= store.trainingHistory().length - 1">&rarr;</button>
          </div>

          @if (currentEpoch(); as ep) {
            <!-- Summary stats -->
            <div class="epoch-stats">
              <div class="stat-item">
                <span class="stat-label">Total Error</span>
                <span class="stat-value text-red">{{ fmt(ep.totalError) }}</span>
              </div>
              <div class="stat-item">
                <span class="stat-label">Accuracy</span>
                <span class="stat-value text-green">{{ (ep.accuracy * 100).toFixed(2) }}%</span>
              </div>
              <div class="stat-item">
                <span class="stat-label">Points</span>
                <span class="stat-value">{{ ep.steps.length }}</span>
              </div>
              <div class="stat-item">
                <span class="stat-label">Misclassified</span>
                <span class="stat-value">{{ misclassifiedCount(ep) }}</span>
              </div>
            </div>

            <!-- Weights at start and end of epoch -->
            <table class="weight-table">
              <thead>
                <tr>
                  <th></th>
                  <th>Start of Epoch</th>
                  <th>End of Epoch</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>w1</td>
                  <td>{{ fmt(ep.steps[0].w1Before) }}</td>
                  <td>{{ fmt(ep.steps[ep.steps.length - 1].w1After) }}</td>
                </tr>
                <tr>
                  <td>w2</td>
                  <td>{{ fmt(ep.steps[0].w2Before) }}</td>
                  <td>{{ fmt(ep.steps[ep.steps.length - 1].w2After) }}</td>
                </tr>
                <tr>
                  <td>bias</td>
                  <td>{{ fmt(ep.steps[0].biasBefore) }}</td>
                  <td>{{ fmt(ep.steps[ep.steps.length - 1].biasAfter) }}</td>
                </tr>
              </tbody>
            </table>

          }
        }

        <!-- ════════ STEP TAB ════════ -->
        @if (tab() === 'step') {
          <div class="header-row">
            <h3 class="section-label">Step Breakdown</h3>
            <span class="step-counter">Step {{ stepIdx() + 1 }} / {{ store.allSteps().length }} &middot; Epoch {{ epochOfStep(stepIdx()) }}</span>
          </div>

          <div class="step-nav">
            <button class="btn btn-sm" (click)="prev()" [disabled]="stepIdx() === 0">&larr;</button>
            <input type="range" [min]="0" [max]="store.allSteps().length - 1"
                   [value]="stepIdx()"
                   (input)="stepIdx.set(toNum($event))" />
            <button class="btn btn-sm" (click)="next()" [disabled]="stepIdx() >= store.allSteps().length - 1">&rarr;</button>
          </div>

          @if (currentStep(); as step) {
            <div class="detail-box">
              <p class="detail-text">
                Point ({{ fmt(step.point.x1) }}, {{ fmt(step.point.x2) }}), target =
                <span [class]="step.point.label === 1 ? 'text-green' : 'text-red'" style="font-weight:700">{{ step.point.label }}</span>
              </p>
            </div>

            <div class="detail-box">
              <p class="math-label">Net Input</p>
              <app-katex [tex]="netInputTex(step)" />
            </div>

            <div class="detail-box">
              <p class="math-label">Output & Error</p>
              <app-katex [tex]="outputTex(step)" />
              <app-katex [tex]="errorTex(step)" />
            </div>

            @if (hasError(step)) {
              <div class="detail-box">
                <p class="math-label">Weight Update</p>
                <app-katex [tex]="w1UpdateTex(step)" />
                <app-katex [tex]="w2UpdateTex(step)" />
                <app-katex [tex]="biasUpdateTex(step)" />
              </div>
            }

            <table class="weight-table">
              <thead>
                <tr><th></th><th>Before</th><th>After</th></tr>
              </thead>
              <tbody>
                <tr><td>w1</td><td>{{ fmt(step.w1Before) }}</td><td>{{ fmt(step.w1After) }}</td></tr>
                <tr><td>w2</td><td>{{ fmt(step.w2Before) }}</td><td>{{ fmt(step.w2After) }}</td></tr>
                <tr><td>bias</td><td>{{ fmt(step.biasBefore) }}</td><td>{{ fmt(step.biasAfter) }}</td></tr>
              </tbody>
            </table>

            <div class="detail-box boundary-eq">
              <p class="math-label">Decision Boundary After This Step</p>
              <app-katex [tex]="boundaryEqTex(step)" />
            </div>

            <p class="narrative">
              @if (!hasError(step)) {
                Correctly classified — no weight update needed.
              } @else {
                Misclassified (error = {{ fmt(step.error) }}). Weights adjusted toward the correct classification.
              }
            </p>
          }
        }
      }
    </div>
  `,
  styles: [`
    @use 'sass:color';
    @use '../../styles/variables' as *;

    .tab-row {
      display: flex;
      gap: 0;
      margin-bottom: 0.5rem;
      border-bottom: 2px solid color.adjust($cream-dark, $lightness: -8%);
    }

    .tab-btn {
      font-family: 'Patrick Hand', cursive;
      font-size: 0.9rem;
      padding: 0.35rem 0.75rem;
      background: none;
      border: none;
      color: $pencil-light;
      cursor: pointer;
      border-bottom: 2px solid transparent;
      margin-bottom: -2px;
      transition: all 0.15s ease;

      &:hover { color: $pencil-grey; }
      &.active {
        color: $ink-blue;
        border-bottom-color: $ink-blue;
        font-weight: 700;
      }
    }

    .header-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .step-counter {
      font-family: 'JetBrains Mono', monospace;
      font-size: 0.7rem;
      color: $pencil-light;
    }

    .step-nav {
      display: flex;
      align-items: center;
      gap: 0.4rem;
      margin: 0.5rem 0;
    }

    .step-nav input[type="range"] { flex: 1; }

    .empty-msg {
      font-family: 'Patrick Hand', cursive;
      font-size: 0.9rem;
      color: $pencil-light;
      margin-top: 0.5rem;
    }

    .detail-box {
      background: $cream;
      border-radius: 8px;
      padding: 0.4rem 0.6rem;
      margin-top: 0.5rem;
      overflow-x: auto;
    }

    .detail-text {
      font-family: 'Patrick Hand', cursive;
      font-size: 0.85rem;
      color: $pencil-grey;
    }

    .math-label {
      font-family: 'Inter', sans-serif;
      font-size: 0.6rem;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.08em;
      color: $pencil-light;
      margin-bottom: 0.15rem;
    }

    .weight-table {
      width: 100%;
      margin-top: 0.5rem;
      font-family: 'JetBrains Mono', monospace;
      font-size: 0.75rem;
      border-collapse: collapse;

      th {
        text-align: right;
        padding: 0.2rem 0.5rem;
        font-weight: 500;
        color: $pencil-light;
        font-size: 0.65rem;
      }
      th:first-child { text-align: left; }
      td {
        text-align: right;
        padding: 0.2rem 0.5rem;
        border-top: 1px dashed rgba($pencil-light, 0.2);
        color: $pencil-grey;
      }
      td:first-child { text-align: left; color: $pencil-light; }
    }

    .boundary-eq { border-left: 3px solid $ink-blue; }

    .narrative {
      font-family: 'Patrick Hand', cursive;
      font-size: 0.8rem;
      color: $pencil-light;
      margin-top: 0.5rem;
      line-height: 1.5;
    }

    /* ── Epoch tab styles ── */
    .epoch-stats {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 0.4rem;
      margin-top: 0.5rem;
    }

    .stat-item {
      background: $cream;
      border-radius: 8px;
      padding: 0.35rem 0.5rem;
      display: flex;
      flex-direction: column;
    }

    .stat-label {
      font-family: 'Inter', sans-serif;
      font-size: 0.55rem;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.08em;
      color: $pencil-light;
    }

    .stat-value {
      font-family: 'JetBrains Mono', monospace;
      font-size: 1rem;
      font-weight: 500;
      color: $pencil-grey;
    }

    .point-list {
      margin-top: 0.5rem;
      max-height: 200px;
      overflow-y: auto;
    }

    .point-row {
      display: flex;
      gap: 0.4rem;
      align-items: center;
      padding: 0.2rem 0.4rem;
      font-family: 'JetBrains Mono', monospace;
      font-size: 0.7rem;
      border-radius: 4px;

      &.correct { background: rgba($green-ink, 0.06); }
      &.wrong { background: rgba($red-pen, 0.06); }
    }

    .point-idx {
      color: $pencil-light;
      width: 1.5rem;
      flex-shrink: 0;
    }

    .point-coords { color: $pencil-grey; flex: 1; }
    .point-target { flex-shrink: 0; font-weight: 600; }
    .point-output { color: $pencil-grey; flex-shrink: 0; }
    .point-err { flex-shrink: 0; }
  `],
})
export class StepBreakdownComponent {
  store = inject(LabStoreService);
  fmt = fmt;

  tab = signal<'epoch' | 'step'>('epoch');
  stepIdx = signal(0);
  epochIdx = signal(0);

  constructor() {
    // Auto-advance to latest step/epoch when new data arrives
    effect(() => {
      const len = this.store.allSteps().length;
      if (len > 0) this.stepIdx.set(len - 1);
    });

    effect(() => {
      const len = this.store.trainingHistory().length;
      if (len > 0) this.epochIdx.set(len - 1);
    });

    // Sync store weights to the selected view so canvas updates
    // Only when training is NOT running — otherwise let the training loop manage weights
    effect(() => {
      const status = this.store.status();
      if (status === 'running') return;

      const activeTab = this.tab();
      const steps = this.store.allSteps();
      const history = this.store.trainingHistory();
      if (steps.length === 0) return;

      if (activeTab === 'step') {
        const step = steps[this.stepIdx()];
        if (!step) return;
        this.store.w1.set(step.w1Before);
        this.store.w2.set(step.w2Before);
        this.store.bias.set(step.biasBefore);
      } else {
        const ep = history[this.epochIdx()];
        if (!ep || ep.steps.length === 0) return;
        const firstStep = ep.steps[0];
        this.store.w1.set(firstStep.w1Before);
        this.store.w2.set(firstStep.w2Before);
        this.store.bias.set(firstStep.biasBefore);
      }
    });
  }

  // ── Epoch tab ──
  currentEpoch = (): EpochResult | undefined => {
    return this.store.trainingHistory()[this.epochIdx()];
  };

  prevEpoch(): void { this.epochIdx.update(i => Math.max(0, i - 1)); }
  nextEpoch(): void { this.epochIdx.update(i => Math.min(this.store.trainingHistory().length - 1, i + 1)); }

  misclassifiedCount(ep: EpochResult): number {
    return ep.steps.filter(s => !this.isCorrectSide(s)).length;
  }

  epochBoundaryEqTex(ep: EpochResult): string {
    const last = ep.steps[ep.steps.length - 1];
    return `${fmt(last.w1After)}x_1 ${this.sign(last.w2After)} ${fmt(Math.abs(last.w2After))}x_2 ${this.sign(last.biasAfter)} ${fmt(Math.abs(last.biasAfter))} = 0`;
  }

  // ── Step tab ──
  currentStep = (): TrainingStep | undefined => {
    return this.store.allSteps()[this.stepIdx()];
  };

  prev(): void { this.stepIdx.update(i => Math.max(0, i - 1)); }
  next(): void { this.stepIdx.update(i => Math.min(this.store.allSteps().length - 1, i + 1)); }

  // ── Shared ──
  toNum(event: Event): number { return Number((event.target as HTMLInputElement).value); }
  hasError(step: TrainingStep): boolean { return Math.abs(step.error) > 1e-10; }

  isCorrectSide(step: TrainingStep): boolean {
    const isHL = this.store.activationType() === 'hardLimit';
    const predictedPositive = isHL ? step.output > 0.5 : step.output >= 0;
    return (step.point.label >= 0 && predictedPositive) || (step.point.label < 0 && !predictedPositive);
  }
  private sign(n: number): string { return n >= 0 ? '+' : '-'; }

  epochOfStep(idx: number): number {
    const pts = this.store.points();
    if (pts.length === 0) return 1;
    return Math.floor(idx / pts.length) + 1;
  }

  netInputTex(step: TrainingStep): string {
    return `n = (${fmt(step.w1Before)}) \\cdot (${fmt(step.point.x1)}) + (${fmt(step.w2Before)}) \\cdot (${fmt(step.point.x2)}) + (${fmt(step.biasBefore)}) = ${fmt(step.netInput)}`;
  }

  outputTex(step: TrainingStep): string {
    return `\\hat{y} = f(${fmt(step.netInput)}) = ${fmt(step.output)}`;
  }

  errorTex(step: TrainingStep): string {
    return `e = t - \\hat{y} = ${step.point.label} - ${fmt(step.output)} = ${fmt(step.error)}`;
  }

  w1UpdateTex(step: TrainingStep): string {
    const lr = this.store.learningRate();
    return `w_1' = ${fmt(step.w1Before)} + ${fmt(lr)} \\cdot ${fmt(step.error)} \\cdot ${fmt(step.point.x1)} = ${fmt(step.w1After)}`;
  }

  w2UpdateTex(step: TrainingStep): string {
    const lr = this.store.learningRate();
    return `w_2' = ${fmt(step.w2Before)} + ${fmt(lr)} \\cdot ${fmt(step.error)} \\cdot ${fmt(step.point.x2)} = ${fmt(step.w2After)}`;
  }

  biasUpdateTex(step: TrainingStep): string {
    const lr = this.store.learningRate();
    return `b' = ${fmt(step.biasBefore)} + ${fmt(lr)} \\cdot ${fmt(step.error)} = ${fmt(step.biasAfter)}`;
  }

  boundaryEqTex(step: TrainingStep): string {
    const w1 = step.w1After;
    const w2 = step.w2After;
    const b = step.biasAfter;
    return `${fmt(w1)}x_1 ${this.sign(w2)} ${fmt(Math.abs(w2))}x_2 ${this.sign(b)} ${fmt(Math.abs(b))} = 0`;
  }
}
