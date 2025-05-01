import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule, ActivatedRoute } from '@angular/router';
import { SupabaseService } from '../../services/supabase.service';
import { LogoComponent } from '../../shared/components/logo/logo.component';
import { AUTH_STYLES } from '../../shared/styles/auth.styles';

@Component({
  selector: 'app-sign-in',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, LogoComponent],
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

        <!-- Right side with sign in form -->
        <div class="flex-1 max-w-md">
          <div class="bg-white p-8 rounded-lg shadow-md">
            <h2 class="text-3xl font-baloo-2 font-bold text-gray-900 mb-6 text-center">
              Sign in to your {{ userRole === 'teacher' ? 'teacher' : 'student' }} account
            </h2>
            <p class="mb-8 text-center text-sm text-gray-600">
              Or
              <a [routerLink]="userRole === 'teacher' ? '/teacher/signup' : '/student/signup'" class="font-medium text-green-600 hover:text-green-500">
                create a new account
              </a>
            </p>

            <form class="space-y-6" (ngSubmit)="onSubmit()">
              <div>
                <label for="email-address" class="block text-sm font-medium text-gray-700">Email address</label>
                <input
                  id="email-address"
                  name="email"
                  type="email"
                  [(ngModel)]="email"
                  required
                  class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
                  placeholder="Enter your email"
                />
              </div>

              <div>
                <label for="password" class="block text-sm font-medium text-gray-700">Password</label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  [(ngModel)]="password"
                  required
                  class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
                  placeholder="Enter your password"
                />
              </div>

              <button
                type="submit"
                [disabled]="isLoading"
                class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {{ isLoading ? 'Signing in...' : 'Sign in' }}
              </button>
            </form>

            <div *ngIf="error" class="mt-4 p-4 bg-red-50 rounded-md">
              <p class="text-sm text-red-700">{{ error }}</p>
            </div>
          </div>
        </div>
      </div>
    </main>
  `
})
export class SignInComponent implements OnInit {
  email: string = '';
  password: string = '';
  isLoading: boolean = false;
  error: string | null = null;
  userRole: string = 'student';
  authStyles = AUTH_STYLES;

  constructor(
    private supabaseService: SupabaseService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    // Determine user role based on the current route
    const url = this.router.url;
    if (url.includes('/teacher/login')) {
      this.userRole = 'teacher';
    } else {
      this.userRole = 'student';
    }
  }

  async onSubmit() {
    this.isLoading = true;
    this.error = null;

    try {
      const { user, session, error } = await this.supabaseService.signIn(this.email, this.password);
      
      if (error) {
        this.error = error.message;
        this.isLoading = false;
        return;
      }

      if (user) {
        // Log user metadata for debugging
        console.log('User metadata:', user.user_metadata);
        
        // Check if the user's role matches the expected role for this route
        const userRole = user.user_metadata?.['role'];
        
        // If role is not set, try to determine it from the URL
        if (!userRole) {
          console.log('User role not set, determining from URL');
          const url = this.router.url;
          const determinedRole = url.includes('/teacher/login') ? 'teacher' : 'student';
          
          // Update user metadata with the determined role
          console.log('Setting user role to:', determinedRole);
          const { error: updateError } = await this.supabaseService.updateUser({
            data: {
              role: determinedRole
            }
          });
          
          if (updateError) {
            console.error('Failed to set user role:', updateError);
            this.error = 'Failed to set user role. Please contact support.';
            this.isLoading = false;
            return;
          }
          
          // Refresh the user to get the updated metadata
          const updatedUser = await this.supabaseService.getUser();
          console.log('Updated user metadata:', updatedUser?.user_metadata);
          
          // Navigate based on the updated role
          if (determinedRole === 'teacher') {
            await this.router.navigate(['/dashboard']);
          } else {
            await this.router.navigate(['/student']);
          }
        } else if (userRole !== this.userRole) {
          // Role is set but doesn't match the expected role
          console.log('User role mismatch:', userRole, 'expected:', this.userRole);
          this.error = `This account is registered as a ${userRole}. Please use the ${userRole} login page.`;
          this.isLoading = false;
          return;
        } else {
          // Role matches, navigate accordingly
          console.log('User role matches expected role:', userRole);
          if (userRole === 'teacher') {
            await this.router.navigate(['/dashboard']);
          } else {
            await this.router.navigate(['/student']);
          }
        }
      }
    } catch (error: any) {
      this.error = error.message || 'An error occurred during sign in';
    } finally {
      this.isLoading = false;
    }
  }
} 