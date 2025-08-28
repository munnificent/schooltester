from django.urls import path
from .views import my_courses, upcoming_lessons, my_teaching_courses

# Здесь только кастомные URL, которые не создаются роутером автоматически
urlpatterns = [
    path('courses/my/', my_courses, name='my-courses'),
    path('courses/my-teaching/', my_teaching_courses, name='my-teaching-courses'),
    path('courses/upcoming-lessons/', upcoming_lessons, name='upcoming-lessons'),
]