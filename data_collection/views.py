"""
Game Statistics API Views
========================

This module contains the view functions for handling game statistics API requests.
It provides functionality for:
- Processing and storing game statistics
- Retrieving individual student performance data
- Aggregating and returning class-wide statistics

The views integrate with the Supabase service for data persistence and retrieval.
All endpoints return JSON responses and include proper error handling.

Key Features:
- CSRF exemption for POST requests
- HTTP method restrictions
- Error handling and logging
- JSON response formatting
- Environment variable configuration
"""

from django.http import JsonResponse
from django.views.decorators.http import require_http_methods
from django.views.decorators.csrf import csrf_exempt
from .supabase_service import SupabaseService
import os
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

# Initialize Supabase service with environment variables
supabase_service = SupabaseService(
    url=os.getenv('SUPABASE_URL'),
    key=os.getenv('SUPABASE_KEY')
)

@csrf_exempt
@require_http_methods(["POST"])
def submit_game_stats(request):
    """
    Handle submission of game statistics.
    
    This view processes POST requests containing game statistics data,
    submits the data to Supabase, and returns a JSON response indicating
    success or failure.
    
    Args:
        request: Django HttpRequest object containing JSON data
        
    Returns:
        JsonResponse: Success or error response with appropriate status code
    """
    try:
        # Get the stats data from the request
        stats_data = request.json()
        
        # Submit the stats to Supabase
        success = supabase_service.submit_game_stats(stats_data)
        
        if success:
            return JsonResponse({"status": "success", "message": "Stats submitted successfully"})
        else:
            return JsonResponse({"status": "error", "message": "Failed to submit stats"}, status=500)
            
    except Exception as e:
        return JsonResponse({"status": "error", "message": str(e)}, status=500)

@require_http_methods(["GET"])
def get_student_stats(request, student_id):
    """
    Retrieve statistics for a specific student.
    
    This view processes GET requests for individual student statistics,
    retrieves the data from Supabase, and returns it as a JSON response.
    
    Args:
        request: Django HttpRequest object
        student_id: String identifier for the student
        
    Returns:
        JsonResponse: Student statistics or error response
    """
    try:
        # Get student stats from Supabase
        stats = supabase_service.get_student_stats(student_id)
        return JsonResponse({"status": "success", "data": stats})
        
    except Exception as e:
        return JsonResponse({"status": "error", "message": str(e)}, status=500)

@require_http_methods(["GET"])
def get_class_stats(request):
    """
    Retrieve aggregated statistics for the entire class.
    
    This view processes GET requests for class-wide statistics,
    retrieves and aggregates the data from Supabase, and returns
    it as a JSON response.
    
    Args:
        request: Django HttpRequest object
        
    Returns:
        JsonResponse: Class statistics or error response
    """
    try:
        # Get class stats from Supabase
        stats = supabase_service.get_class_stats()
        return JsonResponse({"status": "success", "data": stats})
        
    except Exception as e:
        return JsonResponse({"status": "error", "message": str(e)}, status=500) 