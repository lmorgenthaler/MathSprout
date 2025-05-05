import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-student-games',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="p-6">
      <h2 class="text-2xl font-bold mb-6">Math Games</h2>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <!-- Addition Game -->
        <div class="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow duration-300">
          <div class="flex items-center mb-4">
            <svg class="w-8 h-8 text-blue-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
            </svg>
            <h3 class="text-xl font-semibold text-gray-800">Addition</h3>
          </div>
          <p class="text-gray-600 mb-4">Practice addition with fun interactive challenges!</p>
          <div class="flex justify-center">
            <a href="assets/games/addition/adding_lvl1.html" target="_blank">
              <button class="px-6 py-3 bg-blue-500 text-white font-semibold rounded shadow hover:bg-blue-600 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-400">Play Addition Game</button>
            </a>
          </div>
        </div>

        <!-- Subtraction Game -->
        <div class="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow duration-300">
          <div class="flex items-center mb-4">
            <svg class="w-8 h-8 text-green-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 12H4" />
            </svg>
            <h3 class="text-xl font-semibold text-gray-800">Subtraction</h3>
          </div>
          <p class="text-gray-600 mb-4">Master subtraction through exciting missions!</p>
          <div class="flex justify-center">
            <a href="assets/games/subtraction/subtraction_lvl2.html" target="_blank">
              <button class="px-6 py-3 bg-green-500 text-white font-semibold rounded shadow hover:bg-green-600 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-green-400">Play Subtraction Game</button>
            </a>
          </div>
        </div>

        <!-- Patterns Game -->
        <div class="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow duration-300">
          <div class="flex items-center mb-4">
            <svg class="w-8 h-8 text-purple-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            <h3 class="text-xl font-semibold text-gray-800">Patterns</h3>
          </div>
          <p class="text-gray-600 mb-4">Discover and create mathematical patterns!</p>
          <div class="flex justify-center">
            <a href="assets/games/matching/matching_lvl3.html" target="_blank">
              <button class="px-6 py-3 bg-purple-500 text-white font-semibold rounded shadow hover:bg-purple-600 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-purple-400">Play Patterns Game</button>
            </a>
          </div>
        </div>
      </div>
    </div>
  `
})
export class StudentGamesComponent {} 