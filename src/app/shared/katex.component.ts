import { Component, input, effect, ElementRef, viewChild } from '@angular/core';
import katex from 'katex';

@Component({
  selector: 'app-katex',
  template: `<span #container [class]="inline() ? 'katex-inline' : 'katex-block'"></span>`,
  styles: [`
    .katex-inline {
      display: inline-block;
      vertical-align: middle;
      margin: 0 2px;
    }
    .katex-block {
      display: block;
      margin: 0.75rem 0;
      overflow-x: auto;
    }
  `],
})
export class KatexComponent {
  tex = input.required<string>();
  inline = input(false);

  container = viewChild.required<ElementRef<HTMLSpanElement>>('container');

  constructor() {
    effect(() => {
      const el = this.container().nativeElement;
      const texStr = this.tex();
      const isInline = this.inline();
      katex.render(texStr, el, { throwOnError: false, displayMode: !isInline });
    });
  }
}
