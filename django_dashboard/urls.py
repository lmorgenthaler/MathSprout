from django.urls import path
from . import views

urlpatterns = [
    path('', views.dashboard_view, name='dashboard'),
    path('dashboard/', views.dashboard_view, name='dashboard'),
    path('leaderboard/', views.leaderboard_view, name='leaderboard'),
    path('classroom/', views.classroom_view, name='classroom'),
    path('student/', views.student_view, name='student'),
    path('trends/', views.trends_view, name='trends'),
]
