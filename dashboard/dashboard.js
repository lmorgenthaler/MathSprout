/**
 * MathSprout Dashboard Controller
 * ==============================
 * 
 * This module implements the core functionality of the MathSprout student dashboard.
 * It handles data fetching, visualization, and real-time updates of student progress
 * and performance metrics.
 * 
 * Key Functionality:
 * - Asynchronous data loading and processing
 * - Interactive chart rendering and updates
 * - Real-time statistics calculation
 * - Level progress tracking
 * - Session history management
 * 
 * Technical Implementation:
 * - Object-oriented design with Dashboard class
 * - Modern async/await pattern for API calls
 * - Chart.js integration for data visualization
 * - Event-driven updates
 * - Error handling and recovery
 * 
 * Data Management:
 * - Efficient data caching
 * - Optimized updates
 * - Error state handling
 * - Loading state management
 * 
 * Integration Points:
 * - Student statistics API
 * - Authentication system
 * - Game session tracking
 * - Achievement system
 * 
 * Last Updated: [Current Date]
 * Version: 1.0.0
 */

// Dashboard functionality
class Dashboard {
    constructor() {
        this.charts = {};
        this.studentData = null;
        this.initialize();
    }

    async initialize() {
        try {
            await this.loadStudentData();
            this.setupCharts();
            this.updateStats();
            this.updateLevelProgress();
            this.updateRecentActivity();
        } catch (error) {
            console.error('Error initializing dashboard:', error);
        }
    }

    async loadStudentData() {
        try {
            const response = await fetch('/api/student/stats');
            if (!response.ok) throw new Error('Failed to load student data');
            this.studentData = await response.json();
            document.getElementById('student-name').textContent = this.studentData.name;
        } catch (error) {
            console.error('Error loading student data:', error);
        }
    }

    setupCharts() {
        // Progress over time chart
        const progressCtx = document.getElementById('progress-chart').getContext('2d');
        this.charts.progress = new Chart(progressCtx, {
            type: 'line',
            data: {
                labels: this.getProgressLabels(),
                datasets: [{
                    label: 'Score',
                    data: this.getProgressData('score'),
                    borderColor: '#4CAF50',
                    tension: 0.4
                }, {
                    label: 'Accuracy',
                    data: this.getProgressData('accuracy'),
                    borderColor: '#2196F3',
                    tension: 0.4
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'bottom'
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        });

        // Game type performance chart
        const gameTypeCtx = document.getElementById('game-type-chart').getContext('2d');
        this.charts.gameType = new Chart(gameTypeCtx, {
            type: 'bar',
            data: {
                labels: ['Addition', 'Subtraction', 'Matching'],
                datasets: [{
                    label: 'Average Score',
                    data: this.getGameTypeData(),
                    backgroundColor: [
                        '#4CAF50',
                        '#2196F3',
                        '#FFC107'
                    ]
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        });
    }

    getProgressLabels() {
        return this.studentData?.sessions?.map(session => 
            new Date(session.timestamp).toLocaleDateString()) || [];
    }

    getProgressData(metric) {
        return this.studentData?.sessions?.map(session => session[metric]) || [];
    }

    getGameTypeData() {
        if (!this.studentData?.gameTypeStats) return [0, 0, 0];
        const stats = this.studentData.gameTypeStats;
        return [
            stats.addition?.averageScore || 0,
            stats.subtraction?.averageScore || 0,
            stats.matching?.averageScore || 0
        ];
    }

    updateStats() {
        if (!this.studentData) return;

        document.getElementById('total-score').textContent = 
            this.studentData.totalScore.toLocaleString();
        document.getElementById('average-accuracy').textContent = 
            `${this.studentData.averageAccuracy.toFixed(1)}%`;
        document.getElementById('total-questions').textContent = 
            this.studentData.totalQuestions.toLocaleString();
        document.getElementById('total-time').textContent = 
            `${Math.round(this.studentData.totalTime / 60)} min`;
    }

    updateLevelProgress() {
        if (!this.studentData?.levels) return;

        const levelProgress = document.getElementById('level-progress');
        levelProgress.innerHTML = '';

        Object.entries(this.studentData.levels).forEach(([gameType, levels]) => {
            levels.forEach((level, index) => {
                const levelCard = document.createElement('div');
                levelCard.className = `level-card ${level.locked ? 'locked' : ''}`;
                levelCard.innerHTML = `
                    <div class="level-number">${gameType} Level ${index + 1}</div>
                    <div>Score: ${level.highScore}</div>
                    <div class="progress">
                        <div class="progress-bar" role="progressbar" 
                             style="width: ${level.progress}%" 
                             aria-valuenow="${level.progress}" 
                             aria-valuemin="0" 
                             aria-valuemax="100">
                        </div>
                    </div>
                `;
                levelProgress.appendChild(levelCard);
            });
        });
    }

    updateRecentActivity() {
        if (!this.studentData?.sessions) return;

        const recentActivity = document.getElementById('recent-activity');
        recentActivity.innerHTML = '';

        this.studentData.sessions
            .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
            .slice(0, 10)
            .forEach(session => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${new Date(session.timestamp).toLocaleDateString()}</td>
                    <td>${session.gameType}</td>
                    <td>${session.level}</td>
                    <td>${session.score}</td>
                    <td>${session.accuracy.toFixed(1)}%</td>
                    <td>${Math.round(session.totalTime / 60)} min</td>
                `;
                recentActivity.appendChild(row);
            });
    }
}

// Initialize dashboard when the page loads
window.addEventListener('load', () => {
    window.dashboard = new Dashboard();
});

// Logout functionality
function logout() {
    fetch('/api/auth/logout', { method: 'POST' })
        .then(() => window.location.href = '/login')
        .catch(error => console.error('Error logging out:', error));
} 