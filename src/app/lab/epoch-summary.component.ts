import { Component, inject, computed } from '@angular/core';
import { LabStoreService } from '../services/lab-store.service';
import { KatexComponent } from '../shared/katex.component';
import { fmt } from '../utils/math';
import type { TrainingStep } from '../engine/types';

@Component({
  selector: 'app-epoch-summary',
  imports: [KatexComponent],
  template: `
    @if (latestEpoch()) {
      <div class="notebook-panel">
        <div class="detail-box boundary-eq">
          <p class="math-label">Decision Boundary After Epoch {{ latestEpoch()!.epoch }}</p>
          <app-katex [tex]="boundaryEqTex()" />
        </div>

        <div class="point-list">
          <p class="math-label">Points in This Epoch</p>
          @for (s of latestEpoch()!.steps; track $index) {
            <div class="point-row" [class.correct]="isCorrectSide(s)" [class.wrong]="!isCorrectSide(s)">
              <span class="point-idx">#{{ $index + 1 }}</span>
              <span class="point-coords">({{ fmt(s.point.x1) }}, {{ fmt(s.point.x2) }})</span>
              <span class="point-target" [class.text-green]="s.point.label === 1" [class.text-red]="s.point.label === -1">t={{ s.point.label }}</span>
              <span class="point-output">y={{ fmt(s.output) }}</span>
              <span class="point-err" [class.text-red]="hasError(s)">e={{ fmt(s.error) }}</span>
            </div>
          }
        </div>
      </div>
    }
  `,
  styles: [`
    @use 'sass:color';
    @use '../../styles/variables' as *;

    .math-label {
      font-family: 'Inter', sans-serif;
      font-size: 0.6rem;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.08em;
      color: $pencil-light;
      margin-bottom: 0.15rem;
    }

    .detail-box {
      background: $cream;
      border-radius: 8px;
      padding: 0.4rem 0.6rem;
      overflow-x: auto;
    }

    .boundary-eq { border-left: 3px solid $ink-blue; }

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
      &.wrong    { background: rgba($red-pen, 0.06); }
    }

    .point-idx   { color: $pencil-light; width: 1.5rem; flex-shrink: 0; }
    .point-coords { color: $pencil-grey; flex: 1; }
    .point-target { flex-shrink: 0; font-weight: 600; }
    .point-output { color: $pencil-grey; flex-shrink: 0; }
    .point-err    { flex-shrink: 0; }
  `],
})
export class EpochSummaryComponent {
  store = inject(LabStoreService);
  fmt = fmt;

  latestEpoch = computed(() => {
    const h = this.store.trainingHistory();
    return h.length > 0 ? h[h.length - 1] : null;
  });

  boundaryEqTex = computed(() => {
    const ep = this.latestEpoch();
    if (!ep || ep.steps.length === 0) return '';
    const last = ep.steps[ep.steps.length - 1];
    return `${fmt(last.w1After)}x_1 ${this.sign(last.w2After)} ${fmt(Math.abs(last.w2After))}x_2 ${this.sign(last.biasAfter)} ${fmt(Math.abs(last.biasAfter))} = 0`;
  });

  isCorrectSide(step: TrainingStep): boolean {
    const isHL = this.store.activationType() === 'hardLimit';
    const predictedPositive = isHL ? step.output > 0.5 : step.output >= 0;
    return (step.point.label >= 0 && predictedPositive) || (step.point.label < 0 && !predictedPositive);
  }

  hasError(step: TrainingStep): boolean { return Math.abs(step.error) > 1e-10; }

  private sign(n: number): string { return n >= 0 ? '+' : '-'; }
}
