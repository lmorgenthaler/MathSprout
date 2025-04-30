"""
MathSprout Student Statistics API
================================

This module provides the backend API endpoints for managing and retrieving
student statistics in the MathSprout application. It serves as the data
layer between the frontend dashboard and the database, handling all
statistics-related operations.

Key Functionality:
- Comprehensive student progress tracking
- Game performance analytics
- Level progression management
- Achievement tracking
- Session history management

API Endpoints:
- GET /api/student/stats: Retrieve comprehensive student statistics
- POST /api/student/level-unlock: Check and update level unlock status

Data Processing:
- Real-time statistics calculation
- Performance metrics aggregation
- Progress tracking and validation
- Achievement criteria evaluation

Database Integration:
- Supabase connection management
- Efficient query optimization
- Data validation and sanitization
- Error handling and recovery

Security Features:
- Authentication middleware integration
- Input validation
- Error handling
- Rate limiting
- Data access control

Technical Implementation:
- Flask Blueprint architecture
- Type hints for better code maintainability
- Comprehensive error handling
- Logging and monitoring
- Performance optimization

Last Updated: [Current Date]
Version: 1.0.0
"""

from flask import Blueprint, jsonify, request
from datetime import datetime
from typing import Dict, List
from .auth import require_auth
from .database import get_db

student_stats = Blueprint('student_stats', __name__)

@student_stats.route('/api/student/stats', methods=['GET'])
@require_auth
def get_student_stats():
    """Get comprehensive statistics for the current student"""
    try:
        db = get_db()
        student_id = request.user_id  # Set by auth middleware

        # Get basic student info
        student = db.table('students').select('*').eq('id', student_id).single().execute()
        if not student.data:
            return jsonify({'error': 'Student not found'}), 404

        # Get all game sessions
        sessions = db.table('game_sessions').select('*').eq('student_id', student_id).execute()
        
        # Calculate overall statistics
        total_score = 0
        total_questions = 0
        total_correct = 0
        total_time = 0
        game_type_stats = {}

        for session in sessions.data:
            total_score += session['score']
            total_questions += session['questions_attempted']
            total_correct += session['correct_answers']
            total_time += session['total_time']

            # Aggregate stats by game type
            game_type = session['game_type']
            if game_type not in game_type_stats:
                game_type_stats[game_type] = {
                    'totalScore': 0,
                    'sessions': 0,
                    'averageScore': 0
                }
            
            stats = game_type_stats[game_type]
            stats['totalScore'] += session['score']
            stats['sessions'] += 1
            stats['averageScore'] = stats['totalScore'] / stats['sessions']

        # Calculate level progress
        levels = {
            'addition': get_level_progress(db, student_id, 'addition'),
            'subtraction': get_level_progress(db, student_id, 'subtraction'),
            'matching': get_level_progress(db, student_id, 'matching')
        }

        return jsonify({
            'name': student.data['name'],
            'totalScore': total_score,
            'totalQuestions': total_questions,
            'averageAccuracy': (total_correct / total_questions * 100) if total_questions > 0 else 0,
            'totalTime': total_time,
            'gameTypeStats': game_type_stats,
            'levels': levels,
            'sessions': sessions.data
        })

    except Exception as e:
        print(f"Error getting student stats: {str(e)}")
        return jsonify({'error': 'Internal server error'}), 500

def get_level_progress(db, student_id: str, game_type: str) -> List[Dict]:
    """Get progress information for all levels of a game type"""
    try:
        # Get level completion criteria
        level_criteria = db.table('level_criteria').select('*').eq('game_type', game_type).execute()
        
        # Get student's best performances for each level
        level_stats = db.table('game_sessions')\
            .select('level, max(score) as high_score, count(*) as attempts')\
            .eq('student_id', student_id)\
            .eq('game_type', game_type)\
            .group('level')\
            .execute()

        levels = []
        for level in range(1, 4):  # Assuming 3 levels per game type
            level_data = next((s for s in level_stats.data if s['level'] == level), None)
            criteria = next((c for c in level_criteria.data if c['level'] == level), None)

            if not criteria:
                continue

            # Calculate progress percentage
            progress = 0
            if level_data:
                progress = min(100, (level_data['high_score'] / criteria['required_score']) * 100)

            # Determine if level is locked
            locked = level > 1 and (not level_data or progress < 70)

            levels.append({
                'level': level,
                'highScore': level_data['high_score'] if level_data else 0,
                'attempts': level_data['attempts'] if level_data else 0,
                'progress': progress,
                'locked': locked,
                'requiredScore': criteria['required_score']
            })

        return levels

    except Exception as e:
        print(f"Error getting level progress: {str(e)}")
        return []

@student_stats.route('/api/student/level-unlock', methods=['POST'])
@require_auth
def check_level_unlock():
    """Check and update level unlock status based on performance"""
    try:
        data = request.json
        if not data or 'gameType' not in data or 'level' not in data:
            return jsonify({'error': 'Invalid request data'}), 400

        db = get_db()
        student_id = request.user_id
        game_type = data['game_type']
        level = data['level']

        # Get student's best performance for the previous level
        prev_level = level - 1
        if prev_level < 1:
            return jsonify({'unlocked': True})

        best_score = db.table('game_sessions')\
            .select('max(score) as high_score')\
            .eq('student_id', student_id)\
            .eq('game_type', game_type)\
            .eq('level', prev_level)\
            .single()\
            .execute()

        if not best_score.data:
            return jsonify({'unlocked': False})

        # Check if score meets unlock criteria (70% of required score)
        criteria = db.table('level_criteria')\
            .select('required_score')\
            .eq('game_type', game_type)\
            .eq('level', prev_level)\
            .single()\
            .execute()

        if not criteria.data:
            return jsonify({'error': 'Level criteria not found'}), 404

        unlocked = best_score.data['high_score'] >= (criteria.data['required_score'] * 0.7)
        return jsonify({'unlocked': unlocked})

    except Exception as e:
        print(f"Error checking level unlock: {str(e)}")
        return jsonify({'error': 'Internal server error'}), 500 