import { Component, EventEmitter, Output } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { InputFieldComponent } from "./input-field.component";
import { GoogleButtonComponent } from "./google-button.component";
import { ButtonComponent } from "./button.component";

@Component({
  selector: "app-sign-up-card",
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    InputFieldComponent,
    GoogleButtonComponent,
    ButtonComponent,
  ],
  template: `
    <div
      class="flex flex-col gap-6 p-8 w-full max-w-[400px] bg-white rounded-2xl shadow-lg"
    >
      <h2 class="text-2xl font-bold text-center text-neutral-500">
        Create your account
      </h2>
      <form (ngSubmit)="onSubmit()" class="flex flex-col gap-6">
        <app-input-field
          type="email"
          placeholder="Email"
          [(value)]="email"
          required
        />
        <app-input-field
          type="password"
          placeholder="Password"
          [(value)]="password"
          required
        />
        <app-button type="submit">
          <span>Sign up</span>
        </app-button>
      </form>
      <div class="relative">
        <div class="absolute inset-0 flex items-center">
          <div class="w-full border-t border-neutral-300"></div>
        </div>
        <div class="relative flex justify-center text-sm">
          <span class="px-2 bg-white text-neutral-500">Or continue with</span>
        </div>
      </div>
      <app-google-button (click)="onGoogleClick()"></app-google-button>
    </div>
  `,
})
export class SignUpCardComponent {
  @Output() signUp = new EventEmitter<{ email: string; password: string }>();
  @Output() googleSignIn = new EventEmitter<void>();

  email: string = "";
  password: string = "";

  onSubmit() {
    this.signUp.emit({ email: this.email, password: this.password });
  }

  onGoogleClick() {
    this.googleSignIn.emit();
  }
}
