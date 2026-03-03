import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TrainingService } from '../services/training.service';
import { DecisionCanvasComponent } from './decision-canvas.component';
import { WeightSlidersComponent } from './weight-sliders.component';
import { ActivationSelectorComponent } from './activation-selector.component';
import { DatasetSelectorComponent } from './dataset-selector.component';
import { PlaybackControlsComponent } from './playback-controls.component';
import { MathPanelComponent } from './math-panel.component';
import { StepBreakdownComponent } from './step-breakdown.component';
import { TrainingChartComponent } from './training-chart.component';

@Component({
  selector: 'app-lab-page',
  imports: [
    RouterLink,
    DecisionCanvasComponent,
    WeightSlidersComponent,
    ActivationSelectorComponent,
    DatasetSelectorComponent,
    PlaybackControlsComponent,
    MathPanelComponent,
    StepBreakdownComponent,
    TrainingChartComponent,
  ],
  template: `
    <div class="container lab-container">
      <!-- Intro: diagram + description -->
      <div class="lab-intro">
        <div class="intro-diagram">
          <svg viewBox="0 0 360 160" class="perceptron-svg" aria-label="Perceptron diagram">
            <circle cx="50" cy="30" r="16" class="node-input" />
            <text x="50" y="35" class="svg-label label-grey">x&#x2081;</text>
            <circle cx="50" cy="80" r="16" class="node-input" />
            <text x="50" y="85" class="svg-label label-grey">x&#x2082;</text>
            <circle cx="50" cy="130" r="14" class="node-bias" />
            <text x="50" y="135" class="svg-label label-light">b</text>
            <line x1="66" y1="30" x2="155" y2="72" class="conn" />
            <line x1="66" y1="80" x2="155" y2="80" class="conn" />
            <line x1="64" y1="130" x2="155" y2="88" class="conn-bias" />
            <text x="100" y="44" class="svg-label label-red">w&#x2081;</text>
            <text x="100" y="74" class="svg-label label-red">w&#x2082;</text>
            <circle cx="175" cy="80" r="20" class="node-sum" />
            <text x="175" y="87" class="svg-label label-blue" style="font-size:18px">&#x3A3;</text>
            <line x1="195" y1="80" x2="240" y2="80" class="arrow-line" />
            <polygon points="237,74 247,80 237,86" class="arrow-head" />
            <rect x="248" y="62" width="36" height="36" rx="4" class="box-act" />
            <text x="266" y="85" class="svg-label label-green" style="font-size:16px">f</text>
            <line x1="284" y1="80" x2="318" y2="80" class="arrow-line" />
            <polygon points="315,74 325,80 315,86" class="arrow-head" />
            <rect x="326" y="64" width="30" height="32" rx="4" class="box-out" />
            <text x="341" y="85" class="svg-label label-yellow">y&#x0302;</text>
          </svg>
        </div>
        <div class="intro-text">
          <h1><span class="text-ink">The Perceptron</span></h1>
          <p class="intro-desc">
            A perceptron takes inputs (x), multiplies each by a weight (w), adds a bias (b),
            passes the sum through an activation function (f), and outputs a prediction.
            This simple model can learn to classify data by adjusting its weights.
          </p>
          <p class="intro-action">
            Click the canvas to add data points, adjust weights, choose an activation function, and hit train.
          </p>
          <a routerLink="/learn" class="learn-btn">Learn the theory &rarr;</a>
        </div>
      </div>

      <!-- Grid layout -->
      <div class="lab-grid">
        <!-- Left sidebar: controls + live math -->
        <div class="lab-sidebar-left">
          <app-weight-sliders />
          <app-activation-selector />
          <app-dataset-selector />
          <app-playback-controls />
          <app-math-panel />
        </div>

        <!-- Center: canvas + chart -->
        <div class="lab-center">
          <app-decision-canvas />
          <app-training-chart />
        </div>

        <!-- Right sidebar: training breakdown -->
        <div class="lab-sidebar-right">
          <app-step-breakdown />
        </div>
      </div>
    </div>
  `,
  styles: [`
    @use '../../styles/variables' as *;

    @use 'sass:color';

    .lab-container {
      padding-top: 1.5rem;
      padding-bottom: 2rem;
    }

    .lab-intro {
      display: flex;
      align-items: center;
      gap: 2rem;
      margin-bottom: 1.5rem;
      padding: 1.5rem;
      background: $cream-dark;
      border: 1.5px solid color.adjust($cream-dark, $lightness: -8%);
      border-radius: 6px;
      box-shadow: $shadow-sm;
    }

    .intro-diagram {
      flex-shrink: 0;
      width: 280px;
    }

    .perceptron-svg { width: 100%; height: auto; }
    .perceptron-svg .svg-label { font-family: 'Patrick Hand', cursive; font-size: 14px; text-anchor: middle; }
    .label-grey { fill: $pencil-grey; }
    .label-light { fill: $pencil-light; }
    .label-red { fill: $red-pen; }
    .label-blue { fill: $ink-blue; }
    .label-green { fill: $green-ink; }
    .label-yellow { fill: color.adjust($yellow-marker, $lightness: -15%); }
    .node-input { fill: none; stroke: $pencil-grey; stroke-width: 2; stroke-dasharray: 4 2; }
    .node-bias { fill: none; stroke: $pencil-grey; stroke-width: 1.5; stroke-dasharray: 3 3; }
    .conn { stroke: $pencil-grey; stroke-width: 1.5; stroke-dasharray: 6 3; }
    .conn-bias { stroke: $pencil-light; stroke-width: 1; stroke-dasharray: 4 4; }
    .node-sum { fill: rgba($ink-blue, 0.08); stroke: $ink-blue; stroke-width: 2; }
    .arrow-line { stroke: $pencil-grey; stroke-width: 1.5; }
    .arrow-head { fill: $pencil-grey; }
    .box-act { fill: rgba($green-ink, 0.1); stroke: $green-ink; stroke-width: 2; }
    .box-out { fill: rgba($yellow-marker, 0.15); stroke: $yellow-marker; stroke-width: 2; }

    .intro-text {
      flex: 1;
      min-width: 0;

      h1 { font-size: 1.8rem; margin-bottom: 0.5rem; }
    }

    .intro-desc {
      font-family: 'Patrick Hand', cursive;
      font-size: 0.95rem;
      color: $pencil-light;
      line-height: 1.5;
      margin-bottom: 0.5rem;
    }

    .intro-action {
      font-family: 'Patrick Hand', cursive;
      font-size: 0.9rem;
      color: $pencil-grey;
      margin-bottom: 0.75rem;
    }

    .learn-btn {
      display: inline-block;
      font-family: 'Patrick Hand', cursive;
      font-size: 0.95rem;
      color: $ink-blue;
      text-decoration: none;
      padding: 0.35rem 1rem;
      border: 1.5px solid $ink-blue;
      border-radius: 6px;
      transition: background 0.15s ease, color 0.15s ease;

      &:hover {
        background: rgba($ink-blue, 0.08);
        text-decoration: none;
      }
    }

    @media (max-width: $bp-md) {
      .lab-intro {
        flex-direction: column;
        gap: 1rem;
        text-align: center;
      }
      .intro-diagram { width: 220px; }
    }

    .lab-grid {
      display: grid;
      grid-template-columns: 1fr;
      gap: 1rem;
    }

    @media (min-width: $bp-lg) {
      .lab-grid {
        grid-template-columns: 250px 1fr 320px;
      }
    }

    .lab-sidebar-left,
    .lab-sidebar-right {
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
    }

    .lab-center {
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
    }
  `],
})
export class LabPageComponent {
  // Inject training service to activate the timer loop
  private training = inject(TrainingService);
}
