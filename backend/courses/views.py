from rest_framework import viewsets, filters, status
from rest_framework.permissions import IsAdminUser, AllowAny, IsAuthenticated
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from django.utils import timezone
from .models import Course, Lesson
from .serializers import CourseSerializer, LessonSerializer
from backend.permissions import IsAdminOrReadOnly, IsTeacherOfCourseOrAdmin, IsTeacher

class CourseViewSet(viewsets.ModelViewSet):
    queryset = Course.objects.select_related('teacher').prefetch_related('students', 'lessons').all()
    serializer_class = CourseSerializer
    permission_classes = [IsAdminOrReadOnly]
    filter_backends = [filters.SearchFilter]
    search_fields = ['title', 'subject', 'teacher__first_name', 'teacher__last_name']

class LessonViewSet(viewsets.ModelViewSet):
    serializer_class = LessonSerializer
    permission_classes = [IsTeacherOfCourseOrAdmin]

    def get_queryset(self):
        return Lesson.objects.filter(course_id=self.kwargs['course_pk'])

    def perform_create(self, serializer):
        course = Course.objects.get(pk=self.kwargs['course_pk'])
        serializer.save(course=course)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def my_courses(request):
    if not hasattr(request.user, 'profile'):
        return Response([], status=status.HTTP_200_OK)
        
    enrolled_courses = request.user.profile.enrolled_courses.all()
    serializer = CourseSerializer(enrolled_courses, many=True)
    return Response(serializer.data)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def upcoming_lessons(request):
    if not hasattr(request.user, 'profile'):
        return Response([], status=status.HTTP_200_OK)

    student_courses = request.user.profile.enrolled_courses.all()
    upcoming = Lesson.objects.filter(
        course__in=student_courses,
        date__gte=timezone.now().date()
    ).order_by('date', 'time')

    serializer = LessonSerializer(upcoming, many=True)
    return Response(serializer.data)

@api_view(['GET'])
@permission_classes([IsTeacher])
def my_teaching_courses(request):
    courses = Course.objects.filter(teacher=request.user)
    serializer = CourseSerializer(courses, many=True)
    return Response(serializer.data)