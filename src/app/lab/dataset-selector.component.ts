import { Component, inject } from '@angular/core';
import { LabStoreService } from '../services/lab-store.service';
import { generateRandomSeparable, generateRandomNonSeparable } from '../engine/datasets';

@Component({
  selector: 'app-dataset-selector',
  template: `
    <div class="notebook-panel">
      <h3 class="section-label">Dataset</h3>
      <div class="btn-grid">
        <button class="btn-ink btn-sm" (click)="loadSeparable()">
          Random Separable
        </button>
        <button class="btn-yellow btn-sm" (click)="loadNonSeparable()">
          Random Non-Separable
        </button>
      </div>
      <button class="btn-red btn-sm clear-btn" (click)="store.clearPoints()">
        Clear All
      </button>
    </div>
  `,
  styles: [`
    .btn-grid {
      display: flex;
      flex-direction: column;
      gap: 0.4rem;
      margin-top: 0.5rem;
    }
    .clear-btn {
      width: 100%;
      margin-top: 0.5rem;
    }
  `],
})
export class DatasetSelectorComponent {
  store = inject(LabStoreService);

  loadSeparable(): void {
    this.store.reset();
    this.store.setPoints(generateRandomSeparable());
  }

  loadNonSeparable(): void {
    this.store.reset();
    this.store.setPoints(generateRandomNonSeparable());
  }
}
