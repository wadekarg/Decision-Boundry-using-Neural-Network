import { Component, signal, effect, viewChild, ElementRef, computed } from '@angular/core';
import { AccordionComponent } from '../shared/accordion.component';
import { CalloutComponent } from '../shared/callout.component';
import { KatexComponent } from '../shared/katex.component';
import { ChapterNavComponent } from '../shared/chapter-nav.component';
import { SimButtonComponent } from '../shared/sim-button.component';
import { ACTIVATIONS } from '../engine/activations';
import { trainStep, computeBoundaryLine, forward } from '../engine/perceptron';
import { regionColor, BOUNDARY_COLOR, BOUNDARY_GLOW, pointFill, pointStroke, AXIS_COLOR } from '../utils/notebook-colors';
import { fmt } from '../utils/math';
import type { Point, PerceptronState } from '../engine/types';
import rough from 'roughjs';

const XOR_POINTS: Point[] = [
  { x1: -3, x2: -3, label: -1 },
  { x1: 3, x2: 3, label: -1 },
  { x1: -3, x2: 3, label: 1 },
  { x1: 3, x2: -3, label: 1 },
];

@Component({
  selector: 'app-chapter4',
  imports: [AccordionComponent, CalloutComponent, KatexComponent, ChapterNavComponent, SimButtonComponent],
  template: `
    <div class="container-md learn-chapter">
      <div class="ch-header">
        <a href="#/learn" class="back-link">&larr; All Chapters</a>
        <p class="section-label">Chapter 4</p>
        <h1>The Perceptron Learning Rule</h1>
        <p class="ch-subtitle font-body">
          How does a perceptron learn? By adjusting its weights after each mistake. The learning rule
          is simple, elegant, and provably convergent for linearly separable data.
        </p>
      </div>

      <div class="sections">
        <!-- SECTION 1 -->
        <app-accordion [number]="1" title="The Update Rule" [defaultOpen]="true">
          <p class="font-body">For each training point, the perceptron:</p>
          <div class="notebook-panel" style="margin:0.75rem 0">
            <p class="font-body">1. Computes the output: <app-katex tex="\\hat{y} = f(w_1 x_1 + w_2 x_2 + b)" [inline]="true" /></p>
            <p class="font-body">2. Calculates the error: <app-katex tex="e = t - \\hat{y}" [inline]="true" /> (target minus output)</p>
            <p class="font-body">3. Updates the weights:</p>
          </div>
          <app-katex tex="w_1^{\\text{new}} = w_1^{\\text{old}} + \\eta \\cdot e \\cdot x_1" />
          <app-katex tex="w_2^{\\text{new}} = w_2^{\\text{old}} + \\eta \\cdot e \\cdot x_2" />
          <app-katex tex="b^{\\text{new}} = b^{\\text{old}} + \\eta \\cdot e" />
          <p class="font-body">
            Where <app-katex tex="\\eta" [inline]="true" /> (eta) is the <strong>learning rate</strong> — a small
            positive number that controls how much the weights change per step.
          </p>
          <app-callout type="insight">
            The update rule is beautifully simple: <strong>if the output is correct, do nothing</strong>
            (error = 0). If wrong, nudge the weights toward the correct answer.
          </app-callout>
        </app-accordion>

        <!-- SECTION 2 -->
        <app-accordion [number]="2" title="Why This Works: Intuition">
          <p class="font-body">Consider what happens when the perceptron misclassifies a point:</p>
          <div class="two-col-sm">
            <div class="info-card green">
              <h3>Should be +1, got -1</h3>
              <p>Error = +2. The update <strong>adds</strong> the input to the weights, pushing the boundary to include this point on the +1 side.</p>
            </div>
            <div class="info-card red">
              <h3>Should be -1, got +1</h3>
              <p>Error = -2. The update <strong>subtracts</strong> the input from the weights, pushing the boundary to put this point on the -1 side.</p>
            </div>
          </div>
          <app-callout type="think">
            The learning rate <app-katex tex="\\eta" [inline]="true" /> controls the step size. Too large and the
            weights oscillate. Too small and learning is slow. For hard limit activations, 1.0 works fine.
            For continuous activations like tanh, smaller values (0.01-0.1) are needed.
          </app-callout>
        </app-accordion>

        <!-- SECTION 3 -->
        <app-accordion [number]="3" title="The Convergence Theorem">
          <div class="theorem-box notebook-card">
            <h4 class="text-ink">Perceptron Convergence Theorem</h4>
            <p class="font-body">
              If the training data is <strong>linearly separable</strong>, the perceptron learning rule
              is <strong>guaranteed to converge</strong> to a set of weights that correctly classifies
              all training points in a finite number of steps.
            </p>
          </div>
          <p class="font-body">This means:</p>
          <ul class="font-body var-list">
            <li>If a solution exists, the perceptron will find <em>one</em></li>
            <li>Training will eventually stop — total error will reach zero</li>
            <li>This works regardless of initial weights or learning rate</li>
          </ul>
          <app-callout type="insight">
            The theorem has a crucial condition: data must be linearly separable. If it's not,
            the perceptron will oscillate forever. This is exactly what happens with XOR.
          </app-callout>
        </app-accordion>

        <!-- SECTION 4 -->
        <app-accordion [number]="4" title="The XOR Problem">
          <p class="font-body">
            XOR (exclusive or) is the classic example of a problem a single perceptron <strong>cannot solve</strong>.
          </p>
          <table class="xor-table">
            <thead>
              <tr><th>x1</th><th>x2</th><th>Target</th></tr>
            </thead>
            <tbody>
              <tr><td>-1</td><td>-1</td><td class="text-red">-1</td></tr>
              <tr><td>-1</td><td>+1</td><td class="text-green">+1</td></tr>
              <tr><td>+1</td><td>-1</td><td class="text-green">+1</td></tr>
              <tr><td>+1</td><td>+1</td><td class="text-red">-1</td></tr>
            </tbody>
          </table>

          <!-- XOR Demo Widget -->
          <div class="widget notebook-card">
            <h4 class="section-label">Interactive: XOR Problem Demo</h4>
            <div class="xor-layout">
              <div class="xor-canvas-wrap">
                <canvas #xorNativeCanvas [width]="250" [height]="250" class="xor-native"></canvas>
                <canvas #xorRoughCanvas [width]="250" [height]="250" class="xor-rough"></canvas>
              </div>
              <div class="xor-controls">
                <p class="font-body text-muted" style="font-size:0.85rem">
                  Watch the perceptron try (and fail) to separate XOR data. The boundary oscillates
                  endlessly.
                </p>
                <div class="btn-row">
                  <button [class]="xorRunning() ? 'btn-yellow btn-sm flex-btn' : 'btn-green btn-sm flex-btn'" (click)="toggleXor()">
                    {{ xorRunning() ? 'Pause' : 'Train' }}
                  </button>
                  <button class="btn-red btn-sm flex-btn" (click)="resetXor()">Reset</button>
                </div>
                <div class="notebook-panel">
                  <p class="font-mono text-muted" style="font-size:0.75rem">Epoch: <strong>{{ xorEpoch() }}</strong></p>
                  <p class="font-mono text-muted" style="font-size:0.75rem">w1 = {{ fmt(xorState().w1) }}, w2 = {{ fmt(xorState().w2) }}, bias = {{ fmt(xorState().bias) }}</p>
                </div>
                @if (xorEpoch() >= 20) {
                  <div class="xor-warning">
                    <p class="text-red" style="font-weight:700;font-size:0.8rem">Non-convergence detected!</p>
                    <p class="text-muted" style="font-size:0.8rem">After {{ xorEpoch() }} epochs, the boundary is still oscillating. XOR is not linearly separable.</p>
                  </div>
                }
              </div>
            </div>
          </div>
          <app-sim-button label="Try XOR preset in the Lab" />
        </app-accordion>

        <!-- SECTION 5 -->
        <app-accordion [number]="5" title="Beyond Single Perceptrons">
          <p class="font-body">
            The XOR problem showed that single perceptrons have fundamental limitations. The
            solution: <strong>multi-layer perceptrons (MLPs)</strong>.
          </p>
          <div class="notebook-panel" style="margin:1rem 0">
            <p class="font-body"><strong>The path from perceptrons to deep learning:</strong></p>
            <ol class="font-body var-list">
              <li>Single perceptron (1958) — linear boundaries only</li>
              <li>XOR problem revealed (1969) — single layer can't do it</li>
              <li>Multi-layer networks + backpropagation (1986) — any boundary shape</li>
              <li>Deep learning revolution (2012+) — many layers, massive data, GPUs</li>
            </ol>
          </div>
          <app-callout type="insight">
            Understanding the single perceptron deeply is the key to understanding everything that
            came after. The concepts of weights, biases, activation functions, loss, and gradient-based
            learning all started here.
          </app-callout>
        </app-accordion>
      </div>

      <app-chapter-nav [prev]="{ path: '/learn/activation-functions', label: 'Ch 3: Activation Functions' }" />
    </div>
  `,
  styles: [`
    @use 'sass:color';
    @use '../../styles/variables' as *;

    .learn-chapter { padding: 2rem 0; }
    .ch-header { text-align: center; margin-bottom: 2.5rem; }
    .back-link { font-family: 'Patrick Hand', cursive; font-size: 0.9rem; color: $ink-blue; text-decoration: none; &:hover { text-decoration: underline; } }
    .ch-subtitle { max-width: 650px; margin: 0.5rem auto; color: $pencil-light; }
    .sections { display: flex; flex-direction: column; gap: 0.75rem; }

    .two-col-sm {
      display: grid; grid-template-columns: 1fr 1fr; gap: 0.75rem; margin: 1rem 0;
      @media (max-width: $bp-sm) { grid-template-columns: 1fr; }
    }

    .info-card {
      padding: 1rem; border-radius: $sketch-radius-sm;
      h3 { font-size: 1rem; margin-bottom: 0.5rem; }
      p { font-family: 'Patrick Hand', cursive; font-size: 0.85rem; color: $pencil-light; line-height: 1.5; }
      &.green { background: rgba($green-ink, 0.08); border: 1.5px solid rgba($green-ink, 0.2); h3 { color: $green-ink; } }
      &.red { background: rgba($red-pen, 0.08); border: 1.5px solid rgba($red-pen, 0.2); h3 { color: $red-pen; } }
    }

    .var-list { padding-left: 1.2rem; li { margin-bottom: 0.3rem; color: $pencil-light; } }
    .widget { margin: 1.25rem 0; }

    .theorem-box { border-left: 4px solid $ink-blue; margin: 1rem 0; h4 { margin-bottom: 0.5rem; } }

    .xor-table {
      font-family: 'JetBrains Mono', monospace; font-size: 0.85rem; margin: 1rem auto; border-collapse: collapse;
      th, td { padding: 0.4rem 1rem; text-align: center; }
      th { color: $pencil-light; }
      td { border-top: 1px dashed rgba($pencil-light, 0.2); }
    }

    .xor-layout { display: flex; gap: 1rem; align-items: flex-start; margin-top: 0.75rem; @media (max-width: $bp-sm) { flex-direction: column; align-items: center; } }
    .xor-canvas-wrap { position: relative; width: 250px; height: 250px; flex-shrink: 0; }
    .xor-native { width: 100%; height: 100%; border: 1.5px solid color.adjust($cream-dark, $lightness: -8%); border-radius: 8px; background: $cream; }
    .xor-rough { position: absolute; top: 0; left: 0; width: 100%; height: 100%; pointer-events: none; }
    .xor-controls { flex: 1; display: flex; flex-direction: column; gap: 0.5rem; }
    .btn-row { display: flex; gap: 0.35rem; }
    .flex-btn { flex: 1; }
    .xor-warning { background: rgba($red-pen, 0.08); border: 1.5px solid rgba($red-pen, 0.2); border-radius: 8px; padding: 0.6rem; }
  `],
})
export class Chapter4Component {
  fmt = fmt;

  // ── XOR Demo Widget ──
  xorState = signal<PerceptronState>({ w1: 0.5, w2: -0.3, bias: 0.1 });
  xorEpoch = signal(0);
  xorRunning = signal(false);
  private timerId: ReturnType<typeof setInterval> | null = null;

  xorNativeCanvas = viewChild<ElementRef<HTMLCanvasElement>>('xorNativeCanvas');
  xorRoughCanvas = viewChild<ElementRef<HTMLCanvasElement>>('xorRoughCanvas');

  private readonly SIZE = 250;
  private readonly RANGE = 6;

  constructor() {
    // Draw when state changes
    effect(() => {
      this.drawXor();
    });

    // Timer management
    effect(() => {
      const running = this.xorRunning();
      this.clearTimer();
      if (running) {
        this.timerId = setInterval(() => {
          this.runXorEpoch();
          if (this.xorEpoch() >= 100) this.xorRunning.set(false);
        }, 200);
      }
    });
  }

  toggleXor(): void {
    this.xorRunning.update(v => !v);
  }

  resetXor(): void {
    this.xorRunning.set(false);
    this.xorState.set({ w1: 0.5, w2: -0.3, bias: 0.1 });
    this.xorEpoch.set(0);
  }

  private runXorEpoch(): void {
    const activation = ACTIVATIONS.symmetricalHardLimit;
    this.xorState.update(prev => {
      let current = { ...prev };
      for (const point of XOR_POINTS) {
        const { newState } = trainStep(current, point, 0, activation, 0.1);
        current = newState;
      }
      return current;
    });
    this.xorEpoch.update(e => e + 1);
  }

  private clearTimer(): void {
    if (this.timerId) { clearInterval(this.timerId); this.timerId = null; }
  }

  private worldToCanvas(x: number): number {
    return ((x + this.RANGE) / (2 * this.RANGE)) * this.SIZE;
  }

  private drawXor(): void {
    const state = this.xorState();
    const nc = this.xorNativeCanvas();
    const rcEl = this.xorRoughCanvas();
    if (!nc || !rcEl) return;

    const canvas = nc.nativeElement;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rCtx = rcEl.nativeElement.getContext('2d');
    if (rCtx) rCtx.clearRect(0, 0, this.SIZE, this.SIZE);

    const S = this.SIZE;
    const R = this.RANGE;
    const activation = ACTIVATIONS.symmetricalHardLimit;

    ctx.clearRect(0, 0, S, S);

    // Regions
    const res = 25;
    const cellW = S / res;
    const cellH = S / res;
    for (let row = 0; row < res; row++) {
      const x2 = R - (row / (res - 1)) * 2 * R;
      for (let col = 0; col < res; col++) {
        const x1 = -R + (col / (res - 1)) * 2 * R;
        const val = forward(state, x1, x2, activation);
        const alpha = 0.15;
        ctx.fillStyle = val > 0 ? `rgba(39, 174, 96, ${alpha})` : `rgba(192, 57, 43, ${alpha})`;
        ctx.fillRect(col * cellW, row * cellH, cellW + 0.5, cellH + 0.5);
      }
    }

    const rc = rough.canvas(rcEl.nativeElement);

    // Axes
    const ox = this.worldToCanvas(0);
    const oy = S - this.worldToCanvas(0);
    rc.line(ox, 0, ox, S, { stroke: AXIS_COLOR, strokeWidth: 1, roughness: 0.5 });
    rc.line(0, oy, S, oy, { stroke: AXIS_COLOR, strokeWidth: 1, roughness: 0.5 });

    // Boundary
    const boundary = computeBoundaryLine(state, -R, R);
    if (boundary) {
      const x1s = this.worldToCanvas(boundary.x1Start);
      const y1s = S - this.worldToCanvas(boundary.x2Start);
      const x1e = this.worldToCanvas(boundary.x1End);
      const y1e = S - this.worldToCanvas(boundary.x2End);

      if (rCtx) {
        rCtx.strokeStyle = BOUNDARY_GLOW;
        rCtx.lineWidth = 5;
        rCtx.beginPath(); rCtx.moveTo(x1s, y1s); rCtx.lineTo(x1e, y1e); rCtx.stroke();
      }
      rc.line(x1s, y1s, x1e, y1e, { stroke: BOUNDARY_COLOR, strokeWidth: 2, roughness: 1 });
    }

    // Points
    XOR_POINTS.forEach(p => {
      const px = this.worldToCanvas(p.x1);
      const py = S - this.worldToCanvas(p.x2);
      rc.circle(px, py, 14, {
        fill: pointFill(p.label),
        fillStyle: 'solid',
        stroke: pointStroke(),
        strokeWidth: 1.5,
        roughness: 0.8,
      });
    });
  }

  ngOnDestroy(): void {
    this.clearTimer();
  }
}
