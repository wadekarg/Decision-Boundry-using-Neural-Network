import { Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-chapter-nav',
  imports: [RouterLink],
  template: `
    <div class="chapter-nav">
      @if (prev(); as p) {
        <a [routerLink]="p.path" class="nav-prev">&larr; {{ p.label }}</a>
      } @else {
        <div></div>
      }
      <a routerLink="/learn" class="nav-all">All Chapters</a>
      @if (next(); as n) {
        <a [routerLink]="n.path" class="nav-next">{{ n.label }} &rarr;</a>
      } @else {
        <div></div>
      }
    </div>
  `,
  styles: [`
    @use '../../styles/variables' as *;

    .chapter-nav {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-top: 2.5rem;
      padding-top: 1.5rem;
      border-top: 1.5px dashed rgba($pencil-light, 0.3);
    }

    a {
      font-family: 'Patrick Hand', cursive;
      text-decoration: none;
      color: $ink-blue;
      &:hover { text-decoration: underline; }
    }

    .nav-prev, .nav-next {
      font-size: 0.95rem;
    }

    .nav-all {
      font-size: 0.8rem;
      color: $pencil-light;
      &:hover { color: $pencil-grey; }
    }
  `],
})
export class ChapterNavComponent {
  prev = input<{ path: string; label: string } | null>(null);
  next = input<{ path: string; label: string } | null>(null);
}
