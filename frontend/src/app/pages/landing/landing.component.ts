import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <link
      href="https://fonts.googleapis.com/css2?family=Inter:wght@400;700&display=swap"
      rel="stylesheet"
    />

    <main class="flex flex-col items-center justify-center min-h-screen bg-gray-200 p-4">
      <div class="w-full max-w-md bg-white rounded-2xl shadow-lg p-8 text-center">
        <h1 class="text-4xl font-bold text-neutral-500 mb-8">MathSprout</h1>
        
        <div class="space-y-4">
          <button
            routerLink="/teacher"
            class="w-full py-3 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Teacher
          </button>
          
          <button
            routerLink="/student/login"
            class="w-full py-3 px-4 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            Student
          </button>
        </div>
      </div>
    </main>
  `
})
export class LandingComponent {} 