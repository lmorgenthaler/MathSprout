/**
 * Game Statistics Collection Module
 * ================================
 * 
 * This module handles client-side game statistics collection and management.
 * It provides functionality for:
 * - Tracking game performance metrics in real-time
 * - Calculating accuracy and timing statistics
 * - Managing question attempts and results
 * - Preparing data for submission to the server
 */

class GameStatsCollector {
    /**
     * Initialize a new game statistics collector
     * 
     * @param {string} gameType - Type of game being played (e.g., 'addition', 'subtraction')
     * @param {number} gameLevel - Current level of the game
     */
    constructor(gameType, gameLevel) {
        this.gameType = gameType;
        this.gameLevel = gameLevel;
        this.startTime = Date.now();
        this.stats = {
            score: 0,
            questionsAttempted: 0,
            correctAnswers: 0,
            totalTime: 0,
            questionAttempts: [],
            gameType: gameType,
            gameLevel: gameLevel,
            timestamp: new Date().toISOString()
        };
    }

    /**
     * Record a question attempt with its result and timing
     * 
     * @param {string} question - The question that was attempted
     * @param {string|number} answer - The answer provided by the player
     * @param {boolean} isCorrect - Whether the answer was correct
     * @param {number} timeTaken - Time taken to answer in milliseconds
     */
    recordQuestionAttempt(question, answer, isCorrect, timeTaken) {
        this.stats.questionsAttempted++;
        if (isCorrect) {
            this.stats.correctAnswers++;
        }
        this.stats.totalTime += timeTaken;
        this.stats.questionAttempts.push({
            question,
            answer,
            isCorrect,
            timeTaken,
            timestamp: new Date().toISOString()
        });
    }

    /**
     * Calculate and return the current accuracy percentage
     * 
     * @returns {number} Accuracy percentage (0-100)
     */
    calculateAccuracy() {
        if (this.stats.questionsAttempted === 0) return 0;
        return (this.stats.correctAnswers / this.stats.questionsAttempted) * 100;
    }

    /**
     * Update game statistics with current values
     * 
     * @param {number} score - Current game score
     * @param {number} points - Available points
     * @param {number} remainingQuestions - Number of questions remaining
     * @param {number} correctlyAnswered - Number of correctly answered questions
     * @param {number} totalAnswered - Total number of questions answered
     */
    updateGameStats(score, points, remainingQuestions, correctlyAnswered, totalAnswered) {
        this.stats.score = score;
        this.stats.correctAnswers = correctlyAnswered;
        this.stats.questionsAttempted = totalAnswered;
        this.stats.accuracy = this.calculateAccuracy();
        this.stats.totalTime = (Date.now() - this.startTime) / 1000; // Convert to seconds
    }

    /**
     * Prepare and submit final statistics to the server
     * 
     * @returns {Promise<boolean>} True if submission was successful, false otherwise
     */
    async submitFinalStats() {
        const finalStats = {
            ...this.stats,
            finalScore: this.stats.score,
            accuracy: this.calculateAccuracy(),
            averageTimePerQuestion: this.stats.totalTime / this.stats.questionsAttempted || 0,
            endTime: new Date().toISOString()
        };

        try {
            const response = await fetch('/api/game/stats', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(finalStats)
            });

            if (!response.ok) {
                console.error('Failed to submit game statistics');
                return false;
            }

            return true;
        } catch (error) {
            console.error('Error submitting game statistics:', error);
            return false;
        }
    }
}

// Global initialization function
window.initGameStats = function(gameType, gameLevel) {
    window.gameStatsCollector = new GameStatsCollector(gameType, gameLevel);
};

// Global update function
window.updateGameStats = function(score, points, remainingQuestions, correctlyAnswered, totalAnswered) {
    if (window.gameStatsCollector) {
        window.gameStatsCollector.updateGameStats(score, points, remainingQuestions, correctlyAnswered, totalAnswered);
    }
}; 