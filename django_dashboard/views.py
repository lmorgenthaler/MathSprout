from django.shortcuts import render
from .services.analytics_service import AnalyticsService
import plotly.graph_objs as go
import json
from django.http import HttpResponse

def dashboard_view(request):
    analytics_service = AnalyticsService()
    classroom_data = analytics_service._generate_mock_classroom_data()

    # Example Plotly chart data (replace with your real data)
    data = [
        go.Scatter(
            x=[1, 2, 3, 4],
            y=[10, 15, 13, 17],
            mode='markers'
        )
    ]
    layout = go.Layout(
        title='Student Performance Clusters',
        xaxis=dict(title='PCA Component 1'),
        yaxis=dict(title='PCA Component 2')
    )

    context = {
        'classroom_data': classroom_data,
        'plotly_data': json.dumps([d.to_plotly_json() for d in data]),
        'plotly_layout': json.dumps(layout.to_plotly_json()),
    }
    return render(request, 'dashboard.html', context)

def leaderboard_view(request):
    return HttpResponse("<h1>Leaderboard coming soon!</h1>")

def classroom_view(request):
    return HttpResponse("<h1>Classroom Overview coming soon!</h1>")

def student_view(request):
    return HttpResponse("<h1>Student Analytics coming soon!</h1>")

def trends_view(request):
    return HttpResponse("<h1>Performance Trends coming soon!</h1>")
