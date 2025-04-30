/*
MathSprout Statistics Database Schema
===================================

This migration file creates the necessary database tables for tracking
student progress, game performance, and achievements in the MathSprout
application.

Tables Created:
- game_sessions: Stores individual game session data
- level_criteria: Defines requirements for level completion
- achievements: Stores available achievements and their criteria
- student_achievements: Tracks earned achievements by students

Key Features:
- UUID-based primary keys for all tables
- Foreign key constraints for data integrity
- Check constraints for data validation
- Timestamp tracking for all records
- JSONB support for flexible data storage

Data Structure:
- Comprehensive game session tracking
- Detailed level progression criteria
- Flexible achievement system
- Performance metrics storage
- Historical data preservation

Initial Data:
- Predefined level criteria for all game types
- Initial achievement definitions
- Default completion requirements
- Standard performance thresholds

Technical Details:
- PostgreSQL-specific features
- UUID generation
- JSONB data type usage
- Constraint definitions
- Index optimization

Last Updated: [Current Date]
Version: 1.0.0
*/

-- Create game_sessions table
CREATE TABLE IF NOT EXISTS game_sessions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    student_id UUID NOT NULL REFERENCES students(id),
    game_type VARCHAR(50) NOT NULL,
    level INTEGER NOT NULL,
    score INTEGER NOT NULL,
    questions_attempted INTEGER NOT NULL,
    correct_answers INTEGER NOT NULL,
    total_time FLOAT NOT NULL,
    accuracy FLOAT NOT NULL,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    question_data JSONB,
    CONSTRAINT valid_game_type CHECK (game_type IN ('addition', 'subtraction', 'matching')),
    CONSTRAINT valid_level CHECK (level BETWEEN 1 AND 3)
);

-- Create level_criteria table
CREATE TABLE IF NOT EXISTS level_criteria (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    game_type VARCHAR(50) NOT NULL,
    level INTEGER NOT NULL,
    required_score INTEGER NOT NULL,
    min_accuracy FLOAT NOT NULL,
    max_time FLOAT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT unique_level_criteria UNIQUE (game_type, level),
    CONSTRAINT valid_game_type CHECK (game_type IN ('addition', 'subtraction', 'matching')),
    CONSTRAINT valid_level CHECK (level BETWEEN 1 AND 3),
    CONSTRAINT valid_required_score CHECK (required_score > 0),
    CONSTRAINT valid_min_accuracy CHECK (min_accuracy BETWEEN 0 AND 100)
);

-- Create achievements table
CREATE TABLE IF NOT EXISTS achievements (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL,
    description TEXT NOT NULL,
    criteria JSONB NOT NULL,
    badge_icon VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create student_achievements table
CREATE TABLE IF NOT EXISTS student_achievements (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    student_id UUID NOT NULL REFERENCES students(id),
    achievement_id UUID NOT NULL REFERENCES achievements(id),
    earned_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT unique_student_achievement UNIQUE (student_id, achievement_id)
);

-- Insert initial level criteria
INSERT INTO level_criteria (game_type, level, required_score, min_accuracy) VALUES
    ('addition', 1, 50, 70),
    ('addition', 2, 75, 75),
    ('addition', 3, 100, 80),
    ('subtraction', 1, 50, 70),
    ('subtraction', 2, 75, 75),
    ('subtraction', 3, 100, 80),
    ('matching', 1, 50, 70),
    ('matching', 2, 75, 75),
    ('matching', 3, 100, 80)
ON CONFLICT (game_type, level) DO NOTHING;

-- Insert initial achievements
INSERT INTO achievements (name, description, criteria, badge_icon) VALUES
    ('Math Rookie', 'Complete your first game with a score of 50 or higher', 
     '{"type": "score", "value": 50, "games": 1}', 'rookie_badge.png'),
    ('Perfect Score', 'Get 100% accuracy in any game level', 
     '{"type": "accuracy", "value": 100}', 'perfect_badge.png'),
    ('Speed Demon', 'Complete a level in under 2 minutes with at least 80% accuracy', 
     '{"type": "time", "value": 120, "min_accuracy": 80}', 'speed_badge.png'),
    ('Addition Master', 'Complete all addition levels with at least 90% accuracy', 
     '{"type": "game_mastery", "game_type": "addition", "min_accuracy": 90}', 'addition_badge.png'),
    ('Subtraction Master', 'Complete all subtraction levels with at least 90% accuracy', 
     '{"type": "game_mastery", "game_type": "subtraction", "min_accuracy": 90}', 'subtraction_badge.png')
ON CONFLICT DO NOTHING; 