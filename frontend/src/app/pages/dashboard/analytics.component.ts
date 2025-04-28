import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SupabaseService } from '../../services/supabase.service';

@Component({
  selector: 'app-analytics',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="p-6">
      <h2 class="text-2xl font-bold mb-6">Analytics</h2>

      <!-- Overview Cards -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div class="bg-white rounded-lg shadow p-6">
          <h3 class="text-lg font-semibold mb-2">Total Students</h3>
          <p class="text-3xl font-bold text-blue-600">{{ totalStudents }}</p>
        </div>
        <div class="bg-white rounded-lg shadow p-6">
          <h3 class="text-lg font-semibold mb-2">Average Score</h3>
          <p class="text-3xl font-bold text-green-600">{{ averageScore }}%</p>
        </div>
        <div class="bg-white rounded-lg shadow p-6">
          <h3 class="text-lg font-semibold mb-2">Total Time Spent</h3>
          <p class="text-3xl font-bold text-purple-600">{{ totalTimeSpent }}h</p>
        </div>
      </div>

      <!-- Performance by Subject -->
      <div class="bg-white rounded-lg shadow p-6 mb-6">
        <h3 class="text-lg font-semibold mb-4">Performance by Subject</h3>
        <div class="space-y-4">
          <div>
            <div class="flex justify-between mb-1">
              <span class="text-gray-600">Addition</span>
              <span class="text-gray-600">{{ subjectScores.addition }}%</span>
            </div>
            <div class="w-full bg-gray-200 rounded-full h-2.5">
              <div class="bg-blue-600 h-2.5 rounded-full" [style.width.%]="subjectScores.addition"></div>
            </div>
          </div>
          <div>
            <div class="flex justify-between mb-1">
              <span class="text-gray-600">Subtraction</span>
              <span class="text-gray-600">{{ subjectScores.subtraction }}%</span>
            </div>
            <div class="w-full bg-gray-200 rounded-full h-2.5">
              <div class="bg-green-600 h-2.5 rounded-full" [style.width.%]="subjectScores.subtraction"></div>
            </div>
          </div>
          <div>
            <div class="flex justify-between mb-1">
              <span class="text-gray-600">Multiplication</span>
              <span class="text-gray-600">{{ subjectScores.multiplication }}%</span>
            </div>
            <div class="w-full bg-gray-200 rounded-full h-2.5">
              <div class="bg-purple-600 h-2.5 rounded-full" [style.width.%]="subjectScores.multiplication"></div>
            </div>
          </div>
          <div>
            <div class="flex justify-between mb-1">
              <span class="text-gray-600">Division</span>
              <span class="text-gray-600">{{ subjectScores.division }}%</span>
            </div>
            <div class="w-full bg-gray-200 rounded-full h-2.5">
              <div class="bg-yellow-600 h-2.5 rounded-full" [style.width.%]="subjectScores.division"></div>
            </div>
          </div>
        </div>
      </div>

      <!-- Top Performers -->
      <div class="bg-white rounded-lg shadow p-6">
        <h3 class="text-lg font-semibold mb-4">Top Performers</h3>
        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Student</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Grade Level</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Average Score</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Games Played</th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr *ngFor="let student of topPerformers">
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm font-medium text-gray-900">{{ student.name }}</div>
                  <div class="text-sm text-gray-500">{{ student.email }}</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm text-gray-900">{{ student.grade_level }}</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm text-gray-900">{{ student.average_score }}%</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm text-gray-900">{{ student.games_played }}</div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `
})
export class AnalyticsComponent implements OnInit {
  totalStudents = 0;
  averageScore = 0;
  totalTimeSpent = 0;
  subjectScores = {
    addition: 0,
    subtraction: 0,
    multiplication: 0,
    division: 0
  };
  topPerformers: any[] = [];

  constructor(private supabaseService: SupabaseService) {}

  async ngOnInit() {
    // TODO: Implement loading analytics data from Supabase
    // This is placeholder data for now
    this.totalStudents = 25;
    this.averageScore = 85;
    this.totalTimeSpent = 150;
    this.subjectScores = {
      addition: 90,
      subtraction: 85,
      multiplication: 80,
      division: 75
    };
    this.topPerformers = [
      {
        name: 'John Doe',
        email: 'john@example.com',
        grade_level: '3',
        average_score: 95,
        games_played: 50
      },
      {
        name: 'Jane Smith',
        email: 'jane@example.com',
        grade_level: '4',
        average_score: 92,
        games_played: 45
      }
    ];
  }
} 