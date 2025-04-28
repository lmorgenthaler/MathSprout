import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SupabaseService } from '../../services/supabase.service';

@Component({
  selector: 'app-student-settings',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="bg-white shadow rounded-lg p-6">
      <h2 class="text-2xl font-semibold text-gray-800 mb-6">Settings</h2>
      
      <div class="space-y-6">
        <div>
          <h3 class="text-lg font-medium text-gray-900 mb-4">Account Settings</h3>
          <div class="space-y-4">
            <div>
              <label for="name" class="block text-sm font-medium text-gray-700">Name</label>
              <input
                type="text"
                id="name"
                [(ngModel)]="name"
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
            
            <div>
              <label for="email" class="block text-sm font-medium text-gray-700">Email</label>
              <input
                type="email"
                id="email"
                [(ngModel)]="email"
                disabled
                class="mt-1 block w-full rounded-md border-gray-300 bg-gray-50 shadow-sm"
              />
            </div>
          </div>
        </div>
        
        <div>
          <h3 class="text-lg font-medium text-gray-900 mb-4">Password Settings</h3>
          <div class="space-y-4">
            <div>
              <label for="currentPassword" class="block text-sm font-medium text-gray-700">Current Password</label>
              <input
                type="password"
                id="currentPassword"
                [(ngModel)]="currentPassword"
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
            
            <div>
              <label for="newPassword" class="block text-sm font-medium text-gray-700">New Password</label>
              <input
                type="password"
                id="newPassword"
                [(ngModel)]="newPassword"
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
            
            <div>
              <label for="confirmPassword" class="block text-sm font-medium text-gray-700">Confirm New Password</label>
              <input
                type="password"
                id="confirmPassword"
                [(ngModel)]="confirmPassword"
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
            
            <button
              (click)="updatePassword()"
              class="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Update Password
            </button>
          </div>
        </div>
      </div>
    </div>
  `
})
export class StudentSettingsComponent implements OnInit {
  name: string = '';
  email: string = '';
  currentPassword: string = '';
  newPassword: string = '';
  confirmPassword: string = '';

  constructor(private supabaseService: SupabaseService) {}

  async ngOnInit() {
    const user = await this.supabaseService.getUser();
    if (user?.user_metadata) {
      this.name = user.user_metadata['name'] || '';
      this.email = user.email || '';
    }
  }

  async updatePassword() {
    if (this.newPassword !== this.confirmPassword) {
      alert('New passwords do not match');
      return;
    }

    try {
      await this.supabaseService.updatePassword(this.newPassword);
      
      alert('Password updated successfully');
      this.currentPassword = '';
      this.newPassword = '';
      this.confirmPassword = '';
    } catch (error) {
      console.error('Error updating password:', error);
      alert('Failed to update password');
    }
  }
} 