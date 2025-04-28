import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SupabaseService } from '../../services/supabase.service';

@Component({
  selector: 'app-student-stats',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="p-6">
      <h2 class="text-2xl font-bold mb-6">My Progress</h2>
      
      <!-- Overall Progress -->
      <div class="bg-white rounded-lg shadow p-6 mb-6">
        <h3 class="text-lg font-semibold mb-4">Overall Progress</h3>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div class="text-center">
            <div class="text-3xl font-bold text-blue-600">{{ totalGamesPlayed }}</div>
            <div class="text-gray-600">Games Played</div>
          </div>
          <div class="text-center">
            <div class="text-3xl font-bold text-green-600">{{ averageScore }}%</div>
            <div class="text-gray-600">Average Score</div>
          </div>
          <div class="text-center">
            <div class="text-3xl font-bold text-purple-600">{{ timeSpent }}h</div>
            <div class="text-gray-600">Time Spent</div>
          </div>
        </div>
      </div>

      <!-- Subject Progress -->
      <div class="bg-white rounded-lg shadow p-6 mb-6">
        <h3 class="text-lg font-semibold mb-4">Subject Progress</h3>
        <div class="space-y-4">
          <div>
            <div class="flex justify-between mb-1">
              <span class="text-gray-600">Addition</span>
              <span class="text-gray-600">{{ additionProgress }}%</span>
            </div>
            <div class="w-full bg-gray-200 rounded-full h-2.5">
              <div class="bg-blue-600 h-2.5 rounded-full" [style.width.%]="additionProgress"></div>
            </div>
          </div>
          <div>
            <div class="flex justify-between mb-1">
              <span class="text-gray-600">Subtraction</span>
              <span class="text-gray-600">{{ subtractionProgress }}%</span>
            </div>
            <div class="w-full bg-gray-200 rounded-full h-2.5">
              <div class="bg-green-600 h-2.5 rounded-full" [style.width.%]="subtractionProgress"></div>
            </div>
          </div>
          <div>
            <div class="flex justify-between mb-1">
              <span class="text-gray-600">Multiplication</span>
              <span class="text-gray-600">{{ multiplicationProgress }}%</span>
            </div>
            <div class="w-full bg-gray-200 rounded-full h-2.5">
              <div class="bg-purple-600 h-2.5 rounded-full" [style.width.%]="multiplicationProgress"></div>
            </div>
          </div>
          <div>
            <div class="flex justify-between mb-1">
              <span class="text-gray-600">Division</span>
              <span class="text-gray-600">{{ divisionProgress }}%</span>
            </div>
            <div class="w-full bg-gray-200 rounded-full h-2.5">
              <div class="bg-yellow-600 h-2.5 rounded-full" [style.width.%]="divisionProgress"></div>
            </div>
          </div>
        </div>
      </div>

      <!-- Recent Achievements -->
      <div class="bg-white rounded-lg shadow p-6">
        <h3 class="text-lg font-semibold mb-4">Recent Achievements</h3>
        <div class="space-y-4">
          <div *ngFor="let achievement of recentAchievements" class="flex items-center space-x-4">
            <div class="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
              <svg class="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"></path>
              </svg>
            </div>
            <div>
              <div class="font-medium">{{ achievement.title }}</div>
              <div class="text-sm text-gray-600">{{ achievement.description }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `
})
export class StudentStatsComponent implements OnInit {
  totalGamesPlayed = 0;
  averageScore = 0;
  timeSpent = 0;
  additionProgress = 0;
  subtractionProgress = 0;
  multiplicationProgress = 0;
  divisionProgress = 0;
  recentAchievements = [
    {
      title: 'First Game Completed',
      description: 'Completed your first math game!'
    },
    {
      title: 'Perfect Score',
      description: 'Achieved 100% in Addition Adventure'
    }
  ];

  constructor(private supabaseService: SupabaseService) {}

  async ngOnInit() {
    // TODO: Fetch actual stats from Supabase
    // This is placeholder data for now
    this.totalGamesPlayed = 5;
    this.averageScore = 85;
    this.timeSpent = 2;
    this.additionProgress = 75;
    this.subtractionProgress = 60;
    this.multiplicationProgress = 45;
    this.divisionProgress = 30;
  }
} 