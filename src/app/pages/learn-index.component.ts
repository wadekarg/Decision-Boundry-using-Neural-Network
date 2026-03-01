import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { chapters } from '../content/chapters';

@Component({
  selector: 'app-learn-index',
  imports: [RouterLink],
  template: `
    <div class="toc-page lined-paper">
      <div class="toc-container">
        <!-- Back link -->
        <a routerLink="/" class="back-link">&larr; Home</a>

        <!-- Header -->
        <h1 class="toc-title">Table of Contents</h1>
        <p class="toc-subtitle">Perceptrons &amp; Decision Boundaries</p>
        <hr class="pencil-divider">

        <!-- Margin annotations -->
        <div class="margin-annotations">
          <div class="margin-label foundations">
            <span class="bracket"></span>
            <span class="label-text">Foundations</span>
          </div>
          <div class="margin-label applied">
            <span class="bracket"></span>
            <span class="label-text">Applied</span>
          </div>
        </div>

        <!-- Chapter entries -->
        <div class="toc-entries">
          @for (ch of chapters; track ch.number) {
            @if (ch.number === 3) {
              <hr class="pencil-divider section-break">
            }
            <a [routerLink]="ch.path" class="toc-entry">
              <span class="entry-number">{{ ch.number }}.</span>
              <span class="entry-title">{{ ch.title }}</span>
              <span class="dot-leader"></span>
            </a>
            <p class="entry-desc">{{ ch.description }}</p>
          }
        </div>

        <!-- Lab entry -->
        <hr class="pencil-divider">
        <a routerLink="/lab" class="lab-entry">
          <span class="star">&#x2605;</span>
          Interactive Lab -- Try it yourself &rarr;
        </a>

        <!-- Footer -->
        <div class="toc-footer">
          <a routerLink="/learn/what-is-a-perceptron" class="begin-link">Begin with Chapter 1 &rarr;</a>
          <p class="tip">Tip: Chapters build on each other. Start from the top.</p>
        </div>
      </div>
    </div>
  `,
  styles: [`
    @use 'sass:color';
    @use '../../styles/variables' as *;

    /* ── Page ── */
    .toc-page {
      min-height: calc(100vh - #{$nav-height});
      padding: 2rem 1rem;
    }

    .toc-container {
      max-width: 680px;
      margin: 0 auto;
      padding-left: 5rem;
      position: relative;
    }

    /* ── Red margin line ── */
    .toc-container::before {
      content: '';
      position: absolute;
      left: 4rem;
      top: 0;
      bottom: 0;
      width: 2px;
      background: $margin-red;
      z-index: 1;
    }

    /* ── Back link ── */
    .back-link {
      font-family: 'Patrick Hand', cursive;
      font-size: 0.9rem;
      color: $ink-blue;
      text-decoration: none;
      display: inline-block;
      margin-bottom: 1.5rem;
      &:hover { text-decoration: underline; }
    }

    /* ── Header ── */
    .toc-title {
      font-family: 'Caveat', cursive;
      font-size: 2rem;
      font-weight: 700;
      color: $ink-blue;
      transform: rotate(-0.5deg);
      margin: 0 0 0.25rem;
    }

    .toc-subtitle {
      font-family: 'Patrick Hand', cursive;
      font-size: 1.1rem;
      color: $pencil-grey;
      margin: 0 0 0.5rem;
    }

    /* ── Dividers ── */
    .pencil-divider {
      border: none;
      border-top: 1.5px dashed color.adjust($cream-dark, $lightness: -15%);
      margin: 1rem 0;
    }

    .section-break {
      margin: 1.25rem 0;
    }

    /* ── Margin annotations ── */
    .margin-annotations {
      position: absolute;
      left: 0;
      top: 0;
      bottom: 0;
      width: 3.5rem;
      pointer-events: none;

      @media (max-width: $bp-sm) {
        display: none;
      }
    }

    .margin-label {
      position: absolute;
      display: flex;
      align-items: center;
      gap: 0;
    }

    .margin-label .bracket {
      width: 10px;
      flex-shrink: 0;
      border: 1.5px solid currentColor;
      border-right: none;
      border-radius: 4px 0 0 4px;
    }

    .margin-label .label-text {
      writing-mode: vertical-rl;
      text-orientation: mixed;
      transform: rotate(180deg);
      font-family: 'Patrick Hand', cursive;
      font-size: 0.8rem;
      letter-spacing: 0.05em;
      white-space: nowrap;
    }

    .foundations {
      color: $ink-blue;
      top: 11rem;
      left: 0.25rem;

      .bracket {
        height: 80px;
      }
    }

    .applied {
      color: $green-ink;
      top: 22rem;
      left: 0.25rem;

      .bracket {
        height: 80px;
      }
    }

    /* ── TOC entries ── */
    .toc-entries {
      margin-top: 0.5rem;
    }

    .toc-entry {
      display: flex;
      align-items: baseline;
      gap: 0.5rem;
      text-decoration: none;
      color: inherit;
      padding: 0.35rem 0.5rem;
      margin: 0 -0.5rem;
      border-radius: 3px;
      transition: background 0.15s ease;

      &:hover {
        background: rgba($ink-blue, 0.04);
        text-decoration: none;
      }
    }

    .entry-number {
      font-family: 'Caveat', cursive;
      font-size: 1.3rem;
      font-weight: 700;
      color: $ink-blue;
      flex-shrink: 0;
    }

    .entry-title {
      font-family: 'Caveat', cursive;
      font-size: 1.2rem;
      font-weight: 700;
      color: $pencil-grey;
      flex-shrink: 0;
    }

    .dot-leader {
      flex: 1;
      border-bottom: 2px dotted color.adjust($pencil-light, $lightness: 15%);
      min-width: 2rem;
      margin-bottom: 0.3em;
    }

    .entry-desc {
      font-family: 'Patrick Hand', cursive;
      font-size: 0.88rem;
      color: $pencil-light;
      margin: 0 0 0.75rem;
      padding-left: 2rem;
      line-height: 1.4;
    }

    /* ── Lab entry ── */
    .lab-entry {
      display: inline-block;
      font-family: 'Caveat', cursive;
      font-size: 1.15rem;
      font-weight: 700;
      color: $ink-blue;
      text-decoration: none;
      padding: 0.25rem 0;
      transition: color 0.15s ease;

      &:hover {
        color: $ink-blue-light;
        text-decoration: none;
      }
    }

    .star {
      color: $yellow-marker;
      margin-right: 0.25rem;
    }

    /* ── Footer ── */
    .toc-footer {
      margin-top: 2rem;
      padding-top: 0.5rem;
    }

    .begin-link {
      font-family: 'Patrick Hand', cursive;
      font-size: 1.1rem;
      color: $ink-blue;
      text-decoration: none;
      &:hover { text-decoration: underline; }
    }

    .tip {
      font-family: 'Patrick Hand', cursive;
      font-size: 0.85rem;
      color: $pencil-light;
      margin-top: 0.5rem;
    }

    /* ── Responsive ── */
    @media (max-width: $bp-sm) {
      .toc-container {
        padding-left: 1.5rem;
      }

      .toc-container::before {
        display: none;
      }

      .entry-desc {
        padding-left: 1.5rem;
      }
    }
  `],
})
export class LearnIndexComponent {
  chapters = chapters;
}
