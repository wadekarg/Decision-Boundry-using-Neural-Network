import { Injectable, inject, effect, DestroyRef } from '@angular/core';
import { LabStoreService } from './lab-store.service';

@Injectable({ providedIn: 'root' })
export class TrainingService {
  private store = inject(LabStoreService);
  private destroyRef = inject(DestroyRef);
  private timerId: ReturnType<typeof setInterval> | null = null;

  constructor() {
    effect(() => {
      const status = this.store.status();
      const speed = this.store.speed();

      // Clear any existing timer
      this.clearTimer();

      if (status === 'running') {
        this.timerId = setInterval(() => {
          const shouldContinue = this.store.runEpoch();
          if (!shouldContinue) {
            this.clearTimer();
          }
        }, speed);
      }
    });

    this.destroyRef.onDestroy(() => this.clearTimer());
  }

  private clearTimer(): void {
    if (this.timerId !== null) {
      clearInterval(this.timerId);
      this.timerId = null;
    }
  }
}
