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
    <div class="bg-white p-8 rounded-lg shadow-md">
      <h2 class="text-3xl font-baloo-2 font-bold text-gray-900 mb-6 text-center">
        Create your account
      </h2>
      <p class="mb-8 text-center text-sm text-gray-600">
        Or
        <a routerLink="/login" class="font-medium text-green-600 hover:text-green-500">
          sign in to your account
        </a>
      </p>

      <form (ngSubmit)="onSubmit()" class="space-y-6">
        <div>
          <label for="email" class="block text-sm font-medium text-gray-700">Email address</label>
          <app-input-field
            id="email"
            type="email"
            placeholder="Enter your email"
            [(value)]="email"
            required
            class="mt-1 block w-full"
          />
        </div>

        <div>
          <label for="password" class="block text-sm font-medium text-gray-700">Password</label>
          <app-input-field
            id="password"
            type="password"
            placeholder="Enter your password"
            [(value)]="password"
            required
            class="mt-1 block w-full"
          />
        </div>

        <app-button type="submit" class="w-full">
          <span>Sign up</span>
        </app-button>
      </form>

      <div class="mt-6">
        <div class="relative">
          <div class="absolute inset-0 flex items-center">
            <div class="w-full border-t border-gray-300"></div>
          </div>
          <div class="relative flex justify-center text-sm">
            <span class="px-2 bg-white text-gray-500">Or continue with</span>
          </div>
        </div>

        <div class="mt-6">
          <app-google-button (click)="onGoogleClick()"></app-google-button>
        </div>
      </div>
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
