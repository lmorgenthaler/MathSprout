import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SupabaseService } from '../../services/supabase.service';
import { LogoComponent } from '../../shared/components/logo/logo.component';

@Component({
  selector: 'app-student-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule, LogoComponent],
  template: `
    <div class="flex h-screen bg-gray-100">
      <!-- Sidebar -->
      <div class="w-64 bg-white shadow-md">
        <div class="p-4 border-b">
          <app-logo size="normal" />
        </div>
        <nav class="p-4">
          <ul class="space-y-2">
            <li>
              <a routerLink="/student/home" routerLinkActive="bg-blue-50 text-blue-600" 
                 class="flex items-center p-2 text-gray-700 rounded-lg hover:bg-gray-100">
                <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
                <span>Home</span>
              </a>
            </li>
            <li>
              <a routerLink="/student/games" routerLinkActive="bg-blue-50 text-blue-600" 
                 class="flex items-center p-2 text-gray-700 rounded-lg hover:bg-gray-100">
                <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
                </svg>
                <span>Games</span>
              </a>
            </li>
            <li>
              <a routerLink="/student/stats" routerLinkActive="bg-blue-50 text-blue-600" 
                 class="flex items-center p-2 text-gray-700 rounded-lg hover:bg-gray-100">
                <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
                <span>My Stats</span>
              </a>
            </li>
            <li>
              <a routerLink="/student/profile" routerLinkActive="bg-blue-50 text-blue-600" 
                 class="flex items-center p-2 text-gray-700 rounded-lg hover:bg-gray-100">
                <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                <span>Profile</span>
              </a>
            </li>
            <li>
              <a routerLink="/student/settings" routerLinkActive="bg-blue-50 text-blue-600" 
                 class="flex items-center p-2 text-gray-700 rounded-lg hover:bg-gray-100">
                <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span>Settings</span>
              </a>
            </li>
            <li class="pt-4 mt-4 border-t">
              <button (click)="onLogout()" 
                      class="flex items-center w-full p-2 text-red-600 rounded-lg hover:bg-red-50">
                <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                <span>Log Out</span>
              </button>
            </li>
          </ul>
        </nav>
      </div>
      
      <!-- Main Content -->
      <div class="flex-1 overflow-auto bg-[#d4f5d4]">
        <header class="bg-white shadow">
          <div class="px-4 py-6">
            <h1 class="text-2xl font-semibold text-gray-800">Welcome, {{ studentName }}</h1>
          </div>
        </header>
        <main class="p-6">
          <router-outlet></router-outlet>
        </main>
      </div>
    </div>
  `
})
export class StudentDashboardComponent implements OnInit {
  studentName: string = '';

  constructor(private supabaseService: SupabaseService) {}

  async ngOnInit() {
    const user = await this.supabaseService.getUser();
    if (user?.user_metadata?.['name']) {
      this.studentName = user.user_metadata['name'];
    }
  }

  async onLogout() {
    try {
      await this.supabaseService.signOut();
    } catch (error) {
      console.error('Error signing out:', error);
    }
  }
}

export default StudentDashboardComponent; 