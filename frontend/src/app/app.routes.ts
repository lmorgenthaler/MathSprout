import { Routes } from '@angular/router';
import { LandingComponent } from './pages/landing/landing.component';
import { TeacherOptionsComponent } from './pages/auth/teacher-options.component';
import { SignUpComponent } from './pages/auth/sign-up.component';
import { SignInComponent } from './pages/auth/sign-in.component';
import { EmailVerificationComponent } from './pages/auth/email-verification.component';
import { AuthCallbackComponent } from './pages/auth/auth-callback.component';
import { TeacherDashboardComponent } from './pages/dashboard/teacher-dashboard.component';
import { StudentDashboardComponent } from './pages/student/student-dashboard.component';
import { StudentsComponent } from './pages/dashboard/students.component';
import { AnalyticsComponent } from './pages/dashboard/analytics.component';
import { SettingsComponent } from './pages/dashboard/settings.component';
import { ProfileComponent } from './pages/dashboard/profile.component';
import { StudentProfileComponent } from './pages/student/student-profile.component';
import { StudentGamesComponent } from './pages/student/student-games.component';
import { StudentStatsComponent } from './pages/student/student-stats.component';
import { StudentSettingsComponent } from './pages/student/student-settings.component';
import { FileUploadContainerComponent } from './pages/auth/file-upload-container.component';
import { TeacherHomeComponent } from './pages/dashboard/home.component';
import { StudentHomeComponent } from './pages/student/home.component';
import { LeaderboardComponent } from './pages/dashboard/leaderboard.component';

export const routes: Routes = [
  { path: '', component: LandingComponent },
  { path: 'teacher', component: TeacherOptionsComponent },
  { path: 'teacher/signup', component: SignUpComponent },
  { path: 'teacher/login', component: SignInComponent },
  { path: 'student/login', component: SignInComponent },
  { path: 'verify-email', component: EmailVerificationComponent },
  { path: 'auth/callback', component: AuthCallbackComponent },
  { path: 'upload', component: FileUploadContainerComponent },
  {
    path: 'dashboard',
    component: TeacherDashboardComponent,
    children: [
      { path: '', redirectTo: 'home', pathMatch: 'full' },
      { path: 'home', component: TeacherHomeComponent },
      { path: 'students', component: StudentsComponent },
      { path: 'analytics', component: AnalyticsComponent },
      { path: 'leaderboard', component: LeaderboardComponent },
      { path: 'settings', component: SettingsComponent },
      { path: 'profile', component: ProfileComponent }
    ]
  },
  {
    path: 'student',
    component: StudentDashboardComponent,
    children: [
      { path: '', redirectTo: 'home', pathMatch: 'full' },
      { path: 'home', component: StudentHomeComponent },
      { path: 'profile', component: StudentProfileComponent },
      { path: 'games', component: StudentGamesComponent },
      { path: 'stats', component: StudentStatsComponent },
      { path: 'settings', component: StudentSettingsComponent }
    ]
  },
  { path: '**', redirectTo: '' }
]; 