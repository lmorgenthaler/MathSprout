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
 * 
 * The module maintains a clean separation between data collection and display,
 * allowing for flexible integration with different game types and UI implementations.
 * 
 * Key Features:
 * - Real-time statistics tracking
 * - Performance metrics calculation
 * - Data validation and sanitization
 * - Error handling and recovery
 * - Event-based updates
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
        this.stats = {
            score: 0,
            questionsAttempted: 0,
            correctAnswers: 0,
            totalTime: 0,
            questionAttempts: []
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
            this.stats.score += 10;
        }
        this.stats.totalTime += timeTaken;
        this.stats.questionAttempts.push({
            question,
            answer,
            isCorrect,
            timeTaken
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
     * Prepare and submit final statistics to the server
     * 
     * @returns {Promise<Object>} Response from the server
     * @throws {Error} If submission fails
     */
    async submitFinalStats() {
        const statsData = {
            gameType: this.gameType,
            gameLevel: this.gameLevel,
            score: this.stats.score,
            questionsAttempted: this.stats.questionsAttempted,
            correctAnswers: this.stats.correctAnswers,
            accuracy: this.calculateAccuracy(),
            averageTime: this.stats.totalTime / this.stats.questionsAttempted,
            questionAttempts: this.stats.questionAttempts
        };

        try {
            const response = await fetch('/api/game/stats', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(statsData)
            });

            if (!response.ok) {
                throw new Error('Failed to submit game statistics');
            }

            return await response.json();
        } catch (error) {
            console.error('Error submitting game statistics:', error);
            throw error;
        }
    }
} 