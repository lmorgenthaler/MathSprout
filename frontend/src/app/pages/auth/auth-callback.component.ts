import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { SupabaseService } from '../../services/supabase.service';

@Component({
  selector: 'app-auth-callback',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="min-h-screen flex items-center justify-center bg-gray-50">
      <div class="text-center">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
        <p class="text-gray-600">Completing authentication...</p>
      </div>
    </div>
  `
})
export class AuthCallbackComponent implements OnInit {
  constructor(
    private supabaseService: SupabaseService,
    private router: Router
  ) {}

  async ngOnInit() {
    // Get the current session
    const { data: { session }, error } = await this.supabaseService.supabaseClient.auth.getSession();
    
    console.log('Session data:', session);

    if (error) {
      console.error('Error getting session:', error);
      this.router.navigate(['/']);
      return;
    }

    if (session?.user) {
      // Bypass email verification and redirect directly to the appropriate dashboard
      console.log('Redirecting to appropriate dashboard');
      // Redirect based on user role
      const role = session.user.user_metadata?.['role'] || 'student';
      if (role === 'teacher') {
        this.router.navigate(['/dashboard']);
      } else {
        this.router.navigate(['/student']);
      }
    } else {
      console.log('No session found, redirecting to landing page');
      this.router.navigate(['/']);
    }

    // Listen for auth state changes
    this.supabaseService.supabaseClient.auth.onAuthStateChange((event, session) => {
      console.log('Auth callback - state changed:', event, session);
      
      if (event === 'SIGNED_IN' && session?.user) {
        // Bypass email verification and redirect directly to the appropriate dashboard
        const role = session.user.user_metadata?.['role'] || 'student';
        if (role === 'teacher') {
          this.router.navigate(['/dashboard']);
        } else {
          this.router.navigate(['/student']);
        }
      } else if (event === 'SIGNED_OUT') {
        // If signed out, redirect to landing page
        this.router.navigate(['/']);
      }
    });
  }
} 