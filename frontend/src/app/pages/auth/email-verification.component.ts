import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { SupabaseService } from '../../services/supabase.service';

@Component({
  selector: 'app-email-verification',
  standalone: true,
  imports: [CommonModule],
  template: `
    <link
      href="https://fonts.googleapis.com/css2?family=Inter:wght@400;700&display=swap"
      rel="stylesheet"
    />

    <main class="flex flex-col items-center justify-center min-h-screen bg-gray-200 p-4">
      <div class="w-full max-w-md bg-white rounded-2xl shadow-lg p-8">
        <h1 class="text-2xl font-bold text-center text-neutral-500 mb-6">
          Verify Your Email
        </h1>
        
        <div class="text-center mb-6">
          <p class="text-gray-600 mb-4">
            We've sent a verification link to your email address. Please check your inbox and click the link to verify your account.
          </p>
          <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-neutral-500 mx-auto mb-4"></div>
          <p class="text-sm text-gray-500">
            {{ statusMessage }}
          </p>
        </div>

        <div class="text-center">
          <p class="text-sm text-gray-500">
            Didn't receive the email? 
            <button 
              (click)="resendVerification()"
              class="text-blue-600 hover:text-blue-800 font-medium"
              [disabled]="isResending"
            >
              {{ isResending ? 'Sending...' : 'Resend verification email' }}
            </button>
          </p>
          <p *ngIf="errorMessage" class="mt-2 text-sm text-red-500">{{ errorMessage }}</p>
          <p *ngIf="successMessage" class="mt-2 text-sm text-green-500">{{ successMessage }}</p>
        </div>
      </div>
    </main>
  `
})
export class EmailVerificationComponent implements OnInit {
  isResending = false;
  errorMessage: string = '';
  successMessage: string = '';
  statusMessage: string = 'Waiting for verification...';

  constructor(
    private supabaseService: SupabaseService,
    private router: Router
  ) {}

  ngOnInit() {
    // Check initial auth state
    this.checkAuthState();

    // Listen for auth state changes
    this.supabaseService.supabaseClient.auth.onAuthStateChange((event, session) => {
      console.log('Auth state changed:', event, session);
      this.handleAuthStateChange(event, session);
    });
  }

  private async checkAuthState() {
    const user = this.supabaseService.getCurrentUser();
    console.log('Current user state:', user);
    
    if (user?.email_confirmed_at) {
      this.statusMessage = 'Email verified! Setting up your account...';
      
      try {
        // Log the current user metadata for debugging
        console.log('User metadata:', user.user_metadata);
        
        // Check if role is already set
        if (!user.user_metadata?.['role']) {
          // Determine role based on the URL
          const url = this.router.url;
          const role = url.includes('/teacher') ? 'teacher' : 'student';
          
          console.log('Setting user role to:', role);
          
          // Update user metadata with role
          const { error } = await this.supabaseService.updateUser({
            data: {
              role: role
            }
          });
          
          if (error) {
            console.error('Failed to set user role:', error);
            this.errorMessage = 'Failed to set user role. Please contact support.';
            return;
          }
          
          console.log('User role set successfully:', role);
          
          // Refresh the user to get the updated metadata
          const updatedUser = await this.supabaseService.getUser();
          console.log('Updated user metadata:', updatedUser?.user_metadata);
          
          // Redirect based on the updated role
          if (updatedUser?.user_metadata?.['role'] === 'teacher') {
            this.router.navigate(['/dashboard']);
          } else {
            this.router.navigate(['/student']);
          }
        } else {
          // Role is already set, redirect based on the role
          const role = user.user_metadata['role'];
          console.log('User role already set to:', role);
          
          if (role === 'teacher') {
            this.router.navigate(['/dashboard']);
          } else {
            this.router.navigate(['/student']);
          }
        }
      } catch (error: any) {
        console.error('Error during email verification:', error);
        this.errorMessage = error.message || 'An error occurred during verification';
      }
    }
  }

  private async handleAuthStateChange(event: string, session: any) {
    if (event === 'SIGNED_IN' && session?.user?.email_confirmed_at) {
      this.statusMessage = 'Email verified! Setting up your account...';
      
      try {
        // Get the current user
        const user = session.user;
        
        // Log the current user metadata for debugging
        console.log('User metadata:', user.user_metadata);
        
        // Check if role is already set
        if (!user.user_metadata?.['role']) {
          // Determine role based on the URL
          const url = this.router.url;
          const role = url.includes('/teacher') ? 'teacher' : 'student';
          
          console.log('Setting user role to:', role);
          
          // Update user metadata with role
          const { error } = await this.supabaseService.updateUser({
            data: {
              role: role
            }
          });
          
          if (error) {
            console.error('Failed to set user role:', error);
            this.errorMessage = 'Failed to set user role. Please contact support.';
            return;
          }
          
          console.log('User role set successfully:', role);
          
          // Refresh the user to get the updated metadata
          const updatedUser = await this.supabaseService.getUser();
          console.log('Updated user metadata:', updatedUser?.user_metadata);
          
          // Redirect based on the updated role
          if (updatedUser?.user_metadata?.['role'] === 'teacher') {
            this.router.navigate(['/dashboard']);
          } else {
            this.router.navigate(['/student']);
          }
        } else {
          // Role is already set, redirect based on the role
          const role = user.user_metadata['role'];
          console.log('User role already set to:', role);
          
          if (role === 'teacher') {
            this.router.navigate(['/dashboard']);
          } else {
            this.router.navigate(['/student']);
          }
        }
      } catch (error: any) {
        console.error('Error during email verification:', error);
        this.errorMessage = error.message || 'An error occurred during verification';
      }
    } else if (event === 'SIGNED_OUT') {
      this.statusMessage = 'Please sign in to verify your email';
      this.router.navigate(['/signup']);
    }
  }

  async resendVerification() {
    try {
      this.isResending = true;
      this.errorMessage = '';
      this.successMessage = '';
      
      const user = this.supabaseService.getCurrentUser();
      if (!user?.email) {
        throw new Error('No email address found');
      }

      await this.supabaseService.resendVerificationEmail(user.email);
      this.successMessage = 'Verification email sent! Please check your inbox.';
    } catch (error) {
      console.error('Error resending verification:', error);
      this.errorMessage = error instanceof Error ? error.message : 'Failed to send verification email. Please try again.';
    } finally {
      this.isResending = false;
    }
  }
} 