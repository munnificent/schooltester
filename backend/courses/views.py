from rest_framework import viewsets, filters, status
from rest_framework.permissions import IsAdminUser, AllowAny, IsAuthenticated
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from django.utils import timezone
from .models import Course, Lesson
from .serializers import CourseSerializer, LessonSerializer
from backend.permissions import IsAdminOrReadOnly

# ViewSet для курсов (остается без изменений)
class CourseViewSet(viewsets.ModelViewSet):
    queryset = Course.objects.select_related('teacher').all()
    serializer_class = CourseSerializer
    permission_classes = [IsAdminOrReadOnly]
    filter_backends = [filters.SearchFilter]
    search_fields = ['title', 'subject', 'teacher__first_name', 'teacher__last_name']

# ViewSet для уроков (остается без изменений)
class LessonViewSet(viewsets.ModelViewSet):
    queryset = Lesson.objects.all()
    serializer_class = LessonSerializer
    permission_classes = [IsAdminUser]

    def get_queryset(self):
        return Lesson.objects.filter(course_id=self.kwargs['course_pk'])

    def perform_create(self, serializer):
        serializer.save(course_id=self.kwargs['course_pk'])


# --- НОВЫЕ VIEW ДЛЯ ЛИЧНОГО КАБИНЕТА СТУДЕНТА ---

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def my_courses(request):
    """
    Возвращает список курсов, на которые записан текущий студент.
    """
    if not hasattr(request.user, 'profile'):
        return Response([], status=status.HTTP_200_OK)
        
    enrolled_courses = request.user.profile.enrolled_courses.all()
    serializer = CourseSerializer(enrolled_courses, many=True)
    return Response(serializer.data)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def upcoming_lessons(request):
    """
    Возвращает список предстоящих уроков для текущего студента.
    Считаем, что у модели Lesson есть поле 'date' типа DateField или DateTimeField.
    """
    if not hasattr(request.user, 'profile'):
        return Response([], status=status.HTTP_200_OK)

    # Находим все курсы студента
    student_courses = request.user.profile.enrolled_courses.all()
    
    # Находим все предстоящие уроки для этих курсов
    # Для этого в модели Lesson должно быть поле 'date' или 'start_time'
    # Предположим, что оно называется 'date'
    # upcoming = Lesson.objects.filter(
    #     course__in=student_courses,
    #     date__gte=timezone.now() # Фильтруем по дате, которая больше или равна текущей
    # ).order_by('date')
    
    # ВРЕМЕННАЯ ЗАГЛУШКА: так как в модели Lesson нет поля date,
    # вернем пока все уроки студента, чтобы не было ошибки.
    # TODO: Добавить поле 'date' в модель Lesson и раскомментировать код выше.
    upcoming = Lesson.objects.filter(course__in=student_courses)

    serializer = LessonSerializer(upcoming, many=True)
    return Response(serializer.data)