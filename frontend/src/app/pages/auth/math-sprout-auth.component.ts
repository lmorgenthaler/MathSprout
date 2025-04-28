import { Component } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterModule, Router } from "@angular/router";
import { ActionButtonComponent } from "./action-button.component";

@Component({
  selector: "app-math-sprout-auth",
  template: `
    <link
      href="https://fonts.googleapis.com/css2?family=Inter:wght@400;700&display=swap"
      rel="stylesheet"
    />
    <main
      class="flex flex-col gap-8 justify-center items-center min-h-screen bg-gray-200"
    >
      <h1
        class="text-5xl tracking-wider leading-10 text-center text-amber-100 max-md:text-5xl max-sm:text-4xl"
      >
        MathSprout
      </h1>
      <section class="flex flex-col gap-6 max-sm:w-[90%]">
        <app-action-button text="Get started free" (click)="navigateToSignUp()" />
        <app-action-button text="Login to Account" />
      </section>
    </main>
  `,
  styles: [
    `
      :host {
        display: contents;
      }
    `,
  ],
  standalone: true,
  imports: [CommonModule, RouterModule, ActionButtonComponent],
})
export class MathSproutAuthComponent {
  constructor(private router: Router) {}

  navigateToSignUp() {
    this.router.navigate(['/signup']);
  }
}
