import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-student-stats',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="bg-white shadow rounded-lg p-6">
      <h2 class="text-2xl font-semibold text-gray-800 mb-6">My Stats</h2>
      
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div class="bg-green-50 rounded-lg p-4 shadow-sm">
          <h3 class="text-lg font-medium text-green-800">Games Played</h3>
          <p class="text-3xl font-bold text-green-600 mt-2">0</p>
        </div>
        
        <div class="bg-blue-50 rounded-lg p-4 shadow-sm">
          <h3 class="text-lg font-medium text-blue-800">Average Score</h3>
          <p class="text-3xl font-bold text-blue-600 mt-2">0%</p>
        </div>
        
        <div class="bg-purple-50 rounded-lg p-4 shadow-sm">
          <h3 class="text-lg font-medium text-purple-800">Time Spent</h3>
          <p class="text-3xl font-bold text-purple-600 mt-2">0h</p>
        </div>
      </div>
    </div>
  `
})
export class StudentStatsComponent {} 