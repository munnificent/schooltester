from django.urls import path
from .views import (
    current_user_view, 
    change_password_view, 
    admin_dashboard_summary_view, 
    enroll_student_to_courses,
    student_dashboard_summary_view,
    teacher_dashboard_summary_view,
    TeacherStudentsListView
)

# Здесь только те URL, которые не создаются роутером автоматически
urlpatterns = [
    path('users/me/', current_user_view, name='current-user'),
    path('users/change-password/', change_password_view, name='change-password'),
    path('admin-dashboard-summary/', admin_dashboard_summary_view, name='admin-dashboard-summary'),
    path('student-dashboard-summary/', student_dashboard_summary_view, name='student-dashboard-summary'),
    path('teacher-dashboard-summary/', teacher_dashboard_summary_view, name='teacher-dashboard-summary'),
    path('teacher-students/', TeacherStudentsListView.as_view(), name='teacher-students'),
    path('users/students/<int:pk>/enroll/', enroll_student_to_courses, name='enroll-student'),
]