import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import * as Plotly from 'plotly.js-dist-min';

@Component({
  selector: 'app-analytics',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="p-6">
      <h2 class="text-2xl font-bold mb-6">Classroom Analytics Dashboard</h2>

      <!-- Summary Cards -->
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
          <h3 class="text-lg font-semibold mb-2">Engagement Rate</h3>
          <p class="text-3xl font-bold text-purple-600">{{ engagementRate }}%</p>
        </div>
      </div>

      <!-- Performance Over Time -->
      <div class="bg-white rounded-lg shadow p-6 mb-6">
        <h3 class="text-lg font-semibold mb-4">Performance Over Time</h3>
        <div id="performanceChart" style="width: 100%; height: 400px;"></div>
      </div>

      <!-- Skill Distribution -->
      <div class="bg-white rounded-lg shadow p-6 mb-6">
        <h3 class="text-lg font-semibold mb-4">Skill Distribution</h3>
        <div id="skillChart" style="width: 100%; height: 400px;"></div>
      </div>

      <!-- Student Performance Table -->
      <div class="bg-white rounded-lg shadow p-6">
        <h3 class="text-lg font-semibold mb-4">Student Performance by Subject</h3>
        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Student</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Grade</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Addition</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Subtraction</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Pattern Matching</th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr *ngFor="let student of students">
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm font-medium text-gray-900">{{ student.name }}</div>
                  <div class="text-sm text-gray-500">{{ student.email }}</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                    Grade {{ student.grade }}
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm text-gray-900">{{ student.scores.addition }}%</div>
                  <div class="w-full bg-gray-200 rounded-full h-1.5 mt-1">
                    <div class="bg-blue-600 h-1.5 rounded-full" [style.width.%]="student.scores.addition"></div>
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm text-gray-900">{{ student.scores.subtraction }}%</div>
                  <div class="w-full bg-gray-200 rounded-full h-1.5 mt-1">
                    <div class="bg-green-600 h-1.5 rounded-full" [style.width.%]="student.scores.subtraction"></div>
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm text-gray-900">{{ student.scores.patternMatching }}%</div>
                  <div class="w-full bg-gray-200 rounded-full h-1.5 mt-1">
                    <div class="bg-purple-600 h-1.5 rounded-full" [style.width.%]="student.scores.patternMatching"></div>
                  </div>
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
  // Summary metrics
  totalStudents = 0;
  averageScore = 0;
  engagementRate = 0;

  // Student data
  students: any[] = [];

  // Plotly chart data
  performanceOverTime = {
    data: [
      {
        x: [] as string[],
        y: [] as number[],
        type: 'scatter' as const,
        mode: 'lines+markers' as const,
        name: 'Addition',
        line: { color: '#3b82f6' }  // Blue
      },
      {
        x: [] as string[],
        y: [] as number[],
        type: 'scatter' as const,
        mode: 'lines+markers' as const,
        name: 'Subtraction',
        line: { color: '#10b981' }  // Green
      },
      {
        x: [] as string[],
        y: [] as number[],
        type: 'scatter' as const,
        mode: 'lines+markers' as const,
        name: 'Pattern Matching',
        line: { color: '#8b5cf6' }  // Purple
      }
    ],
    layout: {
      title: { text: 'Average Score Over Time' },
      xaxis: { title: { text: 'Date' } },
      yaxis: { title: { text: 'Score (%)' }, range: [0, 100] }
    }
  };

  skillDistribution = {
    data: [{
      x: [] as string[],
      y: [] as number[],
      type: 'bar' as const,
      marker: {
        color: ['#3b82f6', '#10b981', '#8b5cf6']  // Blue, Green, Purple
      }
    }],
    layout: {
      title: { text: 'Average Score by Skill' },
      yaxis: { title: { text: 'Score (%)' }, range: [0, 100] }
    }
  };

  constructor() {}

  ngOnInit() {
    this.loadMockData();
    this.initializeCharts();
  }

  private initializeCharts() {
    Plotly.newPlot('performanceChart', this.performanceOverTime.data, this.performanceOverTime.layout);
    Plotly.newPlot('skillChart', this.skillDistribution.data, this.skillDistribution.layout);
  }

  private loadMockData() {
    // Summary metrics
    this.totalStudents = 5;
    this.averageScore = 85;
    this.engagementRate = 92;

    // Performance over time data
    const dates = [];
    const additionScores = [];
    const subtractionScores = [];
    const patternScores = [];
    
    for (let i = 0; i < 30; i++) {
      const date = new Date();
      date.setDate(date.getDate() - (29 - i));
      dates.push(date.toLocaleDateString());
      additionScores.push(75 + Math.random() * 20);    // Base score around 75-95
      subtractionScores.push(70 + Math.random() * 25); // Base score around 70-95
      patternScores.push(65 + Math.random() * 30);     // Base score around 65-95
    }

    this.performanceOverTime.data[0].x = dates;
    this.performanceOverTime.data[0].y = additionScores;
    this.performanceOverTime.data[1].x = dates;
    this.performanceOverTime.data[1].y = subtractionScores;
    this.performanceOverTime.data[2].x = dates;
    this.performanceOverTime.data[2].y = patternScores;

    // Skill distribution data - Updated for three subjects
    this.skillDistribution.data[0].x = ['Addition', 'Subtraction', 'Pattern Matching'];
    this.skillDistribution.data[0].y = [90, 85, 78];  // Sample scores

    // Student data with three subjects
    this.students = [
      { 
        name: 'John Doe', 
        email: 'john@example.com', 
        grade: 1, 
        scores: {
          addition: 95,
          subtraction: 90,
          patternMatching: 85
        }
      },
      { 
        name: 'Jane Smith', 
        email: 'jane@example.com', 
        grade: 2, 
        scores: {
          addition: 92,
          subtraction: 88,
          patternMatching: 90
        }
      },
      { 
        name: 'Alex Johnson', 
        email: 'alex@example.com', 
        grade: 1, 
        scores: {
          addition: 88,
          subtraction: 82,
          patternMatching: 75
        }
      },
      { 
        name: 'Emily Brown', 
        email: 'emily@example.com', 
        grade: 2, 
        scores: {
          addition: 85,
          subtraction: 90,
          patternMatching: 80
        }
      },
      { 
        name: 'Michael Davis', 
        email: 'michael@example.com', 
        grade: 2, 
        scores: {
          addition: 82,
          subtraction: 78,
          patternMatching: 70
        }
      }
    ];
  }
}