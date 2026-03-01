import { Component, inject, computed } from '@angular/core';
import { LabStoreService } from '../services/lab-store.service';
import { KatexComponent } from '../shared/katex.component';
import { fmt } from '../utils/math';

@Component({
  selector: 'app-math-panel',
  imports: [KatexComponent],
  template: `
    <div class="notebook-panel">
      <h3 class="section-label">Live Math</h3>

      <!-- Boundary equation -->
      <div class="math-section">
        <p class="math-label">Decision Boundary</p>
        <div class="math-box">
          <app-katex [tex]="boundaryEq()" />
        </div>
      </div>

      <!-- Activation function -->
      <div class="math-section">
        <p class="math-label">Activation: {{ store.activation().label }}</p>
        <div class="math-box">
          <app-katex [tex]="store.activation().formula" />
        </div>
      </div>

      <!-- Full computation -->
      <div class="math-section">
        <p class="math-label">Output Computation</p>
        <div class="math-box">
          <app-katex [tex]="outputEq()" />
        </div>
      </div>

      <!-- Weight vector -->
      <div class="math-section">
        <p class="math-label">Weight Vector</p>
        <div class="math-box">
          <app-katex [tex]="weightVec()" />
        </div>
        <p class="math-note">The weight vector is perpendicular to the decision boundary.</p>
      </div>
    </div>
  `,
  styles: [`
    @use '../../styles/variables' as *;

    .math-section {
      margin-top: 0.75rem;
    }

    .math-label {
      font-family: 'Inter', sans-serif;
      font-size: 0.65rem;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.08em;
      color: $pencil-light;
      margin-bottom: 0.25rem;
    }

    .math-box {
      background: $cream;
      border-radius: 8px;
      padding: 0.4rem 0.6rem;
      overflow-x: auto;
    }

    .math-note {
      font-family: 'Patrick Hand', cursive;
      font-size: 0.75rem;
      color: $pencil-light;
      margin-top: 0.25rem;
    }
  `],
})
export class MathPanelComponent {
  store = inject(LabStoreService);

  private sign(n: number): string {
    return n >= 0 ? '+' : '-';
  }

  boundaryEq = computed(() => {
    const w1 = this.store.w1();
    const w2 = this.store.w2();
    const bias = this.store.bias();
    return `${fmt(w1)}x_1 ${this.sign(w2)} ${fmt(Math.abs(w2))}x_2 ${this.sign(bias)} ${fmt(Math.abs(bias))} = 0`;
  });

  outputEq = computed(() => {
    const w1 = this.store.w1();
    const w2 = this.store.w2();
    const bias = this.store.bias();
    return `\\hat{y} = f(${fmt(w1)}x_1 ${this.sign(w2)} ${fmt(Math.abs(w2))}x_2 ${this.sign(bias)} ${fmt(Math.abs(bias))})`;
  });

  weightVec = computed(() => {
    return `\\mathbf{w} = \\begin{bmatrix} ${fmt(this.store.w1())} \\\\ ${fmt(this.store.w2())} \\end{bmatrix}`;
  });
}
