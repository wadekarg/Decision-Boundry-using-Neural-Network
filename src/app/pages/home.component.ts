import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-home',
  imports: [RouterLink],
  template: `
    <div class="cover-page">
      <!-- The Notebook -->
      <div class="notebook-cover">
        <!-- Title label -->
        <div class="title-label">
          <h1 class="title">The Perceptron Lab</h1>
          <p class="tagline">"The Perceptron in Training"</p>
        </div>

        <!-- Perceptron diagram -->
        <div class="diagram-area">
          <svg viewBox="0 0 360 160" class="perceptron-svg" aria-label="Perceptron diagram">
            <!-- Input nodes -->
            <circle cx="50" cy="30" r="16" class="node-input" />
            <text x="50" y="35" class="label-input">x&#x2081;</text>

            <circle cx="50" cy="80" r="16" class="node-input" />
            <text x="50" y="85" class="label-input">x&#x2082;</text>

            <circle cx="50" cy="130" r="14" class="node-bias" />
            <text x="50" y="135" class="label-bias">b</text>

            <!-- Connection lines -->
            <line x1="66" y1="30" x2="155" y2="72" class="conn" />
            <line x1="66" y1="80" x2="155" y2="80" class="conn" />
            <line x1="64" y1="130" x2="155" y2="88" class="conn-bias" />

            <!-- Weight labels -->
            <text x="100" y="44" class="label-weight">w&#x2081;</text>
            <text x="100" y="74" class="label-weight">w&#x2082;</text>

            <!-- Summation node -->
            <circle cx="175" cy="80" r="20" class="node-sum" />
            <text x="175" y="87" class="label-sum">&#x3A3;</text>

            <!-- Arrow to activation -->
            <line x1="195" y1="80" x2="240" y2="80" class="arrow-line" />
            <polygon points="237,74 247,80 237,86" class="arrow-head" />

            <!-- Activation box -->
            <rect x="248" y="62" width="36" height="36" rx="4" class="box-activation" />
            <text x="266" y="85" class="label-activation">f</text>

            <!-- Arrow to output -->
            <line x1="284" y1="80" x2="318" y2="80" class="arrow-line" />
            <polygon points="315,74 325,80 315,86" class="arrow-head-out" />

            <!-- Output -->
            <rect x="326" y="64" width="30" height="32" rx="4" class="box-output" />
            <text x="341" y="85" class="label-output">y&#x0302;</text>
          </svg>
        </div>

        <!-- Sticky notes -->
        <div class="sticky-nav-desktop">
          <a routerLink="/learn" class="sticky-btn sticky-blue">
            <span class="sticky-tape"></span>
            <span class="sticky-text">Start<br>Learning</span>
            <span class="sticky-arrow">&rarr;</span>
          </a>
          <a routerLink="/lab" class="sticky-btn sticky-green">
            <span class="sticky-tape"></span>
            <span class="sticky-text">Open the<br>Lab</span>
            <span class="sticky-arrow">&rarr;</span>
          </a>
        </div>

        <!-- Course info lines -->
        <div class="course-info">
          <div class="info-line">
            <span class="info-label">Subject:</span>
            <span class="info-value">Neural Networks</span>
          </div>
          <div class="info-line">
            <span class="info-label">Professor:</span>
            <span class="info-value">Dr. Farhad Kamangar</span>
          </div>
          <div class="info-line">
            <span class="info-label">School:</span>
            <span class="info-value">UT Arlington</span>
          </div>
          <div class="info-line">
            <span class="info-label">Name:</span>
            <span class="info-value">Gajanan Wadekar</span>
          </div>
        </div>
      </div>

      <!-- Mobile sticky nav -->
      <div class="sticky-nav-mobile">
        <a routerLink="/learn" class="mobile-btn mobile-blue">Start Learning &rarr;</a>
        <a routerLink="/lab" class="mobile-btn mobile-green">Open the Lab &rarr;</a>
      </div>

      <!-- Footer -->
      <div class="cover-footer">
        <span>Runs in your browser.</span>
        <span class="dot">&middot;</span>
        <a href="https://www.linkedin.com/in/gajananwadekar/" target="_blank" rel="noopener noreferrer">LinkedIn</a>
        <span class="dot">&middot;</span>
        <a href="https://github.com/wadekarg" target="_blank" rel="noopener noreferrer">GitHub</a>
      </div>
    </div>
  `,
  styles: [`
    @use 'sass:color';
    @use '../../styles/variables' as *;

    .cover-page {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      min-height: calc(100vh - #{$nav-height});
      padding: 2rem 1rem;
    }

    .notebook-cover {
      position: relative;
      max-width: 520px;
      width: 100%;
      aspect-ratio: 3 / 4;
      background: $cream-dark;
      border: 3px solid $pencil-grey;
      border-radius: 4px;
      box-shadow: $shadow-lg;
      padding: 2.5rem 2.5rem 2rem;
      display: flex;
      flex-direction: column;

        &::before {
        content: '';
        position: absolute;
        inset: 0;
        border-radius: 4px;
        opacity: 0.12;
        pointer-events: none;
        background-image:
          radial-gradient(circle 2px, $pencil-grey 50%, transparent 50%),
          radial-gradient(circle 3px, $pencil-grey 50%, transparent 50%),
          radial-gradient(circle 1px, $pencil-grey 50%, transparent 50%);
        background-size: 47px 53px, 71px 67px, 37px 41px;
        background-position: 3px 7px, 19px 11px, 31px 23px;
      }
    }

    .title-label {
      background: #fff;
      border: 2px solid $pencil-grey;
      border-radius: 2px;
      padding: 0.75rem 1.5rem;
      text-align: center;
      margin-bottom: 1.5rem;
      position: relative;
      z-index: 1;
    }

    .title {
      font-family: 'Caveat', cursive;
      font-size: 2rem;
      font-weight: 700;
      color: $pencil-grey;
      margin: 0;
      line-height: 1.2;
    }

    .tagline {
      font-family: 'Patrick Hand', cursive;
      font-size: 1.1rem;
      color: $ink-blue;
      margin: 0.25rem 0 0;
      transform: rotate(-1deg);
    }

    .diagram-area {
      flex: 1;
      display: flex;
      align-items: center;
      justify-content: center;
      position: relative;
      z-index: 1;
      min-height: 0;
    }

    .perceptron-svg {
      width: 100%;
      max-width: 360px;
      height: auto;
    }

    .perceptron-svg text {
      font-family: 'Patrick Hand', cursive;
      text-anchor: middle;
    }

    .node-input { fill: none; stroke: $pencil-grey; stroke-width: 2; stroke-dasharray: 4 2; }
    .node-bias { fill: none; stroke: $pencil-grey; stroke-width: 1.5; stroke-dasharray: 3 3; }
    .label-input { font-size: 14px; fill: $pencil-grey; }
    .label-bias { font-size: 13px; fill: $pencil-light; }
    .conn { stroke: $pencil-grey; stroke-width: 1.5; stroke-dasharray: 6 3; }
    .conn-bias { stroke: $pencil-light; stroke-width: 1; stroke-dasharray: 4 4; }
    .label-weight { font-size: 12px; fill: $red-pen; }
    .node-sum { fill: rgba($ink-blue, 0.08); stroke: $ink-blue; stroke-width: 2; }
    .label-sum { font-size: 18px; fill: $ink-blue; }
    .arrow-line { stroke: $pencil-grey; stroke-width: 1.5; }
    .arrow-head, .arrow-head-out { fill: $pencil-grey; }
    .box-activation { fill: rgba($green-ink, 0.1); stroke: $green-ink; stroke-width: 2; }
    .label-activation { font-size: 16px; fill: $green-ink; }
    .box-output { fill: rgba($yellow-marker, 0.15); stroke: $yellow-marker; stroke-width: 2; }
    .label-output { font-size: 14px; fill: color.adjust($yellow-marker, $lightness: -15%); }

    .sticky-nav-desktop {
      position: absolute;
      right: -60px;
      top: 38%;
      display: flex;
      flex-direction: column;
      gap: 1rem;
      z-index: 2;
      @media (max-width: $bp-sm) { display: none; }
    }

    .sticky-btn {
      position: relative;
      display: flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.75rem 1rem;
      border-radius: 2px;
      box-shadow: 2px 3px 8px rgba(0,0,0,0.1);
      text-decoration: none;
      color: inherit;
      width: 120px;
      transition: transform 0.15s ease, box-shadow 0.15s ease;
      &:hover { transform: translateY(-2px); box-shadow: 3px 5px 12px rgba(0,0,0,0.14); text-decoration: none; }
    }

    .sticky-tape {
      position: absolute;
      top: -6px;
      left: 50%;
      transform: translateX(-50%) rotate(1deg);
      width: 48px;
      height: 12px;
      background: rgba(255,255,200,0.7);
      border: 1px solid rgba(200,200,150,0.4);
    }

    .sticky-blue {
      background: color.adjust($ink-blue, $lightness: 48%);
      border-left: 4px solid $ink-blue;
      transform: rotate(2deg);
      color: $ink-blue;
    }

    .sticky-green {
      background: color.adjust($green-ink, $lightness: 48%);
      border-left: 4px solid $green-ink;
      transform: rotate(-1deg);
      color: $green-ink;
    }

    .sticky-text { font-family: 'Patrick Hand', cursive; font-size: 0.9rem; line-height: 1.3; }
    .sticky-arrow { font-size: 1.1rem; margin-left: auto; }

    .sticky-nav-mobile {
      display: none;
      gap: 0.75rem;
      margin-top: 1.25rem;
      width: 100%;
      max-width: 520px;
      @media (max-width: $bp-sm) { display: flex; }
    }

    .mobile-btn {
      flex: 1;
      text-align: center;
      padding: 0.75rem 1rem;
      border-radius: 2px;
      font-family: 'Patrick Hand', cursive;
      font-size: 1rem;
      text-decoration: none;
      box-shadow: 2px 3px 8px rgba(0, 0, 0, 0.08);
      transition: transform 0.15s ease;
      &:hover { transform: translateY(-2px); text-decoration: none; }
    }

    .mobile-blue { background: color.adjust($ink-blue, $lightness: 48%); border: 2px solid $ink-blue; color: $ink-blue; }
    .mobile-green { background: color.adjust($green-ink, $lightness: 48%); border: 2px solid $green-ink; color: $green-ink; }

    .course-info { margin-top: auto; position: relative; z-index: 1; padding-top: 0.5rem; }
    .info-line { display: flex; align-items: baseline; gap: 0.5rem; padding: 0.3rem 0; border-bottom: 1.5px solid rgba($ink-blue, 0.2); }
    .info-label { font-family: 'Inter', sans-serif; font-size: 0.7rem; text-transform: uppercase; color: $pencil-light; letter-spacing: 0.04em; flex-shrink: 0; }
    .info-value { font-family: 'Patrick Hand', cursive; font-size: 1rem; color: $ink-blue; }

    .cover-footer {
      margin-top: 1.5rem;
      font-family: 'Patrick Hand', cursive;
      font-size: 0.85rem;
      color: $pencil-light;
      text-align: center;
      a { color: $ink-blue; text-decoration: none; &:hover { text-decoration: underline; } }
      .dot { margin: 0 0.25rem; }
    }

    @media (max-width: $bp-sm) {
      .notebook-cover {
        aspect-ratio: auto;
        min-height: 520px;
        padding: 2rem 1.5rem 1.5rem;
      }
    }
  `],
})
export class HomeComponent {}
