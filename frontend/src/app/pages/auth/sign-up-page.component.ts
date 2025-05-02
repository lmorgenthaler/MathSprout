import { Component, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { Router, ActivatedRoute } from "@angular/router";
import { SignUpCardComponent } from "./sign-up-card.component";
import { SupabaseService } from "../../services/supabase.service";
import { LogoComponent } from "../../shared/components/logo/logo.component";
import { AUTH_STYLES } from "../../shared/styles/auth.styles";

@Component({
  selector: "app-sign-up-page",
  standalone: true,
  imports: [CommonModule, FormsModule, SignUpCardComponent, LogoComponent],
  template: `
    <main [class]="authStyles.containerClasses">
      <div class="flex w-full max-w-7xl gap-8 items-center justify-center">
        <!-- Left side with logo and mascot -->
        <div class="relative w-[32rem] h-[32rem] p-8 text-center rounded-2xl overflow-hidden">
          <!-- Background with rounded corners -->
          <div class="absolute inset-0 bg-[#FFF9F0] rounded-2xl"></div>
          <!-- Outer border -->
          <div class="absolute inset-0 border-4 border-[#8B4513] rounded-2xl"></div>
          <!-- Inner border -->
          <div class="absolute inset-[4px] border-8 [border-color:rgba(166,123,91,0.7)] rounded-xl"></div>
          <!-- Content container -->
          <div class="relative h-full flex flex-col justify-between">
            <img 
              src="assets/images/mathsprout-mascot.png" 
              alt="MathSprout Mascot" 
              class="w-96 h-96 mx-auto"
            />
            <app-logo size="large" />
          </div>
        </div>

        <!-- Right side with sign up form -->
        <div class="flex-1 max-w-md">
          <app-sign-up-card 
            (signUp)="onSignUp($event)"
            (googleSignIn)="onGoogleSignIn()"
          ></app-sign-up-card>
          <p *ngIf="errorMessage" class="mt-4 text-red-500">{{ errorMessage }}</p>
        </div>
      </div>
    </main>
  `,
})
export class SignUpPageComponent implements OnInit {
  errorMessage: string = '';
  authStyles = AUTH_STYLES;

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
