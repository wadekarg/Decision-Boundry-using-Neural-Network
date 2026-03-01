import { Component, inject, effect, viewChild, ElementRef } from '@angular/core';
import { LabStoreService } from '../services/lab-store.service';
import { computeMeshgrid } from '../engine/meshgrid';
import { computeBoundaryLine } from '../engine/perceptron';
import { regionColor, BOUNDARY_COLOR, BOUNDARY_GLOW, pointFill, pointStroke, CANVAS_BG, GRID_LINE_COLOR, AXIS_COLOR, AXIS_LABEL_COLOR, TICK_LABEL_COLOR } from '../utils/notebook-colors';
import rough from 'roughjs';
import type { Point } from '../engine/types';

const SIZE = 500;
const RANGE = 10;
const GRID_RES = 50;

function worldToCanvas(x: number): number {
  return ((x + RANGE) / (2 * RANGE)) * SIZE;
}

function canvasToWorld(px: number): number {
  return (px / SIZE) * (2 * RANGE) - RANGE;
}

@Component({
  selector: 'app-decision-canvas',
  template: `
    <div class="canvas-wrapper">
      <canvas #nativeCanvas
        [width]="SIZE"
        [height]="SIZE"
        class="decision-canvas"
        (click)="onClick($event)"
        (contextmenu)="onRightClick($event)">
      </canvas>
      <canvas #roughCanvas
        [width]="SIZE"
        [height]="SIZE"
        class="rough-overlay">
      </canvas>
      <div class="canvas-hints">
        <span class="hint">Left click = +1 (green)</span>
        <span class="hint">Right click = -1 (red)</span>
      </div>
    </div>
  `,
  styles: [`
    @use 'sass:color';
    @use '../../styles/variables' as *;

    .canvas-wrapper {
      position: relative;
      width: 100%;
      aspect-ratio: 1;
    }

    .decision-canvas {
      width: 100%;
      height: 100%;
      border: 2px solid color.adjust($cream-dark, $lightness: -10%);
      border-radius: 255px 15px 225px 15px / 15px 225px 15px 255px;
      cursor: crosshair;
      background: $cream;
      position: absolute;
      top: 0;
      left: 0;
    }

    .rough-overlay {
      width: 100%;
      height: 100%;
      position: absolute;
      top: 0;
      left: 0;
      pointer-events: none;
    }

    .canvas-hints {
      position: absolute;
      bottom: 8px;
      left: 8px;
      right: 8px;
      display: flex;
      justify-content: space-between;
      pointer-events: none;
    }

    .hint {
      font-family: 'Patrick Hand', cursive;
      font-size: 0.75rem;
      color: $pencil-light;
      background: rgba($cream, 0.85);
      padding: 2px 6px;
      border-radius: 4px;
    }
  `],
})
export class DecisionCanvasComponent {
  protected SIZE = SIZE;
  private store = inject(LabStoreService);

  nativeCanvas = viewChild.required<ElementRef<HTMLCanvasElement>>('nativeCanvas');
  roughCanvas = viewChild.required<ElementRef<HTMLCanvasElement>>('roughCanvas');

  constructor() {
    effect(() => {
      this.draw();
    });
  }

  onClick(e: MouseEvent): void {
    const pt = this.eventToWorld(e);
    if (pt) this.store.addPoint({ x1: pt.x1, x2: pt.x2, label: 1 });
  }

  onRightClick(e: MouseEvent): void {
    e.preventDefault();
    const pt = this.eventToWorld(e);
    if (pt) this.store.addPoint({ x1: pt.x1, x2: pt.x2, label: -1 });
  }

  private eventToWorld(e: MouseEvent): { x1: number; x2: number } | null {
    const canvas = this.nativeCanvas().nativeElement;
    const rect = canvas.getBoundingClientRect();
    const scaleX = SIZE / rect.width;
    const scaleY = SIZE / rect.height;
    const px = (e.clientX - rect.left) * scaleX;
    const py = (e.clientY - rect.top) * scaleY;
    const x1 = Math.round(canvasToWorld(px) * 10) / 10;
    const x2 = Math.round(canvasToWorld(SIZE - py) * 10) / 10;
    return { x1, x2 };
  }

  private draw(): void {
    // Read all reactive signals
    const points = this.store.points();
    const state = this.store.perceptronState();
    const activation = this.store.activation();

    const nCanvas = this.nativeCanvas().nativeElement;
    const rCanvas = this.roughCanvas().nativeElement;
    const ctx = nCanvas.getContext('2d');
    if (!ctx) return;

    // Clear both layers
    ctx.clearRect(0, 0, SIZE, SIZE);
    const rCtx = rCanvas.getContext('2d');
    if (rCtx) rCtx.clearRect(0, 0, SIZE, SIZE);

    // ── Layer 1: Native Canvas — meshgrid regions ──
    const mesh = computeMeshgrid(state, activation, GRID_RES, -RANGE, RANGE, -RANGE, RANGE);
    const cellW = SIZE / GRID_RES;
    const cellH = SIZE / GRID_RES;
    const isHL = this.store.activationType() === 'hardLimit';

    for (let row = 0; row < GRID_RES; row++) {
      for (let col = 0; col < GRID_RES; col++) {
        const val = mesh.values[row * GRID_RES + col];
        const color = regionColor(val, isHL);
        if (color !== 'transparent') {
          ctx.fillStyle = color;
          ctx.fillRect(col * cellW, row * cellH, cellW + 0.5, cellH + 0.5);
        }
      }
    }

    // ── Layer 2: rough.js overlay ──
    const rc = rough.canvas(rCanvas);

    // Graph paper grid
    for (let i = -RANGE; i <= RANGE; i++) {
      const px = worldToCanvas(i);
      const py = SIZE - worldToCanvas(i);
      rc.line(px, 0, px, SIZE, { stroke: GRID_LINE_COLOR, strokeWidth: 0.5, roughness: 0.3 });
      rc.line(0, py, SIZE, py, { stroke: GRID_LINE_COLOR, strokeWidth: 0.5, roughness: 0.3 });
    }

    // Axes
    const ox = worldToCanvas(0);
    const oy = SIZE - worldToCanvas(0);
    rc.line(ox, 0, ox, SIZE, { stroke: AXIS_COLOR, strokeWidth: 1.5, roughness: 0.8 });
    rc.line(0, oy, SIZE, oy, { stroke: AXIS_COLOR, strokeWidth: 1.5, roughness: 0.8 });

    // Axis tick labels (native for readability)
    if (rCtx) {
      rCtx.fillStyle = TICK_LABEL_COLOR;
      rCtx.font = '10px "JetBrains Mono", monospace';
      rCtx.textAlign = 'center';
      for (let i = -RANGE; i <= RANGE; i += 2) {
        if (i === 0) continue;
        rCtx.fillText(String(i), worldToCanvas(i), oy + 12);
        rCtx.fillText(String(i), ox - 14, SIZE - worldToCanvas(i) + 3);
      }
      rCtx.fillStyle = AXIS_LABEL_COLOR;
      rCtx.font = '12px "JetBrains Mono", monospace';
      rCtx.fillText('x\u2081', SIZE - 12, oy + 16);
      rCtx.fillText('x\u2082', ox + 14, 14);
    }

    // Boundary line
    const boundary = computeBoundaryLine(state, -RANGE, RANGE);
    if (boundary) {
      const x1s = worldToCanvas(boundary.x1Start);
      const y1s = SIZE - worldToCanvas(boundary.x2Start);
      const x1e = worldToCanvas(boundary.x1End);
      const y1e = SIZE - worldToCanvas(boundary.x2End);

      // Glow (native)
      if (rCtx) {
        rCtx.strokeStyle = BOUNDARY_GLOW;
        rCtx.lineWidth = 8;
        rCtx.lineCap = 'round';
        rCtx.beginPath();
        rCtx.moveTo(x1s, y1s);
        rCtx.lineTo(x1e, y1e);
        rCtx.stroke();
      }

      // Hand-drawn boundary
      rc.line(x1s, y1s, x1e, y1e, {
        stroke: BOUNDARY_COLOR,
        strokeWidth: 2.5,
        roughness: 1.2,
      });
    }

    // Data points
    points.forEach((p: Point) => {
      const px = worldToCanvas(p.x1);
      const py = SIZE - worldToCanvas(p.x2);
      rc.circle(px, py, 12, {
        fill: pointFill(p.label),
        fillStyle: 'solid',
        stroke: pointStroke(),
        strokeWidth: 1.5,
        roughness: 0.8,
      });
    });
  }
}
