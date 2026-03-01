import { Component, inject, effect, viewChild, ElementRef } from '@angular/core';
import { LabStoreService } from '../services/lab-store.service';
import rough from 'roughjs';
import { CHART_ERROR_COLOR, CHART_ACCURACY_COLOR, CHART_GRID_COLOR, CHART_AXIS_COLOR } from '../utils/notebook-colors';

@Component({
  selector: 'app-training-chart',
  template: `
    <div class="notebook-panel">
      <h3 class="section-label">Training Progress</h3>
      @if (store.trainingHistory().length === 0) {
        <p class="empty-msg">No training data yet. Start training to see error and accuracy curves.</p>
      } @else {
        <div class="chart-container">
          <canvas #chartCanvas [width]="WIDTH" [height]="HEIGHT"></canvas>
        </div>
        <div class="legend">
          <span class="legend-item"><span class="swatch error"></span> Total Error</span>
          <span class="legend-item"><span class="swatch accuracy"></span> Accuracy</span>
        </div>
      }
    </div>
  `,
  styles: [`
    @use '../../styles/variables' as *;

    .chart-container {
      margin-top: 0.5rem;
    }

    canvas {
      width: 100%;
      height: auto;
      border-radius: 8px;
    }

    .empty-msg {
      font-family: 'Patrick Hand', cursive;
      font-size: 0.9rem;
      color: $pencil-light;
      margin-top: 0.5rem;
    }

    .legend {
      display: flex;
      justify-content: center;
      gap: 1rem;
      margin-top: 0.4rem;
    }

    .legend-item {
      font-family: 'Inter', sans-serif;
      font-size: 0.7rem;
      color: $pencil-light;
      display: flex;
      align-items: center;
      gap: 0.3rem;
    }

    .swatch {
      display: inline-block;
      width: 10px;
      height: 10px;
      border-radius: 2px;
    }

    .swatch.error { background: $red-pen; }
    .swatch.accuracy { background: $green-ink; }
  `],
})
export class TrainingChartComponent {
  store = inject(LabStoreService);
  WIDTH = 500;
  HEIGHT = 200;

  chartCanvas = viewChild<ElementRef<HTMLCanvasElement>>('chartCanvas');

  constructor() {
    effect(() => {
      const history = this.store.trainingHistory();
      const canvasRef = this.chartCanvas();
      if (!canvasRef || history.length === 0) return;
      this.drawChart(canvasRef.nativeElement, history);
    });
  }

  private drawChart(canvas: HTMLCanvasElement, history: { epoch: number; totalError: number; accuracy: number }[]): void {
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const W = this.WIDTH;
    const H = this.HEIGHT;
    const PAD = { top: 15, right: 50, bottom: 32, left: 50 };
    const plotW = W - PAD.left - PAD.right;
    const plotH = H - PAD.top - PAD.bottom;

    ctx.clearRect(0, 0, W, H);

    // Background
    ctx.fillStyle = '#FDF6E3';
    ctx.fillRect(0, 0, W, H);

    const rc = rough.canvas(canvas);

    // Compute ranges
    const maxError = Math.max(...history.map(h => h.totalError), 1);
    const maxEpoch = history[history.length - 1].epoch;

    const toX = (epoch: number) => PAD.left + (epoch / maxEpoch) * plotW;
    const toYError = (err: number) => PAD.top + plotH - (err / maxError) * plotH;
    const toYAcc = (acc: number) => PAD.top + plotH - acc * plotH;

    // Grid lines
    for (let i = 0; i <= 4; i++) {
      const y = PAD.top + (i / 4) * plotH;
      rc.line(PAD.left, y, W - PAD.right, y, { stroke: CHART_GRID_COLOR, strokeWidth: 0.5, roughness: 0.3 });
    }

    // ── Axes ──
    // Left Y axis (Error)
    rc.line(PAD.left, PAD.top, PAD.left, H - PAD.bottom, { stroke: CHART_ERROR_COLOR, strokeWidth: 1.2, roughness: 0.5 });
    // Right Y axis (Accuracy)
    rc.line(W - PAD.right, PAD.top, W - PAD.right, H - PAD.bottom, { stroke: CHART_ACCURACY_COLOR, strokeWidth: 1.2, roughness: 0.5 });
    // X axis (Epoch)
    rc.line(PAD.left, H - PAD.bottom, W - PAD.right, H - PAD.bottom, { stroke: CHART_AXIS_COLOR, strokeWidth: 1, roughness: 0.5 });

    // ── Tick labels ──
    ctx.font = '9px "JetBrains Mono", monospace';

    // Left Y axis — Error ticks
    ctx.fillStyle = CHART_ERROR_COLOR;
    ctx.textAlign = 'right';
    for (let i = 0; i <= 4; i++) {
      const val = maxError * (1 - i / 4);
      const y = PAD.top + (i / 4) * plotH;
      ctx.fillText(val.toFixed(2), PAD.left - 6, y + 3);
    }

    // Right Y axis — Accuracy ticks (0% to 100%)
    ctx.fillStyle = CHART_ACCURACY_COLOR;
    ctx.textAlign = 'left';
    for (let i = 0; i <= 4; i++) {
      const pct = (1 - i / 4) * 100;
      const y = PAD.top + (i / 4) * plotH;
      ctx.fillText(Math.round(pct) + '%', W - PAD.right + 6, y + 3);
    }

    // X axis — Epoch ticks
    ctx.fillStyle = CHART_AXIS_COLOR;
    ctx.textAlign = 'center';
    const tickCount = Math.min(maxEpoch, 5);
    for (let i = 0; i <= tickCount; i++) {
      const epoch = Math.round((i / tickCount) * maxEpoch);
      if (epoch === 0) continue;
      const x = toX(epoch);
      ctx.fillText(String(epoch), x, H - PAD.bottom + 14);
      // Small tick mark
      ctx.beginPath();
      ctx.moveTo(x, H - PAD.bottom);
      ctx.lineTo(x, H - PAD.bottom + 4);
      ctx.strokeStyle = CHART_AXIS_COLOR;
      ctx.lineWidth = 0.8;
      ctx.stroke();
    }

    // ── Axis titles ──
    ctx.font = '10px "Patrick Hand", cursive';
    ctx.textAlign = 'center';

    // X axis title
    ctx.fillStyle = CHART_AXIS_COLOR;
    ctx.fillText('Epoch', PAD.left + plotW / 2, H - 2);

    // Left Y title (Error)
    ctx.save();
    ctx.fillStyle = CHART_ERROR_COLOR;
    ctx.translate(10, PAD.top + plotH / 2);
    ctx.rotate(-Math.PI / 2);
    ctx.fillText('Error', 0, 0);
    ctx.restore();

    // Right Y title (Accuracy)
    ctx.save();
    ctx.fillStyle = CHART_ACCURACY_COLOR;
    ctx.translate(W - 4, PAD.top + plotH / 2);
    ctx.rotate(Math.PI / 2);
    ctx.fillText('Accuracy', 0, 0);
    ctx.restore();

    // ── Data lines ──
    if (history.length > 1) {
      // Use native canvas for smooth lines when many epochs, rough.js when few
      const useRough = history.length <= 60;

      if (useRough) {
        // Error line (hand-drawn)
        for (let i = 0; i < history.length - 1; i++) {
          rc.line(
            toX(history[i].epoch), toYError(history[i].totalError),
            toX(history[i + 1].epoch), toYError(history[i + 1].totalError),
            { stroke: CHART_ERROR_COLOR, strokeWidth: 2, roughness: 1 }
          );
        }
        // Accuracy line (hand-drawn)
        for (let i = 0; i < history.length - 1; i++) {
          rc.line(
            toX(history[i].epoch), toYAcc(history[i].accuracy),
            toX(history[i + 1].epoch), toYAcc(history[i + 1].accuracy),
            { stroke: CHART_ACCURACY_COLOR, strokeWidth: 2, roughness: 1 }
          );
        }
      } else {
        // Native canvas lines for many epochs (cleaner rendering)
        ctx.lineWidth = 2;
        ctx.lineJoin = 'round';
        ctx.lineCap = 'round';

        // Error line
        ctx.strokeStyle = CHART_ERROR_COLOR;
        ctx.beginPath();
        ctx.moveTo(toX(history[0].epoch), toYError(history[0].totalError));
        for (let i = 1; i < history.length; i++) {
          ctx.lineTo(toX(history[i].epoch), toYError(history[i].totalError));
        }
        ctx.stroke();

        // Accuracy line
        ctx.strokeStyle = CHART_ACCURACY_COLOR;
        ctx.beginPath();
        ctx.moveTo(toX(history[0].epoch), toYAcc(history[0].accuracy));
        for (let i = 1; i < history.length; i++) {
          ctx.lineTo(toX(history[i].epoch), toYAcc(history[i].accuracy));
        }
        ctx.stroke();
      }
    }
  }
}
