from django.urls import path
from .views import my_courses, upcoming_lessons

# Здесь только кастомные URL, которые не создаются роутером автоматически
urlpatterns = [
    path('courses/my/', my_courses, name='my-courses'),
    path('courses/upcoming-lessons/', upcoming_lessons, name='upcoming-lessons'),
]