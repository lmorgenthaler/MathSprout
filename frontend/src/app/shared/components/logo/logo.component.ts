import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-logo',
  standalone: true,
  imports: [CommonModule],
  template: `
    <link
      href="https://fonts.googleapis.com/css2?family=Catchy+Melody&display=swap"
      rel="stylesheet"
    />
    <h1 
      [class]="size === 'large' ? 'text-6xl' : 'text-5xl'"
      class="font-bold" 
      style="font-family: 'Catchy Melody', cursive; color: #FFEDC4; -webkit-text-stroke: 1px #1F3D2C;"
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
  `]
})
export class LogoComponent {
  @Input() size: 'normal' | 'large' = 'normal';
} 