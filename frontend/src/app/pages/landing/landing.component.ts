import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { LogoComponent } from '../../shared/components/logo/logo.component';
import { AUTH_STYLES } from '../../shared/styles/auth.styles';

@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [CommonModule, RouterModule, LogoComponent],
  template: `
    <link
      href="https://fonts.googleapis.com/css2?family=Catchy+Melody&display=swap"
      rel="stylesheet"
    />

    <main [class]="authStyles.containerClasses">
      <div class="relative w-[32rem] h-[32rem] p-8 text-center mb-12 rounded-2xl overflow-hidden">
        <!-- Background with rounded corners -->
        <div class="absolute inset-0 bg-[#FFF9F0] rounded-2xl"></div>
        <!-- Outer border -->
        <div class="absolute inset-0 border-4 border-[#8B4513] rounded-2xl"></div>
        <!-- Inner border -->
        <div class="absolute inset-[4px] border-8 [border-color:rgba(166,123,91,0.7)] rounded-xl"></div>
        <!-- Content container -->
        <div class="relative h-full flex flex-col justify-between">
          <img 
            src="assets/images/mathsprout-mascot.png" 
            alt="MathSprout Mascot" 
            class="w-96 h-96 mx-auto"
          />
          <app-logo size="large" />
        </div>
      </div>
      
      <div class="flex gap-16">
        <button
          routerLink="/teacher"
          class="px-12 py-4 text-lg bg-[#2E7D32] text-white rounded-full border-2 border-[#1F3D2C] hover:bg-[#1B5E20] transition-colors shadow-lg hover:shadow-xl"
        >
          Teacher
        </button>
        
        <button
          routerLink="/student/login"
          class="px-12 py-4 text-lg bg-[#4CAF50] text-white rounded-full border-2 border-[#1F3D2C] hover:bg-[#388E3C] transition-colors shadow-lg hover:shadow-xl"
        >
          Student
        </button>
      </div>
    </main>
  `
})
export class LandingComponent {
  authStyles = AUTH_STYLES;
} 