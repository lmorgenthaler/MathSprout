import { Component, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { Router, ActivatedRoute } from "@angular/router";
import { SignUpCardComponent } from "./sign-up-card.component";
import { SupabaseService } from "../../services/supabase.service";

@Component({
  selector: "app-sign-up-page",
  standalone: true,
  imports: [CommonModule, FormsModule, SignUpCardComponent],
  template: `
    <link
      rel="stylesheet"
      href="https://cdn.jsdelivr.net/npm/@tabler/icons-webfont@latest/dist/tabler-icons.min.css"
    />
    <link
      href="https://fonts.googleapis.com/css2?family=Inter:wght@400;700&display=swap"
      rel="stylesheet"
    />

    <main
      class="flex flex-col items-center pt-48 w-full min-h-screen bg-gray-200 max-sm:pt-24"
    >
      <h1
        class="mb-6 text-5xl tracking-wider leading-10 text-center text-amber-100"
      >
        MathSprout
      </h1>
      <app-sign-up-card 
        (signUp)="onSignUp($event)"
        (googleSignIn)="onGoogleSignIn()"
      ></app-sign-up-card>
      <p *ngIf="errorMessage" class="mt-4 text-red-500">{{ errorMessage }}</p>
    </main>
  `,
})
export class SignUpPageComponent implements OnInit {
  errorMessage: string = '';

  constructor(
    private supabaseService: SupabaseService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    // Check if this is the auth callback route
    if (this.route.snapshot.url[0]?.path === 'auth' && this.route.snapshot.url[1]?.path === 'callback') {
      // Handle the auth callback
      this.supabaseService.supabaseClient.auth.onAuthStateChange((event, session) => {
        if (event === 'SIGNED_IN' && session) {
          this.router.navigate(['/upload']);
        }
      });
    }
  }

  async onSignUp({ email, password }: { email: string; password: string }) {
    try {
      console.log('Attempting sign up with email:', email);
      const result = await this.supabaseService.signUp(email, password);
      
      if (!result.user) {
        console.error('Sign up failed: No user returned');
        this.errorMessage = 'Sign up failed. Please try again.';
        return;
      }

      console.log('Sign up successful:', result);
      
      // Determine user role based on the URL
      const url = this.router.url;
      const role = url.includes('/teacher') ? 'teacher' : 'student';
      
      // Navigate directly to the appropriate dashboard
      if (role === 'teacher') {
        await this.router.navigate(['/dashboard']);
      } else {
        await this.router.navigate(['/student']);
      }
    } catch (error) {
      console.error('Error signing up:', error);
      this.errorMessage = error instanceof Error ? error.message : 'An error occurred during sign up';
    }
  }

  async onGoogleSignIn() {
    try {
      console.log('Attempting Google sign in');
      await this.supabaseService.signInWithGoogle();
      // Note: Navigation will be handled by the auth callback route
    } catch (error) {
      console.error('Error signing in with Google:', error);
      this.errorMessage = error instanceof Error ? error.message : 'An error occurred during Google sign in';
    }
  }
}
