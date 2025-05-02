from django.urls import path
from . import views

urlpatterns = [
    path('create-student/', views.create_student, name='create-student'),
    path('create-teacher/', views.create_teacher, name='create-teacher'),
    path('delete-student/<str:user_id>/', views.delete_student, name='delete-student'),
] 