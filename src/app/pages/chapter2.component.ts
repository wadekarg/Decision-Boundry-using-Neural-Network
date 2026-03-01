import { Component, signal, effect, viewChild, ElementRef, computed } from '@angular/core';
import { AccordionComponent } from '../shared/accordion.component';
import { CalloutComponent } from '../shared/callout.component';
import { KatexComponent } from '../shared/katex.component';
import { ChapterNavComponent } from '../shared/chapter-nav.component';
import { SimButtonComponent } from '../shared/sim-button.component';
import { ACTIVATIONS } from '../engine/activations';
import { computeBoundaryLine, forward } from '../engine/perceptron';
import { regionColor, BOUNDARY_COLOR, BOUNDARY_GLOW, AXIS_COLOR, GRID_LINE_COLOR } from '../utils/notebook-colors';
import { fmt } from '../utils/math';
import rough from 'roughjs';

@Component({
  selector: 'app-chapter2',
  imports: [AccordionComponent, CalloutComponent, KatexComponent, ChapterNavComponent, SimButtonComponent],
  template: `
    <div class="container-md learn-chapter">
      <div class="ch-header">
        <a href="#/learn" class="back-link">&larr; All Chapters</a>
        <p class="section-label">Chapter 2</p>
        <h1>Decision Boundaries</h1>
        <p class="ch-subtitle font-body">
          A perceptron divides 2D space with a straight line. The equation of that line is the
          decision boundary — the frontier between class +1 and class -1.
        </p>
      </div>

      <div class="sections">
        <!-- SECTION 1 -->
        <app-accordion [number]="1" title="The Line Equation" [defaultOpen]="true">
          <p class="font-body">The perceptron classifies a point based on which side of a line it falls. That line is defined by:</p>
          <app-katex tex="w_1 x_1 + w_2 x_2 + b = 0" />
          <p class="font-body">
            This is the <strong>decision boundary</strong>. Points on one side (where
            <app-katex tex="w_1 x_1 + w_2 x_2 + b > 0" [inline]="true" />) get classified as
            <span class="text-green" style="font-weight:700">+1</span>. Points on the other side get classified as
            <span class="text-red" style="font-weight:700">-1</span>.
          </p>
          <p class="font-body">Rearranging to slope-intercept form (when <app-katex tex="w_2 \\neq 0" [inline]="true" />):</p>
          <app-katex tex="x_2 = -\\frac{w_1}{w_2} x_1 - \\frac{b}{w_2}" />
          <p class="font-body">
            So the <strong>slope</strong> is <app-katex tex="-w_1/w_2" [inline]="true" /> and the <strong>intercept</strong> is <app-katex tex="-b/w_2" [inline]="true" />.
          </p>
          <app-callout type="insight">
            The weights directly control the angle of the boundary line. The bias controls where
            the line passes through space. Together, they define <em>every possible straight line</em> in 2D.
          </app-callout>
        </app-accordion>

        <!-- SECTION 2 -->
        <app-accordion [number]="2" title="Geometric Intuition">
          <p class="font-body">
            The <strong>weight vector</strong> <app-katex tex="\\mathbf{w} = (w_1, w_2)" [inline]="true" /> is always
            <strong>perpendicular</strong> to the decision boundary.
          </p>
          <p class="font-body">
            The weight vector <strong>points toward the +1 region</strong>. Moving a point in the direction
            of <app-katex tex="\\mathbf{w}" [inline]="true" /> increases the net input, pushing it toward class +1.
          </p>

          <!-- Boundary Explorer Widget -->
          <div class="widget notebook-card">
            <h4 class="section-label">Interactive: Boundary Explorer</h4>
            <div class="explorer-layout">
              <div class="explorer-canvas-wrap">
                <canvas #nativeCanvas [width]="300" [height]="300" class="explorer-native"></canvas>
                <canvas #roughCanvas [width]="300" [height]="300" class="explorer-rough"></canvas>
              </div>
              <div class="explorer-controls">
                <div class="compute-slider">
                  <label class="font-mono text-muted">w1 = {{ fmt(bW1()) }}</label>
                  <input type="range" [min]="-5" [max]="5" [step]="0.1" [value]="bW1()" (input)="bW1.set(toNum($event))" />
                </div>
                <div class="compute-slider">
                  <label class="font-mono text-muted">w2 = {{ fmt(bW2()) }}</label>
                  <input type="range" [min]="-5" [max]="5" [step]="0.1" [value]="bW2()" (input)="bW2.set(toNum($event))" />
                </div>
                <div class="compute-slider">
                  <label class="font-mono text-muted">bias = {{ fmt(bBias()) }}</label>
                  <input type="range" [min]="-5" [max]="5" [step]="0.1" [value]="bBias()" (input)="bBias.set(toNum($event))" />
                </div>
                <div class="notebook-panel" style="margin-top:0.5rem">
                  <p class="text-muted" style="font-size:0.75rem;margin-bottom:0.25rem">Boundary equation:</p>
                  <p class="font-mono" style="font-size:0.85rem">{{ fmt(bW1()) }}x1 + {{ fmt(bW2()) }}x2 + {{ fmt(bBias()) }} = 0</p>
                  <p class="text-muted" style="font-size:0.75rem;margin-top:0.4rem">The dashed arrow shows the weight vector <strong>w</strong> — it's always perpendicular to the boundary.</p>
                </div>
              </div>
            </div>
          </div>

          <app-callout type="try">
            In the widget above, try these experiments:
            <ul style="margin-top:0.5rem">
              <li>Set w1 = 1, w2 = 0: the boundary is <strong>horizontal</strong></li>
              <li>Set w1 = 0, w2 = 1: the boundary is <strong>vertical</strong></li>
              <li>Set w1 = 1, w2 = 1: the boundary is at <strong>45 degrees</strong></li>
              <li>Increase bias: the boundary <strong>shifts away from the origin</strong></li>
            </ul>
          </app-callout>
        </app-accordion>

        <!-- SECTION 3 -->
        <app-accordion [number]="3" title="Linear Separability">
          <p class="font-body">
            A dataset is <strong>linearly separable</strong> if there exists a straight line that perfectly separates the two classes.
          </p>
          <div class="two-col-sm">
            <div class="info-card green">
              <h3>Linearly Separable</h3>
              <p>AND gate, OR gate, two clusters on opposite sides — a single line can perfectly divide them. The perceptron can solve these!</p>
            </div>
            <div class="info-card red">
              <h3>NOT Linearly Separable</h3>
              <p>XOR, concentric circles, interleaved spirals — no single line can separate them. A single perceptron fails.</p>
            </div>
          </div>
          <app-callout type="think">
            The famous <strong>XOR problem</strong>: inputs (0,0) and (1,1) are class 0, while (0,1)
            and (1,0) are class 1. Try to draw a single line that separates them — it's impossible!
            The solution? <strong>Multiple layers</strong>.
          </app-callout>
        </app-accordion>

        <!-- SECTION 4 -->
        <app-accordion [number]="4" title="Special Cases">
          <p class="font-body">A few important edge cases in boundary geometry:</p>
          <div class="case-list">
            <div class="mini-card"><strong>w2 = 0, w1 &ne; 0</strong><p>Vertical line at <app-katex tex="x_1 = -b/w_1" [inline]="true" />. Only x1 matters.</p></div>
            <div class="mini-card"><strong>w1 = 0, w2 &ne; 0</strong><p>Horizontal line at <app-katex tex="x_2 = -b/w_2" [inline]="true" />. Only x2 matters.</p></div>
            <div class="mini-card"><strong>w1 = w2 = 0</strong><p>No boundary exists. Output depends only on bias sign.</p></div>
            <div class="mini-card"><strong>b = 0</strong><p>The boundary passes through the origin.</p></div>
          </div>
          <app-sim-button label="Explore in the Lab" />
        </app-accordion>
      </div>

      <app-chapter-nav
        [prev]="{ path: '/learn/what-is-a-perceptron', label: 'Ch 1: What is a Perceptron?' }"
        [next]="{ path: '/learn/activation-functions', label: 'Ch 3: Activation Functions' }" />
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

    .widget { margin: 1.25rem 0; }

    .explorer-layout {
      display: flex; gap: 1rem; margin-top: 0.75rem;
      @media (max-width: $bp-sm) { flex-direction: column; align-items: center; }
    }

    .explorer-canvas-wrap {
      position: relative; width: 300px; height: 300px; flex-shrink: 0;
    }

    .explorer-native {
      width: 100%; height: 100%;
      border: 1.5px solid color.adjust($cream-dark, $lightness: -8%);
      border-radius: 8px;
      background: $cream;
    }

    .explorer-rough {
      position: absolute; top: 0; left: 0; width: 100%; height: 100%; pointer-events: none;
    }

    .explorer-controls { flex: 1; display: flex; flex-direction: column; gap: 0.5rem; }

    .compute-slider {
      label { display: block; font-size: 0.8rem; margin-bottom: 0.2rem; }
    }

    .case-list {
      display: flex; flex-direction: column; gap: 0.5rem; margin: 1rem 0;
    }

    .mini-card {
      padding: 0.75rem;
      background: $cream;
      border-radius: 8px;
      border: 1px solid color.adjust($cream-dark, $lightness: -6%);
      strong { font-size: 0.9rem; }
      p { font-family: 'Patrick Hand', cursive; font-size: 0.8rem; color: $pencil-light; margin-top: 0.25rem; }
    }
  `],
})
export class Chapter2Component {
  fmt = fmt;

  // ── Boundary Explorer Widget ──
  bW1 = signal(1);
  bW2 = signal(1);
  bBias = signal(0);

  nativeCanvas = viewChild<ElementRef<HTMLCanvasElement>>('nativeCanvas');
  roughCanvas = viewChild<ElementRef<HTMLCanvasElement>>('roughCanvas');

  private readonly SIZE = 300;
  private readonly RANGE = 6;

  constructor() {
    effect(() => {
      this.drawBoundary();
    });
  }

  toNum(e: Event): number { return Number((e.target as HTMLInputElement).value); }

  private worldToCanvas(x: number): number {
    return ((x + this.RANGE) / (2 * this.RANGE)) * this.SIZE;
  }

  private drawBoundary(): void {
    const w1 = this.bW1();
    const w2 = this.bW2();
    const bias = this.bBias();
    const nc = this.nativeCanvas();
    const rcEl = this.roughCanvas();
    if (!nc || !rcEl) return;

    const canvas = nc.nativeElement;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rCtx = rcEl.nativeElement.getContext('2d');
    if (rCtx) rCtx.clearRect(0, 0, this.SIZE, this.SIZE);

    const activation = ACTIVATIONS.symmetricalHardLimit;
    const state = { w1, w2, bias };
    const S = this.SIZE;
    const R = this.RANGE;

    ctx.clearRect(0, 0, S, S);

    // Regions (native)
    const res = 30;
    const cellW = S / res;
    const cellH = S / res;
    for (let row = 0; row < res; row++) {
      const x2 = R - (row / (res - 1)) * (2 * R);
      for (let col = 0; col < res; col++) {
        const x1 = -R + (col / (res - 1)) * (2 * R);
        const val = forward(state, x1, x2, activation);
        const color = regionColor(val);
        if (color !== 'transparent') {
          ctx.fillStyle = color;
          ctx.fillRect(col * cellW, row * cellH, cellW + 0.5, cellH + 0.5);
        }
      }
    }

    // rough.js overlay
    const rc = rough.canvas(rcEl.nativeElement);

    // Grid
    for (let i = -R; i <= R; i++) {
      const px = this.worldToCanvas(i);
      const py = S - this.worldToCanvas(i);
      rc.line(px, 0, px, S, { stroke: GRID_LINE_COLOR, strokeWidth: 0.5, roughness: 0.3 });
      rc.line(0, py, S, py, { stroke: GRID_LINE_COLOR, strokeWidth: 0.5, roughness: 0.3 });
    }

    // Axes
    const ox = this.worldToCanvas(0);
    const oy = S - this.worldToCanvas(0);
    rc.line(ox, 0, ox, S, { stroke: AXIS_COLOR, strokeWidth: 1, roughness: 0.6 });
    rc.line(0, oy, S, oy, { stroke: AXIS_COLOR, strokeWidth: 1, roughness: 0.6 });

    // Boundary line
    const boundary = computeBoundaryLine(state, -R, R);
    if (boundary) {
      const x1s = this.worldToCanvas(boundary.x1Start);
      const y1s = S - this.worldToCanvas(boundary.x2Start);
      const x1e = this.worldToCanvas(boundary.x1End);
      const y1e = S - this.worldToCanvas(boundary.x2End);

      if (rCtx) {
        rCtx.strokeStyle = BOUNDARY_GLOW;
        rCtx.lineWidth = 6;
        rCtx.beginPath(); rCtx.moveTo(x1s, y1s); rCtx.lineTo(x1e, y1e); rCtx.stroke();
      }
      rc.line(x1s, y1s, x1e, y1e, { stroke: BOUNDARY_COLOR, strokeWidth: 2, roughness: 1 });
    }

    // Weight vector arrow
    if (rCtx) {
      const arrowScale = 15;
      const ax = ox + w1 * arrowScale;
      const ay = oy - w2 * arrowScale;
      rCtx.strokeStyle = 'rgba(74, 74, 74, 0.5)';
      rCtx.lineWidth = 2;
      rCtx.setLineDash([4, 4]);
      rCtx.beginPath(); rCtx.moveTo(ox, oy); rCtx.lineTo(ax, ay); rCtx.stroke();
      rCtx.setLineDash([]);

      // Arrowhead
      rCtx.fillStyle = 'rgba(74, 74, 74, 0.5)';
      const angle = Math.atan2(-w2, w1);
      rCtx.beginPath();
      rCtx.moveTo(ax, ay);
      rCtx.lineTo(ax - 8 * Math.cos(angle - 0.4), ay + 8 * Math.sin(angle - 0.4));
      rCtx.lineTo(ax - 8 * Math.cos(angle + 0.4), ay + 8 * Math.sin(angle + 0.4));
      rCtx.fill();

      rCtx.fillStyle = 'rgba(74, 74, 74, 0.4)';
      rCtx.font = '10px monospace';
      rCtx.fillText('w', ax + 4, ay - 4);
    }
  }
}
