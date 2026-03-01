import { Component, input } from '@angular/core';

@Component({
  selector: 'app-callout',
  template: `
    <div [class]="'sticky-' + type()">
      <div class="sticky-label">{{ labelText() }}</div>
      <div class="sticky-body">
        <ng-content />
      </div>
    </div>
  `,
})
export class CalloutComponent {
  type = input.required<'insight' | 'think' | 'try'>();
  title = input<string>();

  labelText(): string {
    if (this.title()) return this.title()!;
    const defaults: Record<string, string> = {
      insight: 'Key Insight',
      think: 'Think About It',
      try: 'Try It',
    };
    return defaults[this.type()];
  }
}
