import { Component, inject } from '@angular/core';
import { LabStoreService } from '../services/lab-store.service';
import { fmt } from '../utils/math';

@Component({
  selector: 'app-weight-sliders',
  template: `
    <div class="notebook-panel">
      <h3 class="section-label">Weights</h3>

      <div class="slider-row">
        <label class="slider-label">w&#x2081;</label>
        <input type="range" [min]="-10" [max]="10" [step]="0.01"
               [value]="store.w1()"
               (input)="store.w1.set(toNum($event))" />
        <span class="slider-value">{{ fmt(store.w1()) }}</span>
      </div>

      <div class="slider-row">
        <label class="slider-label">w&#x2082;</label>
        <input type="range" [min]="-10" [max]="10" [step]="0.01"
               [value]="store.w2()"
               (input)="store.w2.set(toNum($event))" />
        <span class="slider-value">{{ fmt(store.w2()) }}</span>
      </div>

      <div class="slider-row">
        <label class="slider-label">bias</label>
        <input type="range" [min]="-10" [max]="10" [step]="0.01"
               [value]="store.bias()"
               (input)="store.bias.set(toNum($event))" />
        <span class="slider-value">{{ fmt(store.bias()) }}</span>
      </div>
    </div>
  `,
  styles: [`
    @use '../../styles/variables' as *;

    .slider-row {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      margin-top: 0.5rem;
    }

    .slider-label {
      font-family: 'JetBrains Mono', monospace;
      font-size: 0.8rem;
      color: $pencil-light;
      width: 2.5rem;
      text-align: right;
    }

    .slider-value {
      font-family: 'JetBrains Mono', monospace;
      font-size: 0.8rem;
      color: $pencil-grey;
      width: 3.5rem;
      text-align: right;
    }

    input[type="range"] {
      flex: 1;
    }
  `],
})
export class WeightSlidersComponent {
  store = inject(LabStoreService);
  fmt = fmt;

  toNum(event: Event): number {
    return Number((event.target as HTMLInputElement).value);
  }
}
