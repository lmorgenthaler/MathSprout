import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SupabaseService } from '../../services/supabase.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="p-6">
      <h2 class="text-2xl font-bold mb-6">Profile</h2>
      <div class="bg-white rounded-lg shadow p-6">
        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700">Email</label>
            <p class="mt-1 text-gray-900">{{ userEmail }}</p>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700">Account Type</label>
            <p class="mt-1 text-gray-900">{{ accountType }}</p>
          </div>
        </div>
      </div>
    </div>
  `
})
export class ProfileComponent implements OnInit {
  userEmail: string = '';
  accountType: string = 'Teacher';

  constructor(private supabaseService: SupabaseService) {}

  async ngOnInit() {
    const user = await this.supabaseService.getUser();
    if (user?.email) {
      this.userEmail = user.email;
    }
  }
} 