import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SupabaseService } from '../../services/supabase.service';

@Component({
  selector: 'app-student-profile',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="bg-white shadow rounded-lg p-6">
      <h2 class="text-2xl font-semibold text-gray-800 mb-6">Student Profile</h2>
      
      <div class="space-y-4">
        <div>
          <label class="block text-sm font-medium text-gray-700">Name</label>
          <p class="mt-1 text-lg text-gray-900">{{ studentName }}</p>
        </div>
        
        <div>
          <label class="block text-sm font-medium text-gray-700">Student ID</label>
          <p class="mt-1 text-lg text-gray-900">{{ studentId }}</p>
        </div>
        
        <div>
          <label class="block text-sm font-medium text-gray-700">Email</label>
          <p class="mt-1 text-lg text-gray-900">{{ studentEmail }}</p>
        </div>
      </div>
    </div>
  `
})
export class StudentProfileComponent implements OnInit {
  studentName: string = '';
  studentId: string = '';
  studentEmail: string = '';

  constructor(private supabaseService: SupabaseService) {}

  async ngOnInit() {
    const user = await this.supabaseService.getUser();
    if (user?.user_metadata) {
      this.studentName = user.user_metadata['name'] || '';
      this.studentId = user.user_metadata['student_id'] || '';
      this.studentEmail = user.email || '';
    }
  }
} 