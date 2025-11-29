from rest_framework import serializers
from .models import Course, Lesson
from users.serializers import UserSerializer

class LessonSerializer(serializers.ModelSerializer):
    is_completed = serializers.SerializerMethodField()

    class Meta:
        model = Lesson
        fields = ('id', 'title', 'content', 'course', 'date', 'time', 'status', 'recording_url', 'homework_url', 'is_completed')
        read_only_fields = ('course',)

    def get_is_completed(self, obj):
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            return obj.completions.filter(user=request.user).exists()
        return False

class CourseSerializer(serializers.ModelSerializer):
    teacher = UserSerializer(read_only=True)
    students = UserSerializer(many=True, read_only=True)
    lessons = LessonSerializer(many=True, read_only=True)

    class Meta:
        model = Course
        fields = ('id', 'title', 'description', 'subject', 'price', 'teacher', 'students', 'lessons')