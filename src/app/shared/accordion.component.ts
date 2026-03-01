import { Component, input, signal } from '@angular/core';

@Component({
  selector: 'app-accordion',
  template: `
    <div class="accordion" [class.open]="open()">
      <button class="accordion-header" (click)="toggle()">
        <span class="hand-circle">{{ number() }}</span>
        <span class="accordion-title">{{ title() }}</span>
        <span class="accordion-arrow" [class.rotated]="open()">&#9662;</span>
      </button>
      <div class="accordion-body" [class.expanded]="open()">
        <div class="accordion-content">
          <ng-content />
        </div>
      </div>
    </div>
  `,
  styles: [`
    @use 'sass:color';
    @use '../../styles/variables' as *;

    .accordion {
      background: $cream-dark;
      border: 1.5px solid color.adjust($cream-dark, $lightness: -8%);
      border-radius: $sketch-radius;
      overflow: hidden;
      box-shadow: $shadow-sm;
    }

    .accordion-header {
      width: 100%;
      display: flex;
      align-items: center;
      gap: 0.75rem;
      padding: 1rem 1.25rem;
      background: transparent;
      border: none;
      cursor: pointer;
      text-align: left;
      transition: background 0.15s ease;

      &:hover {
        background: rgba($ink-blue, 0.04);
      }
    }

    .accordion-title {
      flex: 1;
      font-family: 'Caveat', cursive;
      font-size: 1.3rem;
      font-weight: 700;
      color: $pencil-grey;
    }

    .accordion-arrow {
      color: $pencil-light;
      font-size: 1.2rem;
      transition: transform 0.3s ease;

      &.rotated {
        transform: rotate(180deg);
      }
    }

    .accordion-body {
      max-height: 0;
      overflow: hidden;
      transition: max-height 0.35s ease;

      &.expanded {
        max-height: 3000px;
      }
    }

    .accordion-content {
      padding: 0.5rem 1.25rem 1.25rem;
      font-family: 'Patrick Hand', cursive;
      font-size: 1rem;
      line-height: 1.65;
      color: $pencil-grey;
    }
  `],
})
export class AccordionComponent {
  title = input.required<string>();
  number = input.required<number>();
  defaultOpen = input(false);

  open = signal(false);

  ngOnInit(): void {
    this.open.set(this.defaultOpen());
  }

  toggle(): void {
    this.open.update(v => !v);
  }
}
