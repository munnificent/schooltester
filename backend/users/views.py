from django.shortcuts import get_object_or_404
from rest_framework import viewsets, permissions, status, filters
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.decorators import action, api_view, permission_classes
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.pagination import PageNumberPagination

from .models import User
from .serializers import UserSerializer, TeacherPublicSerializer, ChangePasswordSerializer
from courses.models import Course, Lesson
from applications.models import Application
from courses.serializers import CourseSerializer, LessonSerializer
from applications.serializers import ApplicationSerializer
from backend.permissions import IsTeacher
from django.utils import timezone

class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAdminUser]
    filter_backends = [filters.SearchFilter]
    search_fields = ['username', 'email', 'first_name', 'last_name']

    def get_queryset(self):
        queryset = super().get_queryset()
        role = self.request.query_params.get('role')
        if role:
            queryset = queryset.filter(role=role)
        return queryset

class TeacherPublicViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = User.objects.filter(role='teacher', is_active=True)
    serializer_class = TeacherPublicSerializer
    permission_classes = [AllowAny]

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def current_user_view(request):
    serializer = UserSerializer(request.user)
    return Response(serializer.data)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def change_password_view(request):
    serializer = ChangePasswordSerializer(data=request.data)
    if serializer.is_valid():
        user = request.user
        if not user.check_password(serializer.data.get("old_password")):
            return Response({"old_password": ["Wrong password."]}, status=status.HTTP_400_BAD_REQUEST)
        user.set_password(serializer.data.get("new_password"))
        user.save()
        return Response({"status": "password set"}, status=status.HTTP_200_OK)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET'])
@permission_classes([permissions.IsAdminUser])
def admin_dashboard_summary_view(request):
    stats = {
        'studentsCount': User.objects.filter(role='student').count(),
        'teachersCount': User.objects.filter(role='teacher').count(),
        'coursesCount': Course.objects.count(),
        'newApplicationsCount': Application.objects.filter(status='new').count(),
    }
    recent_applications = Application.objects.order_by('-created_at')[:5]
    dashboard_data = {
        'stats': stats,
        'recentApplications': ApplicationSerializer(recent_applications, many=True).data
    }
    return Response(dashboard_data)

@api_view(['POST'])
@permission_classes([permissions.IsAdminUser])
def enroll_student_to_courses(request, pk):
    try:
        user = User.objects.get(pk=pk, role='student')
    except User.DoesNotExist:
        return Response({'error': 'Студент не найден.'}, status=status.HTTP_404_NOT_FOUND)

    course_ids = request.data.get('course_ids')
    if not isinstance(course_ids, list):
        return Response({'error': 'Ожидается список ID курсов в "course_ids".'}, status=status.HTTP_400_BAD_REQUEST)

    courses = Course.objects.filter(id__in=course_ids)
    user.profile.enrolled_courses.set(courses)
    
    return Response({'status': f'Студент {user.username} обновлен в курсах.'}, status=status.HTTP_200_OK)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def student_dashboard_summary_view(request):
    user = request.user
    enrolled_courses = user.profile.enrolled_courses.all()
    upcoming_lessons = Lesson.objects.filter(
        course__in=enrolled_courses,
        date__gte=timezone.now()
    ).order_by('date', 'time')[:5]

    summary_data = {
        'enrolledCoursesCount': enrolled_courses.count(),
        'upcomingLessons': LessonSerializer(upcoming_lessons, many=True).data,
    }
    return Response(summary_data)

@api_view(['GET'])
@permission_classes([IsTeacher])
def teacher_dashboard_summary_view(request):
    teacher = request.user
    courses_taught = Course.objects.filter(teacher=teacher)
    course_count = courses_taught.count()

    student_ids = set()
    for course in courses_taught:
        student_ids.update(course.students.values_list('id', flat=True))
    
    student_count = len(student_ids)

    return Response({
        'courseCount': course_count,
        'studentCount': student_count,
    })


from rest_framework import generics

class TeacherStudentsListView(generics.ListAPIView):
    """
    Returns a paginated list of unique students taught by the logged-in teacher.
    Supports search on first_name, last_name, and email.
    """
    permission_classes = [IsTeacher]
    serializer_class = UserSerializer
    filter_backends = [filters.SearchFilter]
    search_fields = ['first_name', 'last_name', 'email']

    def get_queryset(self):
        teacher = self.request.user
        courses_taught = Course.objects.filter(teacher=teacher)
        
        student_ids = set()
        for course in courses_taught:
            student_ids.update(course.students.values_list('id', flat=True))
            
        return User.objects.filter(id__in=student_ids).order_by('first_name', 'last_name')