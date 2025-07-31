from rest_framework import serializers
from .models import Course, Lesson
from users.serializers import UserSerializer

class LessonSerializer(serializers.ModelSerializer):
    class Meta:
        model = Lesson
        fields = ('id', 'title', 'content', 'course', 'date', 'time', 'status', 'recording_url', 'homework_url')
        read_only_fields = ('course',)

class CourseSerializer(serializers.ModelSerializer):
    teacher = UserSerializer(read_only=True)
    students = UserSerializer(many=True, read_only=True)
    lessons = LessonSerializer(many=True, read_only=True)

    class Meta:
        model = Course
        fields = ('id', 'title', 'description', 'subject', 'price', 'teacher', 'students', 'lessons')