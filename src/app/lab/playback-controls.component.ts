import { Component, inject } from '@angular/core';
import { LabStoreService } from '../services/lab-store.service';

@Component({
  selector: 'app-playback-controls',
  template: `
    <div class="notebook-panel">
      <div class="header-row">
        <h3 class="section-label">Controls</h3>
        <span class="epoch-label">Epoch: {{ store.currentEpoch() }} / {{ store.maxEpochs() }}</span>
      </div>

      <div class="btn-row">
        @if (store.status() === 'running') {
          <button class="btn-yellow btn-sm flex-btn" (click)="store.pause()">Pause</button>
        } @else {
          <button class="btn-green btn-sm flex-btn" (click)="store.play()" [disabled]="store.status() === 'done'">Play</button>
        }
        <button class="btn btn-sm flex-btn" (click)="store.runEpoch()" [disabled]="store.status() === 'running' || store.status() === 'done'">Epoch</button>
        <button class="btn btn-sm flex-btn" (click)="store.stepOnce()" [disabled]="store.status() === 'running' || store.status() === 'done'">Step</button>
        <button class="btn-red btn-sm flex-btn" (click)="store.reset()">Reset</button>
      </div>

      <!-- Speed slider -->
      <div class="slider-row">
        <label class="slider-label">Speed</label>
        <input type="range" [min]="1" [max]="1000" [step]="1"
               [value]="1 + 1000 - store.speed()"
               (input)="store.speed.set(1 + 1000 - toNum($event))" />
        <span class="slider-value">{{ store.speed() }}ms</span>
      </div>

      <!-- Learning rate -->
      <div class="slider-row">
        <label class="slider-label">LR</label>
        <input type="range" [min]="0.01" [max]="1" [step]="0.01"
               [value]="store.learningRate()"
               (input)="store.learningRate.set(toNum($event))" />
        <span class="slider-value">{{ store.learningRate().toFixed(2) }}</span>
      </div>

      <!-- Max epochs -->
      <div class="slider-row">
        <label class="slider-label">Epochs</label>
        <input type="range" [min]="10" [max]="500" [step]="10"
               [value]="store.maxEpochs()"
               (input)="store.maxEpochs.set(toNum($event))" />
        <span class="slider-value">{{ store.maxEpochs() }}</span>
      </div>
    </div>
  `,
  styles: [`
    @use '../../styles/variables' as *;

    .header-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 0.5rem;
    }

    .epoch-label {
      font-family: 'JetBrains Mono', monospace;
      font-size: 0.7rem;
      color: $pencil-light;
    }

    .btn-row {
      display: flex;
      gap: 0.35rem;
      margin-bottom: 0.75rem;
    }

    .flex-btn {
      flex: 1;
    }

    .slider-row {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      margin-top: 0.4rem;
    }

    .slider-label {
      font-family: 'Inter', sans-serif;
      font-size: 0.7rem;
      color: $pencil-light;
      width: 2.5rem;
      flex-shrink: 0;
    }

    .slider-value {
      font-family: 'JetBrains Mono', monospace;
      font-size: 0.7rem;
      color: $pencil-grey;
      width: 3.5rem;
      text-align: right;
      flex-shrink: 0;
    }

    input[type="range"] {
      flex: 1;
    }
  `],
})
export class PlaybackControlsComponent {
  store = inject(LabStoreService);

  toNum(event: Event): number {
    return Number((event.target as HTMLInputElement).value);
  }
}
