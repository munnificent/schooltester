from django.urls import path
from .views import current_user_view, change_password_view, admin_dashboard_summary_view, enroll_student_to_courses

# Здесь только те URL, которые не создаются роутером автоматически
urlpatterns = [
    path('users/me/', current_user_view, name='current-user'),
    path('users/change-password/', change_password_view, name='change-password'),
    path('admin-dashboard-summary/', admin_dashboard_summary_view, name='admin-dashboard-summary'),
    path('users/students/<int:pk>/enroll/', enroll_student_to_courses, name='enroll-student'),
]