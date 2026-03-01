import { Component, inject } from '@angular/core';
import { LabStoreService } from '../services/lab-store.service';
import { ACTIVATION_LIST, ACTIVATIONS } from '../engine/activations';

@Component({
  selector: 'app-activation-selector',
  template: `
    <div class="notebook-panel">
      <h3 class="section-label">Activation</h3>
      <div class="btn-grid">
        @for (id of activationList; track id) {
          <button class="btn-pill"
            [class.active]="store.activationType() === id"
            (click)="store.activationType.set(id)">
            {{ activations[id].label }}
          </button>
        }
      </div>
    </div>
  `,
  styles: [`
    .btn-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 0.4rem;
      margin-top: 0.5rem;
    }
  `],
})
export class ActivationSelectorComponent {
  store = inject(LabStoreService);
  activationList = ACTIVATION_LIST;
  activations = ACTIVATIONS;
}
