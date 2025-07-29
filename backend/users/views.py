from django.shortcuts import get_object_or_404
from rest_framework import viewsets, filters, status
from rest_framework.decorators import api_view, permission_classes, action
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response
from .models import User
from .serializers import UserSerializer, TeacherPublicSerializer, ProfileSerializer, ChangePasswordSerializer # <-- Теперь импорт сработает
from backend.permissions import IsAdmin
from courses.models import Course

class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [IsAdmin]
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
@permission_classes([IsAdmin])
def admin_dashboard_stats_view(request):
    stats = {
        'students_count': User.objects.filter(role='student').count(),
        'teachers_count': User.objects.filter(role='teacher').count(),
        'courses_count': Course.objects.count(),
    }
    return Response(stats)

@api_view(['POST'])
@permission_classes([IsAdmin])
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