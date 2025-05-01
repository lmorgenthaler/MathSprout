import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-leaderboard',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="p-6">
      <h2 class="text-2xl font-semibold text-gray-800 mb-6">Class Leaderboard</h2>
      <!-- Leaderboard content will go here -->
    </div>
  `
})
export class LeaderboardComponent {} 