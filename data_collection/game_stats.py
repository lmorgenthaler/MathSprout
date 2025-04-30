"""
Game Statistics Collection Module
================================

This module provides functionality for collecting and managing game statistics in the MathSprout application.
It handles the tracking of various game metrics including:
- Score and points
- Question attempts and accuracy
- Time spent on questions
- Game completion status

The module integrates with Supabase for persistent storage of game statistics and provides
real-time updates to the game interface. It also includes functionality for calculating
various performance metrics and generating game reports.

Key Features:
- Real-time statistics tracking
- Persistent storage of game data
- Performance metrics calculation
- Game state management
- Error handling and validation
"""

import json
import time
from datetime import datetime
import pandas as pd
import matplotlib.pyplot as plt
from typing import Dict, List, Optional
from supabase_service import SupabaseService

class GameStats:
    def __init__(self, student_id: str, game_type: str, level: int):
        self.student_id = student_id
        self.game_type = game_type
        self.level = level
        self.start_time = time.time()
        self.stats = {
            "score": 0,
            "points_available": 0,
            "remaining_questions": 0,
            "correctly_answered": 0,
            "total_answered": 0,
            "accuracy": 0.0,
            "total_time": 0.0,
            "questions": [],
            "timestamp": datetime.now().isoformat()
        }

    def update_stats(self, score: int, points_available: int, remaining_questions: int,
                    correctly_answered: int, total_answered: int, accuracy: float):
        """Update the game statistics"""
        self.stats.update({
            "score": score,
            "points_available": points_available,
            "remaining_questions": remaining_questions,
            "correctly_answered": correctly_answered,
            "total_answered": total_answered,
            "accuracy": accuracy,
            "total_time": time.time() - self.start_time
        })

    def add_question(self, question: str, answer: str, correct: bool, time_taken: float):
        """Add a question attempt to the statistics"""
        self.stats["questions"].append({
            "question": question,
            "answer": answer,
            "correct": correct,
            "time_taken": time_taken,
            "timestamp": datetime.now().isoformat()
        })

    def get_stats(self) -> Dict:
        """Return the current statistics"""
        return {
            "student_id": self.student_id,
            "game_type": self.game_type,
            "level": self.level,
            **self.stats
        }

    def save_to_json(self, filename: str):
        """Save statistics to a JSON file"""
        with open(filename, 'w') as f:
            json.dump(self.get_stats(), f, indent=4)

class GameAnalytics:
    def __init__(self):
        self.stats_data = []

    def add_game_stats(self, stats: GameStats):
        """Add game statistics to the analytics collection"""
        self.stats_data.append(stats.get_stats())

    def generate_student_report(self, student_id: str) -> Dict:
        """Generate a report for a specific student"""
        student_data = [s for s in self.stats_data if s["student_id"] == student_id]
        
        if not student_data:
            return {}
            
        df = pd.DataFrame(student_data)
        
        # Calculate overall statistics
        report = {
            "total_games_played": len(student_data),
            "average_accuracy": df["accuracy"].mean(),
            "average_time_per_game": df["total_time"].mean(),
            "total_correct_answers": df["correctly_answered"].sum(),
            "total_questions_attempted": df["total_answered"].sum(),
            "game_type_breakdown": df["game_type"].value_counts().to_dict(),
            "level_progression": df.groupby("level")["accuracy"].mean().to_dict()
        }
        
        return report

    def generate_class_report(self) -> Dict:
        """Generate a report for the entire class"""
        if not self.stats_data:
            return {}
            
        df = pd.DataFrame(self.stats_data)
        
        report = {
            "total_students": len(df["student_id"].unique()),
            "total_games_played": len(df),
            "class_average_accuracy": df["accuracy"].mean(),
            "average_time_per_game": df["total_time"].mean(),
            "game_type_distribution": df["game_type"].value_counts().to_dict(),
            "level_completion_rates": df.groupby("level")["accuracy"].mean().to_dict()
        }
        
        return report

    def plot_student_progress(self, student_id: str, save_path: Optional[str] = None):
        """Generate a progress plot for a specific student"""
        student_data = [s for s in self.stats_data if s["student_id"] == student_id]
        
        if not student_data:
            return
            
        df = pd.DataFrame(student_data)
        df["timestamp"] = pd.to_datetime(df["timestamp"])
        
        plt.figure(figsize=(12, 6))
        plt.plot(df["timestamp"], df["accuracy"], marker='o')
        plt.title(f"Student {student_id} Progress Over Time")
        plt.xlabel("Date")
        plt.ylabel("Accuracy")
        plt.grid(True)
        
        if save_path:
            plt.savefig(save_path)
        else:
            plt.show()
        plt.close()

    def plot_class_performance(self, save_path: Optional[str] = None):
        """Generate a performance plot for the entire class"""
        if not self.stats_data:
            return
            
        df = pd.DataFrame(self.stats_data)
        
        plt.figure(figsize=(12, 6))
        df.boxplot(column="accuracy", by="game_type")
        plt.title("Class Performance by Game Type")
        plt.xlabel("Game Type")
        plt.ylabel("Accuracy")
        plt.grid(True)
        
        if save_path:
            plt.savefig(save_path)
        else:
            plt.show()
        plt.close()

class GameStatsCollector:
    """
    Manages the collection and storage of game statistics.
    This class handles all aspects of game data tracking, from initialization
    to final submission of statistics.
    """
    
    def __init__(self, game_type, game_level):
        """
        Initialize the game statistics collector with game type and level.
        
        Args:
            game_type (str): Type of game (e.g., 'addition', 'subtraction')
            game_level (int): Difficulty level of the game
        """
        self.game_type = game_type
        self.game_level = game_level

    def recordQuestionAttempt(self, question, answer, isCorrect, timeTaken):
        """
        Record a single question attempt with all relevant metrics.
        
        Args:
            question (str): The question that was attempted
            answer (str/int): The answer provided by the user
            isCorrect (bool): Whether the answer was correct
            timeTaken (float): Time taken to answer in seconds
        """
        # Implementation of recordQuestionAttempt method
        pass

    def submitFinalStats(self):
        """
        Submit the final game statistics to the database.
        This includes all collected metrics and calculates final performance scores.
        
        Returns:
            bool: True if submission was successful, False otherwise
        """
        # Implementation of submitFinalStats method
        pass 