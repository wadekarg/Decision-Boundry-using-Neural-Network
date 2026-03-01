import { Component, signal, effect, viewChild, ElementRef } from '@angular/core';
import { AccordionComponent } from '../shared/accordion.component';
import { CalloutComponent } from '../shared/callout.component';
import { KatexComponent } from '../shared/katex.component';
import { ChapterNavComponent } from '../shared/chapter-nav.component';
import { SimButtonComponent } from '../shared/sim-button.component';
import { ACTIVATION_LIST, ACTIVATIONS } from '../engine/activations';
import type { ActivationType } from '../engine/types';
import { AXIS_COLOR, GRID_LINE_COLOR, BOUNDARY_COLOR } from '../utils/notebook-colors';
import rough from 'roughjs';

@Component({
  selector: 'app-chapter3',
  imports: [AccordionComponent, CalloutComponent, KatexComponent, ChapterNavComponent, SimButtonComponent],
  template: `
    <div class="container-md learn-chapter">
      <div class="ch-header">
        <a href="#/learn" class="back-link">&larr; All Chapters</a>
        <p class="section-label">Chapter 3</p>
        <h1>Activation Functions</h1>
        <p class="ch-subtitle font-body">
          The activation function transforms the net input into the final output. Different functions
          give different behaviors — from crisp binary decisions to smooth continuous outputs.
        </p>
      </div>

      <div class="sections">
        <!-- SECTION 1 -->
        <app-accordion [number]="1" title="Why Do We Need Activation Functions?" [defaultOpen]="true">
          <p class="font-body">
            Without an activation function, the perceptron just computes a <strong>linear combination</strong>
            of the inputs. For <strong>classification</strong>, we need a decision: is this point class +1 or class -1?
            The activation function makes that decision by <strong>thresholding</strong> the net input.
          </p>
          <ul class="font-body var-list">
            <li><strong>Hard limit functions</strong> give crisp 0/1 or -1/+1 decisions — perfect for binary classification</li>
            <li><strong>Linear functions</strong> pass through the raw value — useful for regression</li>
            <li><strong>Smooth functions (tanh, sigmoid)</strong> give continuous output with gradients — needed for gradient descent</li>
          </ul>
          <app-callout type="insight">
            In modern deep learning, activation functions like ReLU, sigmoid, and tanh are used in
            hidden layers to introduce <strong>non-linearity</strong>. Without non-linear activations,
            stacking multiple layers would still only compute a linear function!
          </app-callout>
        </app-accordion>

        <!-- SECTION 2 -->
        <app-accordion [number]="2" title="The Activation Functions">
          <p class="font-body">Our lab supports four activation functions. Use the interactive graph to see their shapes.</p>

          <!-- Activation Graph Widget -->
          <div class="widget notebook-card">
            <h4 class="section-label">Interactive: Activation Function Graph</h4>
            <div class="act-buttons">
              @for (id of activationList; track id) {
                <button class="btn-pill"
                  [class.active]="selectedAct() === id"
                  (click)="selectedAct.set(id)">
                  {{ activations[id].label }}
                </button>
              }
            </div>
            <div class="act-layout">
              <div class="act-canvas-wrap">
                <canvas #actCanvas [width]="320" [height]="320" class="act-canvas"></canvas>
              </div>
              <div class="act-info">
                <h4 class="text-ink">{{ activations[selectedAct()].label }}</h4>
                <div class="notebook-panel">
                  <app-katex [tex]="activations[selectedAct()].formula" />
                </div>
                <p class="font-body act-desc">{{ actDescription() }}</p>
              </div>
            </div>
          </div>

          <div class="two-col-sm">
            <div class="mini-card"><strong class="text-ink">Hard Limit</strong><app-katex [tex]="activations.hardLimit.formula" /><p>Binary output {{ '{' }}0, 1{{ '}' }}. Used in the original perceptron.</p></div>
            <div class="mini-card"><strong class="text-green">Sym. Hard Limit</strong><app-katex [tex]="activations.symmetricalHardLimit.formula" /><p>Bipolar output {{ '{' }}-1, +1{{ '}' }}. Common in our lab.</p></div>
            <div class="mini-card"><strong class="text-yellow">Linear</strong><app-katex [tex]="activations.linear.formula" /><p>No transformation. Output equals net input.</p></div>
            <div class="mini-card"><strong class="text-ink">Tanh</strong><app-katex [tex]="activations.tanh.formula" /><p>Smooth S-curve in (-1, +1). Differentiable.</p></div>
          </div>
        </app-accordion>

        <!-- SECTION 3 -->
        <app-accordion [number]="3" title="Hard Limit vs. Continuous">
          <p class="font-body">The choice of activation function has a big impact on behavior:</p>
          <div class="two-col-sm">
            <div class="info-card blue">
              <h3>Hard Limit (Step Functions)</h3>
              <ul><li>Crisp decision: exactly +1 or -1</li><li>Not differentiable at n = 0</li><li>Uses simple perceptron rule</li><li>Guaranteed convergence for linearly separable data</li></ul>
            </div>
            <div class="info-card green">
              <h3>Continuous (Tanh, Sigmoid)</h3>
              <ul><li>Soft decision: values between -1 and +1</li><li>Differentiable everywhere</li><li>Can use gradient descent</li><li>Smoother learning dynamics</li></ul>
            </div>
          </div>
          <app-callout type="think">
            With a hard limit function, the error is always an integer. With tanh, the error can be any small fraction.
            This means continuous activations allow <strong>finer-grained weight updates</strong>.
          </app-callout>
        </app-accordion>

        <!-- SECTION 4 -->
        <app-accordion [number]="4" title="Impact on the Decision Boundary">
          <p class="font-body">
            The activation function doesn't change the <strong>position</strong> of the decision boundary.
            The boundary is always at <app-katex tex="w_1 x_1 + w_2 x_2 + b = 0" [inline]="true" />.
            What changes is <strong>how the regions are colored</strong>:
          </p>
          <ul class="font-body var-list">
            <li><strong>Hard limit:</strong> Two flat, solid color regions — abrupt transition</li>
            <li><strong>Linear:</strong> Gradient of intensity increasing with distance</li>
            <li><strong>Tanh:</strong> Smooth gradient that saturates far from the boundary</li>
          </ul>
          <app-sim-button label="Try different activations in the Lab" />
        </app-accordion>
      </div>

      <app-chapter-nav
        [prev]="{ path: '/learn/decision-boundaries', label: 'Ch 2: Decision Boundaries' }"
        [next]="{ path: '/learn/learning-rule', label: 'Ch 4: The Learning Rule' }" />
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
      ul { font-family: 'Patrick Hand', cursive; font-size: 0.85rem; padding-left: 1.2rem; li { margin-bottom: 0.25rem; color: $pencil-grey; } }
      &.blue { background: rgba($ink-blue, 0.08); border: 1.5px solid rgba($ink-blue, 0.2); h3 { color: $ink-blue; } }
      &.green { background: rgba($green-ink, 0.08); border: 1.5px solid rgba($green-ink, 0.2); h3 { color: $green-ink; } }
    }

    .var-list { padding-left: 1.2rem; li { margin-bottom: 0.3rem; color: $pencil-light; } }
    .widget { margin: 1.25rem 0; }

    .act-buttons { display: flex; gap: 0.4rem; flex-wrap: wrap; margin: 0.75rem 0; }
    .act-layout { display: flex; gap: 1rem; align-items: center; @media (max-width: $bp-sm) { flex-direction: column; } }
    .act-canvas-wrap { flex-shrink: 0; }
    .act-canvas { border: 1.5px solid color.adjust($cream-dark, $lightness: -8%); border-radius: 8px; background: $cream; width: 320px; height: 320px; }
    .act-info { flex: 1; h4 { margin-bottom: 0.5rem; } }
    .act-desc { font-size: 0.85rem; color: $pencil-light; margin-top: 0.5rem; }

    .mini-card {
      padding: 0.75rem; background: $cream; border-radius: 8px; border: 1px solid color.adjust($cream-dark, $lightness: -6%);
      strong { font-size: 0.9rem; }
      p { font-family: 'Patrick Hand', cursive; font-size: 0.8rem; color: $pencil-light; margin-top: 0.25rem; }
    }
  `],
})
export class Chapter3Component {
  activationList = ACTIVATION_LIST;
  activations = ACTIVATIONS;
  selectedAct = signal<ActivationType>('symmetricalHardLimit');

  actCanvas = viewChild<ElementRef<HTMLCanvasElement>>('actCanvas');

  private readonly SIZE = 320;
  private readonly RANGE = 5;

  constructor() {
    effect(() => {
      this.drawActivation();
    });
  }

  actDescription(): string {
    const descs: Record<string, string> = {
      hardLimit: 'Outputs 1 for non-negative input, 0 for negative. Creates binary classification with values {0, 1}.',
      symmetricalHardLimit: 'Outputs +1 for non-negative input, -1 for negative. Creates binary classification with values {-1, +1}. Most common for perceptrons.',
      linear: 'Outputs the input directly. No thresholding — the output is continuous. Useful for regression but not for binary classification.',
      tanh: 'Smooth S-curve between -1 and +1. Differentiable everywhere, making it suitable for gradient-based learning. Saturates for large inputs.',
    };
    return descs[this.selectedAct()] || '';
  }

  private drawActivation(): void {
    const sel = this.selectedAct();
    const canvasRef = this.actCanvas();
    if (!canvasRef) return;

    const canvas = canvasRef.nativeElement;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const S = this.SIZE;
    const R = this.RANGE;
    const activation = ACTIVATIONS[sel];

    ctx.clearRect(0, 0, S, S);

    const toX = (v: number) => ((v + R) / (2 * R)) * S;
    const toY = (v: number) => S - ((v + R) / (2 * R)) * S;

    const rc = rough.canvas(canvas);

    // Grid
    for (let i = -R; i <= R; i++) {
      rc.line(toX(i), 0, toX(i), S, { stroke: GRID_LINE_COLOR, strokeWidth: 0.5, roughness: 0.3 });
      rc.line(0, toY(i), S, toY(i), { stroke: GRID_LINE_COLOR, strokeWidth: 0.5, roughness: 0.3 });
    }

    // Axes
    rc.line(toX(0), 0, toX(0), S, { stroke: AXIS_COLOR, strokeWidth: 1, roughness: 0.6 });
    rc.line(0, toY(0), S, toY(0), { stroke: AXIS_COLOR, strokeWidth: 1, roughness: 0.6 });

    // Labels
    ctx.fillStyle = 'rgba(74, 74, 74, 0.4)';
    ctx.font = '10px monospace';
    ctx.textAlign = 'center';
    ctx.fillText('n', S - 12, toY(0) - 8);
    ctx.fillText('f(n)', toX(0) + 16, 14);
    for (let i = -R; i <= R; i++) {
      if (i === 0) continue;
      ctx.fillText(String(i), toX(i), toY(0) + 14);
      ctx.fillText(String(i), toX(0) - 16, toY(i) + 4);
    }

    // Reference lines at y = -1, +1
    ctx.setLineDash([4, 4]);
    ctx.strokeStyle = 'rgba(74, 74, 74, 0.12)';
    ctx.lineWidth = 1;
    for (const ref of [-1, 1]) {
      ctx.beginPath(); ctx.moveTo(0, toY(ref)); ctx.lineTo(S, toY(ref)); ctx.stroke();
    }
    ctx.setLineDash([]);

    // Draw function curve (segments via rough.js)
    const steps = 100;
    for (let i = 0; i < steps; i++) {
      const n1 = -R + (i / steps) * 2 * R;
      const n2 = -R + ((i + 1) / steps) * 2 * R;
      const o1 = activation.fn(n1);
      const o2 = activation.fn(n2);
      rc.line(toX(n1), toY(o1), toX(n2), toY(o2), {
        stroke: BOUNDARY_COLOR,
        strokeWidth: 3,
        roughness: 0.6,
      });
    }
  }
}
