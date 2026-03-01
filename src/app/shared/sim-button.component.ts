import { Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-sim-button',
  imports: [RouterLink],
  template: `
    <a [routerLink]="to()" class="btn-ink btn-sm">
      &rarr; {{ label() }}
    </a>
  `,
})
export class SimButtonComponent {
  label = input('Try it in the Lab');
  to = input('/lab');
}
