from rest_framework import serializers
from .models import Course, Lesson
from users.serializers import UserSerializer

class LessonSerializer(serializers.ModelSerializer):
    """Сериализатор для модели Урока."""
    class Meta:
        model = Lesson
        fields = ('id', 'title', 'content', 'course')
        # --- ИЗМЕНЕНИЕ ЗДЕСЬ ---
        # Делаем поле 'course' доступным только для чтения.
        # Это означает, что мы не ожидаем его в POST/PATCH запросах,
        # т.к. оно подставляется автоматически из URL.
        read_only_fields = ('course',)


class CourseSerializer(serializers.ModelSerializer):
    """Сериализатор для модели Курса."""
    teacher_details = UserSerializer(source='teacher', read_only=True)

    class Meta:
        model = Course
        fields = ('id', 'title', 'description', 'subject', 'price', 'teacher', 'teacher_details')