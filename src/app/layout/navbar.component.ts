import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-navbar',
  imports: [RouterLink],
  template: `
    <nav class="navbar">
      <div class="navbar-inner">
        <a routerLink="/" class="logo">
          <!-- icon removed -->
          <span class="logo-text">The Perceptron in Training</span>
          <span class="logo-text-short">P-Lab</span>
        </a>

        <div class="nav-links">
        </div>
      </div>
    </nav>
  `,
  styles: [`
    @use 'sass:color';
    @use '../../styles/variables' as *;

    .navbar {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      z-index: 100;
      height: $nav-height;
      background: rgba($cream-dark, 0.92);
      backdrop-filter: blur(8px);
      border-bottom: 2px solid color.adjust($cream-dark, $lightness: -10%);
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
    }

    .navbar-inner {
      max-width: $bp-xl;
      margin: 0 auto;
      padding: 0 1.5rem;
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: space-between;
    }

    .logo {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      text-decoration: none;
      color: $pencil-grey;
    }

    .logo-icon {
      display: none;
    }

    .logo-text {
      font-family: 'Caveat', cursive;
      font-weight: 700;
      font-size: 1.4rem;
      color: $ink-blue;
    }

    .logo-text-short {
      display: none;
      font-family: 'Caveat', cursive;
      font-weight: 700;
      font-size: 1.4rem;
      color: $ink-blue;
    }

    @media (max-width: $bp-sm) {
      .logo-text { display: none; }
      .logo-text-short { display: inline; }
    }

    .nav-links {
      display: flex;
      gap: 0.25rem;
    }

    .nav-link {
      padding: 0.4rem 0.85rem;
      font-family: 'Patrick Hand', cursive;
      font-size: 1.05rem;
      color: $pencil-light;
      text-decoration: none;
      border-radius: 8px;
      transition: all 0.15s ease;

      &:hover {
        color: $pencil-grey;
        background: rgba($ink-blue, 0.08);
        text-decoration: none;
      }

      &.active {
        color: $ink-blue;
        background: rgba($ink-blue, 0.12);
        font-weight: 700;
      }
    }
  `],
})
export class NavbarComponent {}
