from django.shortcuts import render
from django_dashboard.services.analytics_service import AnalyticsService 
import plotly.graph_objs as go
import json

def dashboard_view(request):
    analytics_service = AnalyticsService()
    classroom_data = analytics_service._generate_mock_classroom_data()

    # Example metrics (replace with real data as needed)
    metrics = {
        "total_students": 120,
        "total_classes": 8,
        "avg_score": 87,
        "engagement_rate": 92,
    }

    # Example performance data for Plotly
    performance_data = [
        {
            "x": ["2024-04-01", "2024-04-02", "2024-04-03", "2024-04-04"],
            "y": [80, 85, 90, 87],
            "type": "scatter",
            "mode": "lines+markers",
            "name": "Average Score"
        }
    ]

    # Example skill distribution data
    skill_data = [
        {
            "x": ["Addition", "Subtraction", "Multiplication", "Division"],
            "y": [90, 85, 80, 88],
            "type": "bar",
            "name": "Skill Scores"
        }
    ]

    # Example learning progress data
    progress_data = [
        {
            "x": ["Week 1", "Week 2", "Week 3", "Week 4"],
            "y": [70, 75, 80, 87],
            "type": "scatter",
            "mode": "lines+markers",
            "name": "Progress"
        }
    ]

    context = {
        "metrics": metrics,
        "performance_data": json.dumps(performance_data),
        "skill_data": json.dumps(skill_data),
        "progress_data": json.dumps(progress_data),
    }
    return render(request, "dashboard.html", context)
