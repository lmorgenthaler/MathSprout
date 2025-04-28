import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule, ActivatedRoute } from '@angular/router';
import { SupabaseService } from '../../services/supabase.service';

@Component({
  selector: 'app-sign-in',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  template: `
    <link
      href="https://fonts.googleapis.com/css2?family=Inter:wght@400;700&display=swap"
      rel="stylesheet"
    />

    <div class="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div class="max-w-md w-full space-y-8">
        <div>
          <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Sign in to your {{ userRole === 'teacher' ? 'teacher' : 'student' }} account
          </h2>
          <p class="mt-2 text-center text-sm text-gray-600">
            Or
            <a [routerLink]="userRole === 'teacher' ? '/teacher/signup' : '/student/signup'" class="font-medium text-indigo-600 hover:text-indigo-500">
              create a new account
            </a>
          </p>
        </div>
        <form class="mt-8 space-y-6" (ngSubmit)="onSubmit()">
          <div class="rounded-md shadow-sm -space-y-px">
            <div>
              <label for="email-address" class="sr-only">Email address</label>
              <input
                id="email-address"
                name="email"
                type="email"
                [(ngModel)]="email"
                required
                class="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Email address"
              />
            </div>
            <div>
              <label for="password" class="sr-only">Password</label>
              <input
                id="password"
                name="password"
                type="password"
                [(ngModel)]="password"
                required
                class="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Password"
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              [disabled]="isLoading"
              class="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              <span class="absolute left-0 inset-y-0 flex items-center pl-3">
                <svg
                  class="h-5 w-5 text-indigo-500 group-hover:text-indigo-400"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path
                    fill-rule="evenodd"
                    d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                    clip-rule="evenodd"
                  />
                </svg>
              </span>
              {{ isLoading ? 'Signing in...' : 'Sign in' }}
            </button>
          </div>
        </form>

        <div *ngIf="error" class="mt-4 p-4 bg-red-50 rounded-md">
          <p class="text-sm text-red-700">{{ error }}</p>
        </div>
      </div>
    </div>
  `
})
export class SignInComponent implements OnInit {
  email: string = '';
  password: string = '';
  isLoading: boolean = false;
  error: string | null = null;
  userRole: string = 'student'; // Default role

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