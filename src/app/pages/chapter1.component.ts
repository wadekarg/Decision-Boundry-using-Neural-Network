import { Component, signal, effect, viewChild, ElementRef, computed } from '@angular/core';
import { AccordionComponent } from '../shared/accordion.component';
import { CalloutComponent } from '../shared/callout.component';
import { KatexComponent } from '../shared/katex.component';
import { ChapterNavComponent } from '../shared/chapter-nav.component';
import { SimButtonComponent } from '../shared/sim-button.component';
import { ACTIVATIONS } from '../engine/activations';
import katex from 'katex';

@Component({
  selector: 'app-chapter1',
  imports: [AccordionComponent, CalloutComponent, KatexComponent, ChapterNavComponent, SimButtonComponent],
  template: `
    <div class="container-md learn-chapter">
      <!-- Header -->
      <div class="ch-header">
        <a href="#/learn" class="back-link">&larr; All Chapters</a>
        <p class="section-label">Chapter 1</p>
        <h1>What is a Perceptron?</h1>
        <p class="ch-subtitle font-body">
          The simplest neural network — a single neuron that takes in numbers, multiplies them by
          weights, and outputs a decision. It's the building block of deep learning.
        </p>
        <div class="tag-row">
          <span class="tag">5 sections</span>
          <span class="tag">Interactive widgets</span>
          <span class="tag">No prerequisites</span>
        </div>
      </div>

      <div class="sections">
        <!-- SECTION 1 -->
        <app-accordion [number]="1" title="The Biological Inspiration" [defaultOpen]="true">
          <p class="font-body">
            The perceptron was inspired by how biological neurons work. A neuron in your brain receives
            electrical signals from other neurons through <strong>dendrites</strong>. If the combined signal
            is strong enough, the neuron <strong>fires</strong> — sending a signal down its <strong>axon</strong>
            to other neurons.
          </p>
          <p class="font-body">
            Frank Rosenblatt proposed the perceptron in 1958 as a mathematical model of this process.
            Instead of electrical signals, we use <strong>numbers</strong>. Instead of synaptic
            strength, we use <strong>weights</strong>. And instead of "fire or not fire", we use an
            <strong>activation function</strong>.
          </p>

          <!-- Animated Comparison Diagrams -->
          <div class="neuron-compare">
            <div class="neuron-compare__col">
              <h3 class="neuron-compare__title neuron-compare__title--blue">Biological Neuron</h3>
              <svg class="neuron-svg" viewBox="0 0 420 170" xmlns="http://www.w3.org/2000/svg">
                <!-- Dendrite tree -->
                <path class="bio-dendrite" d="M 115,55 C 90,42 65,25 35,15" />
                <path class="bio-dendrite bio-dendrite--sub" d="M 65,25 C 52,12 30,5 10,10" />
                <path class="bio-dendrite bio-dendrite--sub" d="M 78,32 C 62,40 42,50 25,46" />
                <path class="bio-dendrite" d="M 112,68 C 85,60 55,55 20,62" />
                <path class="bio-dendrite bio-dendrite--sub" d="M 55,55 C 42,42 25,38 10,44" />
                <path class="bio-dendrite" d="M 108,82 C 76,82 46,84 12,80" />
                <path class="bio-dendrite bio-dendrite--sub" d="M 46,84 C 34,72 20,66 6,72" />
                <path class="bio-dendrite bio-dendrite--sub" d="M 52,83 C 38,94 22,102 8,100" />
                <path class="bio-dendrite" d="M 112,96 C 85,104 55,110 22,105" />
                <path class="bio-dendrite bio-dendrite--sub" d="M 55,110 C 42,122 28,130 14,126" />
                <path class="bio-dendrite" d="M 115,108 C 90,120 65,140 35,150" />
                <path class="bio-dendrite bio-dendrite--sub" d="M 65,140 C 50,152 30,158 12,154" />
                <path class="bio-dendrite bio-dendrite--sub" d="M 74,132 C 58,125 40,122 25,130" />
                <!-- Cell body (soma) — organic blob -->
                <path class="bio-soma" d="M 115,48 C 120,35 138,28 156,32 C 174,36 182,52 180,72 C 178,88 175,104 170,112 C 163,122 148,128 132,126 C 118,124 110,116 108,100 C 105,85 108,62 115,48 Z" />
                <!-- Nucleus -->
                <circle class="bio-nucleus" cx="148" cy="80" r="14" />
                <!-- Axon (thin line through myelin) -->
                <line class="bio-axon" x1="180" y1="82" x2="345" y2="82" />
                <!-- Myelin sheath segments -->
                <rect class="bio-myelin bio-myelin--1" x="190" y="72" width="28" height="20" rx="10" />
                <rect class="bio-myelin bio-myelin--2" x="226" y="72" width="28" height="20" rx="10" />
                <rect class="bio-myelin bio-myelin--3" x="262" y="72" width="28" height="20" rx="10" />
                <rect class="bio-myelin bio-myelin--4" x="298" y="72" width="28" height="20" rx="10" />
                <!-- Axon terminals -->
                <path class="bio-terminal" d="M 345,82 C 360,68 370,52 380,42" />
                <path class="bio-terminal" d="M 345,82 C 362,78 376,72 390,68" />
                <path class="bio-terminal" d="M 345,82 C 360,96 370,110 380,122" />
                <path class="bio-terminal" d="M 345,82 C 356,90 366,98 375,104" />
                <!-- Synaptic boutons -->
                <circle class="bio-bouton" cx="380" cy="42" r="5" />
                <circle class="bio-bouton" cx="390" cy="68" r="5" />
                <circle class="bio-bouton" cx="380" cy="122" r="5" />
                <circle class="bio-bouton" cx="375" cy="104" r="4" />
                <!-- Labels -->
                <text class="svg-label" x="5" y="165">Dendrites</text>
                <text class="svg-label svg-label--soma" x="148" y="84" text-anchor="middle">Soma</text>
                <text class="svg-label" x="238" y="64">Axon</text>
              </svg>
            </div>
            <div class="neuron-compare__col">
              <h3 class="neuron-compare__title neuron-compare__title--green">Perceptron</h3>
              <svg class="neuron-svg" viewBox="0 0 420 170" xmlns="http://www.w3.org/2000/svg">
                <!-- Weight connections (base) -->
                <line class="perc-path" x1="59" y1="32" x2="173" y2="80" />
                <line class="perc-path" x1="59" y1="85" x2="173" y2="85" />
                <line class="perc-path" x1="59" y1="138" x2="173" y2="90" />
                <!-- Weight pulse overlays -->
                <line class="perc-pulse perc-pulse--w1" x1="59" y1="32" x2="173" y2="80" />
                <line class="perc-pulse perc-pulse--w2" x1="59" y1="85" x2="173" y2="85" />
                <line class="perc-pulse perc-pulse--w3" x1="59" y1="138" x2="173" y2="90" />
                <!-- Input nodes -->
                <circle class="perc-node perc-node--input" cx="42" cy="32" r="17" />
                <circle class="perc-node perc-node--input" cx="42" cy="85" r="17" />
                <circle class="perc-node perc-node--input perc-node--bias" cx="42" cy="138" r="17" />
                <text class="perc-text" x="42" y="37" text-anchor="middle">x&#x2081;</text>
                <text class="perc-text" x="42" y="90" text-anchor="middle">x&#x2082;</text>
                <text class="perc-text" x="42" y="143" text-anchor="middle">b</text>
                <!-- Weight labels -->
                <text class="perc-wlabel" x="110" y="46">w&#x2081;</text>
                <text class="perc-wlabel" x="114" y="78">w&#x2082;</text>
                <!-- Sigma node -->
                <circle class="perc-node perc-node--sigma" cx="193" cy="85" r="21" />
                <text class="perc-text perc-text--sigma" x="193" y="92" text-anchor="middle">&#x3A3;</text>
                <!-- Connection: sigma to activation -->
                <line class="perc-path" x1="214" y1="85" x2="272" y2="85" />
                <line class="perc-pulse perc-pulse--conn" x1="214" y1="85" x2="272" y2="85" />
                <!-- Activation box -->
                <rect class="perc-node perc-node--act" x="272" y="64" width="48" height="42" rx="6" />
                <text class="perc-text" x="296" y="90" text-anchor="middle">f</text>
                <!-- Connection: activation to output -->
                <line class="perc-path" x1="320" y1="85" x2="363" y2="85" />
                <line class="perc-pulse perc-pulse--out" x1="320" y1="85" x2="363" y2="85" />
                <!-- Output node -->
                <circle class="perc-node perc-node--output" cx="380" cy="85" r="17" />
                <text class="perc-text" x="380" y="90" text-anchor="middle">&#x177;</text>
              </svg>
            </div>
          </div>

          <div class="two-col-sm">
            <div class="info-card blue">
              <h3>Biological Neuron</h3>
              <ul>
                <li>Dendrites receive signals</li>
                <li>Synapses have different strengths</li>
                <li>Cell body sums the signals</li>
                <li>Fires if sum exceeds threshold</li>
              </ul>
            </div>
            <div class="info-card green">
              <h3>Perceptron</h3>
              <ul>
                <li>Inputs (x1, x2, ...) receive data</li>
                <li>Weights (w1, w2, ...) control importance</li>
                <li>Summation computes net input</li>
                <li>Activation function decides output</li>
              </ul>
            </div>
          </div>

          <div class="neuron-legend">
            <span>Dendrites = Inputs</span>
            <span class="legend-sep">|</span>
            <span>Synapses = Weights</span>
            <span class="legend-sep">|</span>
            <span>Soma = Summation</span>
            <span class="legend-sep">|</span>
            <span>Axon firing = Activation</span>
          </div>

          <app-callout type="insight">
            The perceptron is a <strong>massive simplification</strong> of a real neuron. Real neurons
            have complex timing, chemical processes, and network effects. But this simple model is
            powerful enough to classify data and forms the foundation of modern neural networks.
          </app-callout>
        </app-accordion>

        <!-- SECTION 2 -->
        <app-accordion [number]="2" title="The Mathematical Model">
          <p class="font-body">A perceptron with two inputs computes:</p>
          <app-katex tex="n = w_1 x_1 + w_2 x_2 + b" />
          <app-katex tex="\\hat{y} = f(n)" />
          <p class="font-body">Where:</p>
          <ul class="font-body var-list">
            <li><app-katex tex="x_1, x_2" [inline]="true" /> are the <strong>inputs</strong> (data features)</li>
            <li><app-katex tex="w_1, w_2" [inline]="true" /> are the <strong>weights</strong> (learnable parameters)</li>
            <li><app-katex tex="b" [inline]="true" /> is the <strong>bias</strong> (shifts the decision)</li>
            <li><app-katex tex="n" [inline]="true" /> is the <strong>net input</strong> (weighted sum + bias)</li>
            <li><app-katex tex="f" [inline]="true" /> is the <strong>activation function</strong></li>
            <li><app-katex tex="\\hat{y}" [inline]="true" /> is the <strong>output</strong> (the classification)</li>
          </ul>

          <!-- Neuron Anatomy Widget -->
          <div class="widget notebook-card">
            <h4 class="section-label">Interactive: Perceptron Anatomy</h4>
            <div class="anatomy-header">
              <button class="btn btn-sm" (click)="advanceAnatomy()">Next Part &rarr;</button>
            </div>
            <div class="anatomy-diagram font-mono">
              <div class="anatomy-box" [class.highlight]="anatomyPart().highlight === 'inputs'">x1, x2</div>
              <div class="anatomy-op" [class.highlight-op]="anatomyPart().highlight === 'weights'">&times; w</div>
              <div class="anatomy-box" [class.highlight]="anatomyPart().highlight === 'net' || anatomyPart().highlight === 'bias'">
                <span [class.highlight-text]="anatomyPart().highlight === 'bias'">&Sigma; + b</span>
              </div>
              <div class="anatomy-op" [class.highlight-op]="anatomyPart().highlight === 'activation'">&rarr; f(n)</div>
              <div class="anatomy-box" [class.highlight]="anatomyPart().highlight === 'output'">y</div>
            </div>
            <div class="anatomy-desc notebook-panel">
              <p class="text-ink" style="font-weight:700">{{ anatomyStep() + 1 }}. {{ anatomyPart().label }}</p>
              <p class="text-muted" style="font-size:0.85rem">{{ anatomyPart().description }}</p>
            </div>
          </div>

          <app-callout type="think">
            The net input <app-katex tex="n" [inline]="true" /> is just a <strong>dot product</strong> of the weight
            vector and input vector, plus the bias: <app-katex tex="n = \\mathbf{w} \\cdot \\mathbf{x} + b" [inline]="true" />.
            This is a linear operation — it can only compute straight-line boundaries.
          </app-callout>
        </app-accordion>

        <!-- SECTION 3 -->
        <app-accordion [number]="3" title="Weights and Bias: What Do They Do?">
          <p class="font-body">
            Think of weights as <strong>importance knobs</strong>. A large positive weight means "this input
            matters a lot and pushes toward class +1". A large negative weight means "this input pushes
            toward class -1". A weight near zero means "this input doesn't matter much."
          </p>
          <p class="font-body">
            The <strong>bias</strong> is like a <strong>threshold shifter</strong>. It moves the decision
            boundary without depending on the input. If the bias is large and positive, the perceptron
            is biased toward outputting +1.
          </p>
          <div class="three-col">
            <div class="mini-card"><strong class="text-ink">Large w > 0</strong><p>Strong push toward +1 class when input is positive</p></div>
            <div class="mini-card"><strong class="text-red">Large w &lt; 0</strong><p>Strong push toward -1 class when input is positive</p></div>
            <div class="mini-card"><strong class="text-muted">w &asymp; 0</strong><p>This input has little influence on the output</p></div>
          </div>
          <app-callout type="try">
            Open the Lab and try setting w1 = 5, w2 = 0, bias = 0. The boundary becomes a vertical line
            — only x1 matters! Now try w1 = 0, w2 = 5. Now only x2 matters.
          </app-callout>
          <app-sim-button />
        </app-accordion>

        <!-- SECTION 4 -->
        <app-accordion [number]="4" title="Try It: Live Computation">
          <p class="font-body">
            Use the widget below to see exactly how a perceptron computes its output. Slide the inputs
            and watch the net input and output change in real time.
          </p>

          <!-- Live Compute Widget -->
          <div class="widget notebook-card">
            <h4 class="section-label">Interactive: Compute a Perceptron Output</h4>
            <div class="compute-sliders">
              <div class="compute-slider">
                <label class="font-mono text-muted">x1 = {{ liveX1() }}</label>
                <input type="range" [min]="-5" [max]="5" [step]="0.5" [value]="liveX1()" (input)="liveX1.set(toNum($event))" />
              </div>
              <div class="compute-slider">
                <label class="font-mono text-muted">x2 = {{ liveX2() }}</label>
                <input type="range" [min]="-5" [max]="5" [step]="0.5" [value]="liveX2()" (input)="liveX2.set(toNum($event))" />
              </div>
            </div>
            <div class="compute-result notebook-panel">
              <p class="font-mono text-muted" style="font-size:0.7rem">Weights: w1=0.5, w2=-0.3, bias=0.1</p>
              <span #netRef class="katex-block"></span>
              <span #outRef class="katex-block"></span>
            </div>
            <p class="font-body" style="font-size:0.9rem">
              The output is <span [class]="liveOutput() >= 0 ? 'text-green' : 'text-red'" style="font-weight:700">{{ liveOutput() === 1 ? 'Class +1' : 'Class -1' }}</span>.
              Try different input values to see how the perceptron classifies them!
            </p>
          </div>

          <p class="font-body">
            Notice how the boundary between +1 and -1 is a specific combination of x1 and x2 values.
            This boundary is a <strong>line</strong> in 2D space — which we'll explore in the next chapter.
          </p>
        </app-accordion>

        <!-- SECTION 5 -->
        <app-accordion [number]="5" title="Why Does This Matter?">
          <p class="font-body">
            The perceptron is the <strong>atom of deep learning</strong>. Every layer in a modern
            neural network (GPT, image classifiers, etc.) is made of many perceptrons working together.
          </p>
          <p class="font-body">By understanding one perceptron deeply, you gain intuition for:</p>
          <ul class="font-body var-list">
            <li>How neural networks make decisions (linear combinations + non-linear activations)</li>
            <li>Why weights and biases are the parameters that get trained</li>
            <li>What a decision boundary is and why it matters for classification</li>
            <li>Why we need multiple layers (a single perceptron can't solve XOR!)</li>
          </ul>
          <app-callout type="insight">
            A single perceptron can only solve <strong>linearly separable</strong> problems — ones where
            a straight line can separate the two classes. This is both its strength (simplicity, guaranteed
            convergence) and its limitation (can't do XOR). Understanding this limitation led to
            multi-layer networks and the deep learning revolution.
          </app-callout>
        </app-accordion>
      </div>

      <app-chapter-nav [next]="{ path: '/learn/decision-boundaries', label: 'Ch 2: Decision Boundaries' }" />
    </div>
  `,
  styles: [`
    @use 'sass:color';
    @use '../../styles/variables' as *;

    .learn-chapter { padding: 2rem 0; }

    .ch-header {
      text-align: center;
      margin-bottom: 2.5rem;
    }

    .back-link {
      font-family: 'Patrick Hand', cursive;
      font-size: 0.9rem;
      color: $ink-blue;
      text-decoration: none;
      &:hover { text-decoration: underline; }
    }

    .ch-subtitle {
      max-width: 650px;
      margin: 0.5rem auto;
      color: $pencil-light;
    }

    .tag-row {
      display: flex;
      justify-content: center;
      gap: 0.5rem;
      flex-wrap: wrap;
      margin-top: 0.75rem;
    }

    .tag {
      font-family: 'Inter', sans-serif;
      font-size: 0.7rem;
      background: color.adjust($cream-dark, $lightness: -3%);
      padding: 0.25rem 0.75rem;
      border-radius: 12px;
      color: $pencil-light;
    }

    .sections {
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
    }

    /* ── Neuron Comparison Layout ── */
    .neuron-compare {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 0.75rem;
      margin: 1rem 0 0.5rem;
      @media (max-width: $bp-sm) { grid-template-columns: 1fr; }
    }

    .neuron-compare__col { text-align: center; }

    .neuron-compare__title {
      font-family: 'Caveat', cursive;
      font-size: 1.05rem;
      font-weight: 700;
      margin-bottom: 0.25rem;
      &--blue  { color: $ink-blue; }
      &--green { color: $green-ink; }
    }

    .neuron-svg {
      width: 100%;
      max-width: 320px;
      height: auto;
    }

    .two-col-sm {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 0.75rem;
      margin: 0.75rem 0;
      @media (max-width: $bp-sm) { grid-template-columns: 1fr; }
    }

    .info-card {
      padding: 0.75rem 1rem;
      border-radius: $sketch-radius-sm;

      h3 { font-size: 0.95rem; margin-bottom: 0.4rem; }

      ul {
        font-family: 'Patrick Hand', cursive;
        font-size: 0.82rem;
        padding-left: 1.2rem;
        li { margin-bottom: 0.2rem; color: $pencil-grey; }
      }

      &.blue {
        background: rgba($ink-blue, 0.08);
        border: 1.5px solid rgba($ink-blue, 0.2);
        h3 { color: $ink-blue; }
      }

      &.green {
        background: rgba($green-ink, 0.08);
        border: 1.5px solid rgba($green-ink, 0.2);
        h3 { color: $green-ink; }
      }
    }

    .neuron-legend {
      display: flex;
      flex-wrap: wrap;
      justify-content: center;
      gap: 0.3rem 0.5rem;
      margin: 0.25rem 0 1rem;
      font-family: 'Patrick Hand', cursive;
      font-size: 0.78rem;
      color: $pencil-light;
    }

    .legend-sep {
      color: color.adjust($cream-dark, $lightness: -12%);
    }

    /* ── Bio Neuron: SVG elements ── */
    .svg-label {
      font-family: 'Patrick Hand', cursive;
      font-size: 12px;
      fill: $pencil-light;
      &--soma { fill: $pencil-grey; font-size: 11px; font-weight: 700; }
    }

    .bio-dendrite {
      stroke: rgba($ink-blue, 0.2);
      stroke-width: 2;
      fill: none;
      stroke-linecap: round;
      animation: dendrite-glow 3s ease-in-out infinite;

      &--sub {
        stroke-width: 1.5;
        animation-delay: 0.08s;
      }
    }

    .bio-soma {
      fill: rgba($ink-blue, 0.06);
      stroke: rgba($ink-blue, 0.25);
      stroke-width: 1.5;
      animation: soma-glow 3s ease-in-out infinite;
    }

    .bio-nucleus {
      fill: rgba($ink-blue, 0.12);
      stroke: rgba($ink-blue, 0.18);
      stroke-width: 1;
      animation: nucleus-glow 3s ease-in-out infinite;
    }

    .bio-axon {
      stroke: rgba($ink-blue, 0.12);
      stroke-width: 1.5;
    }

    .bio-myelin {
      fill: rgba($ink-blue, 0.08);
      stroke: rgba($ink-blue, 0.18);
      stroke-width: 1;
      animation: myelin-glow 3s ease-in-out infinite;

      &--1 { animation-delay: 0s; }
      &--2 { animation-delay: 0.12s; }
      &--3 { animation-delay: 0.24s; }
      &--4 { animation-delay: 0.36s; }
    }

    .bio-terminal {
      stroke: rgba($ink-blue, 0.18);
      stroke-width: 1.5;
      fill: none;
      stroke-linecap: round;
      animation: terminal-glow 3s ease-in-out infinite;
    }

    .bio-bouton {
      fill: rgba($ink-blue, 0.15);
      stroke: none;
      animation: bouton-glow 3s ease-in-out infinite;
    }

    /* ── Perceptron: SVG elements ── */
    .perc-text {
      font-family: 'Patrick Hand', cursive;
      font-size: 13px;
      fill: $pencil-grey;
      &--sigma { font-size: 17px; font-weight: 700; }
    }

    .perc-wlabel {
      font-family: 'Patrick Hand', cursive;
      font-size: 10px;
      fill: $pencil-light;
    }

    .perc-path {
      stroke: rgba($green-ink, 0.18);
      stroke-width: 2;
      fill: none;
      stroke-linecap: round;
    }

    .perc-node {
      stroke-width: 2;
      stroke: rgba($green-ink, 0.25);
      &--input  { fill: rgba($green-ink, 0.06); animation: glow-perc-input 3s ease-in-out infinite; }
      &--bias   { /* inherits input animation */ }
      &--sigma  { fill: rgba($green-ink, 0.06); animation: glow-perc-sigma 3s ease-in-out infinite; }
      &--act    { fill: rgba($green-ink, 0.06); animation: glow-perc-act 3s ease-in-out infinite; }
      &--output { fill: rgba($green-ink, 0.06); animation: glow-perc-output 3s ease-in-out infinite; }
    }

    .perc-pulse {
      stroke: $green-ink;
      stroke-width: 3;
      fill: none;
      stroke-linecap: round;
      stroke-dasharray: 16 500;
      filter: drop-shadow(0 0 3px rgba($green-ink, 0.5));
    }

    .perc-pulse--w1 { animation: flow-weight 3s linear infinite; }
    .perc-pulse--w2 { animation: flow-weight 3s linear infinite 0.06s; }
    .perc-pulse--w3 { animation: flow-weight 3s linear infinite 0.12s; }
    .perc-pulse--conn { animation: flow-conn 3s linear infinite; }
    .perc-pulse--out  { animation: flow-out 3s linear infinite; }

    /* ═══ Keyframes: Biological Neuron ═══ */

    // Dendrites brighten (0%–27%)
    @keyframes dendrite-glow {
      0%, 3%    { stroke: rgba($ink-blue, 0.2); filter: none; }
      12%       { stroke: rgba($ink-blue, 0.7); filter: drop-shadow(0 0 3px rgba($ink-blue, 0.4)); }
      22%       { stroke: rgba($ink-blue, 0.7); filter: drop-shadow(0 0 3px rgba($ink-blue, 0.4)); }
      27%, 100% { stroke: rgba($ink-blue, 0.2); filter: none; }
    }

    // Soma glows (27%–47%)
    @keyframes soma-glow {
      0%, 25%   { fill: rgba($ink-blue, 0.06); stroke: rgba($ink-blue, 0.25); filter: none; }
      33%       { fill: rgba($ink-blue, 0.28); stroke: $ink-blue; filter: drop-shadow(0 0 10px rgba($ink-blue, 0.5)); }
      42%       { fill: rgba($ink-blue, 0.28); stroke: $ink-blue; filter: drop-shadow(0 0 10px rgba($ink-blue, 0.5)); }
      47%, 100% { fill: rgba($ink-blue, 0.06); stroke: rgba($ink-blue, 0.25); filter: none; }
    }

    @keyframes nucleus-glow {
      0%, 25%   { fill: rgba($ink-blue, 0.12); filter: none; }
      33%       { fill: rgba($ink-blue, 0.35); filter: drop-shadow(0 0 4px rgba($ink-blue, 0.4)); }
      42%       { fill: rgba($ink-blue, 0.35); filter: drop-shadow(0 0 4px rgba($ink-blue, 0.4)); }
      47%, 100% { fill: rgba($ink-blue, 0.12); filter: none; }
    }

    // Myelin segments light up sequentially — saltatory conduction (47%–73%)
    @keyframes myelin-glow {
      0%, 47%   { fill: rgba($ink-blue, 0.08); stroke: rgba($ink-blue, 0.18); filter: none; }
      52%       { fill: rgba($ink-blue, 0.4); stroke: rgba($ink-blue, 0.7); filter: drop-shadow(0 0 5px rgba($ink-blue, 0.45)); }
      62%       { fill: rgba($ink-blue, 0.4); stroke: rgba($ink-blue, 0.7); filter: drop-shadow(0 0 5px rgba($ink-blue, 0.45)); }
      73%, 100% { fill: rgba($ink-blue, 0.08); stroke: rgba($ink-blue, 0.18); filter: none; }
    }

    // Terminal branches brighten (73%–93%)
    @keyframes terminal-glow {
      0%, 71%   { stroke: rgba($ink-blue, 0.18); filter: none; }
      78%       { stroke: rgba($ink-blue, 0.6); filter: drop-shadow(0 0 3px rgba($ink-blue, 0.4)); }
      88%       { stroke: rgba($ink-blue, 0.6); filter: drop-shadow(0 0 3px rgba($ink-blue, 0.4)); }
      93%, 100% { stroke: rgba($ink-blue, 0.18); filter: none; }
    }

    // Synaptic boutons flash (73%–93%)
    @keyframes bouton-glow {
      0%, 71%   { fill: rgba($ink-blue, 0.15); filter: none; }
      78%       { fill: rgba($ink-blue, 0.75); filter: drop-shadow(0 0 5px rgba($ink-blue, 0.6)); }
      88%       { fill: rgba($ink-blue, 0.75); filter: drop-shadow(0 0 5px rgba($ink-blue, 0.6)); }
      93%, 100% { fill: rgba($ink-blue, 0.15); filter: none; }
    }

    /* ═══ Keyframes: Perceptron ═══ */

    // Input nodes glow (0%–27%)
    @keyframes glow-perc-input {
      0%, 3%    { fill: rgba($green-ink, 0.06); stroke: rgba($green-ink, 0.25); filter: none; }
      10%       { fill: rgba($green-ink, 0.25); stroke: $green-ink; filter: drop-shadow(0 0 6px rgba($green-ink, 0.5)); }
      20%       { fill: rgba($green-ink, 0.25); stroke: $green-ink; filter: drop-shadow(0 0 6px rgba($green-ink, 0.5)); }
      27%, 100% { fill: rgba($green-ink, 0.06); stroke: rgba($green-ink, 0.25); filter: none; }
    }

    // Weight pulse travels (27%–47%)
    @keyframes flow-weight {
      0%, 25%   { stroke-dashoffset: 140; opacity: 0; }
      28%       { opacity: 1; }
      44%       { stroke-dashoffset: -16; opacity: 1; }
      47%, 100% { opacity: 0; }
    }

    // Sigma node glows (27%–47%)
    @keyframes glow-perc-sigma {
      0%, 27%   { fill: rgba($green-ink, 0.06); stroke: rgba($green-ink, 0.25); filter: none; }
      34%       { fill: rgba($green-ink, 0.25); stroke: $green-ink; filter: drop-shadow(0 0 8px rgba($green-ink, 0.5)); }
      43%       { fill: rgba($green-ink, 0.25); stroke: $green-ink; filter: drop-shadow(0 0 8px rgba($green-ink, 0.5)); }
      47%, 100% { fill: rgba($green-ink, 0.06); stroke: rgba($green-ink, 0.25); filter: none; }
    }

    // Connection pulse sigma to f (47%–60%)
    @keyframes flow-conn {
      0%, 46%   { stroke-dashoffset: 70; opacity: 0; }
      48%       { opacity: 1; }
      58%       { stroke-dashoffset: -16; opacity: 1; }
      60%, 100% { opacity: 0; }
    }

    // Activation box glows (47%–73%)
    @keyframes glow-perc-act {
      0%, 48%   { fill: rgba($green-ink, 0.06); stroke: rgba($green-ink, 0.25); filter: none; }
      55%       { fill: rgba($green-ink, 0.25); stroke: $green-ink; filter: drop-shadow(0 0 8px rgba($green-ink, 0.5)); }
      68%       { fill: rgba($green-ink, 0.25); stroke: $green-ink; filter: drop-shadow(0 0 8px rgba($green-ink, 0.5)); }
      73%, 100% { fill: rgba($green-ink, 0.06); stroke: rgba($green-ink, 0.25); filter: none; }
    }

    // Output connection pulse f to y-hat (65%–78%)
    @keyframes flow-out {
      0%, 64%   { stroke-dashoffset: 50; opacity: 0; }
      66%       { opacity: 1; }
      76%       { stroke-dashoffset: -16; opacity: 1; }
      78%, 100% { opacity: 0; }
    }

    // Output node glows (73%–93%)
    @keyframes glow-perc-output {
      0%, 71%   { fill: rgba($green-ink, 0.06); stroke: rgba($green-ink, 0.25); filter: none; }
      78%       { fill: rgba($green-ink, 0.35); stroke: $green-ink; filter: drop-shadow(0 0 8px rgba($green-ink, 0.5)); }
      88%       { fill: rgba($green-ink, 0.35); stroke: $green-ink; filter: drop-shadow(0 0 8px rgba($green-ink, 0.5)); }
      93%, 100% { fill: rgba($green-ink, 0.06); stroke: rgba($green-ink, 0.25); filter: none; }
    }

    .var-list {
      padding-left: 1.2rem;
      li {
        margin-bottom: 0.3rem;
        color: $pencil-light;
      }
    }

    .three-col {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 0.5rem;
      margin: 1rem 0;
      @media (max-width: $bp-sm) { grid-template-columns: 1fr; }
    }

    .mini-card {
      padding: 0.75rem;
      background: $cream;
      border-radius: 8px;
      border: 1px solid color.adjust($cream-dark, $lightness: -6%);
      p { font-family: 'Patrick Hand', cursive; font-size: 0.8rem; color: $pencil-light; margin-top: 0.25rem; }
    }

    .widget {
      margin: 1.25rem 0;
    }

    /* Anatomy widget */
    .anatomy-header {
      display: flex;
      justify-content: flex-end;
      margin: 0.5rem 0;
    }

    .anatomy-diagram {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 0.5rem;
      margin-bottom: 0.75rem;
      font-size: 0.85rem;
    }

    .anatomy-box {
      padding: 0.5rem 0.75rem;
      border: 2px solid color.adjust($cream-dark, $lightness: -10%);
      border-radius: $sketch-radius-sm;
      background: $cream;
      transition: all 0.3s ease;

      &.highlight {
        border-color: $ink-blue;
        background: rgba($ink-blue, 0.08);
        transform: scale(1.05);
      }
    }

    .anatomy-op {
      padding: 0.25rem 0.4rem;
      color: $pencil-light;
      transition: all 0.3s ease;

      &.highlight-op {
        color: $yellow-marker;
        font-weight: 700;
      }
    }

    .highlight-text {
      color: $yellow-marker;
      font-weight: 700;
    }

    .anatomy-desc {
      text-align: center;
    }

    /* Live compute widget */
    .compute-sliders {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 0.75rem;
      margin: 0.75rem 0;
    }

    .compute-slider {
      label { display: block; font-size: 0.8rem; margin-bottom: 0.25rem; }
    }

    .compute-result {
      margin: 0.75rem 0;
    }
  `],
})
export class Chapter1Component {
  // ── Neuron Anatomy Widget ──
  private anatomyParts = [
    { label: 'Inputs (x1, x2)', highlight: 'inputs', description: 'Data features enter the perceptron. In 2D, these are the x and y coordinates of a point.' },
    { label: 'Weights (w1, w2)', highlight: 'weights', description: 'Each input is multiplied by a weight. Weights determine how important each input is.' },
    { label: 'Bias (b)', highlight: 'bias', description: 'A constant added to the weighted sum. Shifts the decision boundary without depending on the input.' },
    { label: 'Net Input (n)', highlight: 'net', description: 'The weighted sum: n = w1*x1 + w2*x2 + b. This single number summarizes the inputs.' },
    { label: 'Activation f(n)', highlight: 'activation', description: 'A function applied to the net input. For symmetrical hard limit: if n >= 0 output +1, else -1.' },
    { label: 'Output (y)', highlight: 'output', description: 'The final classification. The perceptron has made its decision!' },
  ];

  anatomyStep = signal(0);
  anatomyPart = computed(() => this.anatomyParts[this.anatomyStep()]);

  advanceAnatomy(): void {
    this.anatomyStep.update(s => (s + 1) % this.anatomyParts.length);
  }

  // ── Live Compute Widget ──
  liveX1 = signal(2);
  liveX2 = signal(-1);
  private w1 = 0.5;
  private w2 = -0.3;
  private b = 0.1;

  liveNet = computed(() => this.w1 * this.liveX1() + this.w2 * this.liveX2() + this.b);
  liveOutput = computed(() => ACTIVATIONS.symmetricalHardLimit.fn(this.liveNet()));

  netRef = viewChild<ElementRef<HTMLSpanElement>>('netRef');
  outRef = viewChild<ElementRef<HTMLSpanElement>>('outRef');

  constructor() {
    effect(() => {
      const net = this.liveNet();
      const out = this.liveOutput();
      const x1 = this.liveX1();
      const x2 = this.liveX2();
      const nr = this.netRef();
      const or = this.outRef();
      if (nr) {
        katex.render(`n = ${this.w1}(${x1}) + (${this.w2})(${x2}) + ${this.b} = ${net.toFixed(2)}`, nr.nativeElement, { throwOnError: false, displayMode: true });
      }
      if (or) {
        katex.render(`\\hat{y} = f(${net.toFixed(2)}) = ${out}`, or.nativeElement, { throwOnError: false, displayMode: true });
      }
    });
  }

  toNum(event: Event): number {
    return Number((event.target as HTMLInputElement).value);
  }
}
