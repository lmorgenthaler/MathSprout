"""
Game Statistics API Routes
=========================

This module defines the URL patterns for the game statistics API endpoints.
It provides routes for:
- Submitting game statistics
- Retrieving individual student statistics
- Retrieving class-wide statistics

All routes are designed to work with the Supabase backend service for data persistence
and retrieval. The routes follow RESTful conventions and return JSON responses.

URL Patterns:
- /submit-game-stats/ : POST endpoint for submitting game statistics
- /student-stats/<student_id>/ : GET endpoint for retrieving student-specific stats
- /class-stats/ : GET endpoint for retrieving aggregated class statistics
"""

from django.urls import path
from . import views

urlpatterns = [
    # Endpoint for submitting game statistics
    # Accepts POST requests with game statistics data
    path('submit-game-stats/', views.submit_game_stats, name='submit_game_stats'),
    
    # Endpoint for retrieving individual student statistics
    # Accepts GET requests with student_id parameter
    path('student-stats/<str:student_id>/', views.get_student_stats, name='get_student_stats'),
    
    # Endpoint for retrieving class-wide statistics
    # Accepts GET requests and returns aggregated statistics
    path('class-stats/', views.get_class_stats, name='get_class_stats'),
] 