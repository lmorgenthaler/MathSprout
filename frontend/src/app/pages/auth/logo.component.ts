import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-logo',
  template: `
    <link
      href="https://fonts.googleapis.com/css2?family=Catchy+Melody&display=swap"
      rel="stylesheet"
    />
    <h1
      class="w-60 h-12 text-5xl tracking-wider leading-10 text-center text-amber-100"
      style="font-family: 'Catchy Melody', cursive;"
      role="banner"
      aria-label="MathSprout Logo"
    >
      MathSprout
    </h1>
  `,
  styles: [`
    :host {
      display: contents;
    }
  `],
  standalone: true,
  imports: [CommonModule]
})
export class LogoComponent {}