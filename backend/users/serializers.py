from rest_framework import serializers
from .models import User, Profile

# --- Сериализатор для смены пароля (оставляем без изменений) ---
class ChangePasswordSerializer(serializers.Serializer):
    old_password = serializers.CharField(required=True)
    new_password = serializers.CharField(required=True)

# --- Сериализатор для профиля (оставляем без изменений) ---
class ProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = Profile
        fields = ['photo_url', 'public_description', 'enrolled_courses']


# --- Основной сериализатор пользователя ---
class UserSerializer(serializers.ModelSerializer):
    profile = ProfileSerializer(read_only=True) # Профиль только для чтения

    class Meta:
        model = User
        # Убираем 'password' из списка, т.к. он будет задан автоматически
        fields = [
            'id', 
            'username', 
            'email', 
            'first_name', 
            'last_name', 
            'role', 
            'profile',
            'avatar',
            'is_active',
            'last_login'
        ]
        # Пароль больше не принимается, а username только для чтения
        extra_kwargs = {
            'username': {'read_only': True},
        }

    def create(self, validated_data):
        """
        Переопределяем метод create.
        1. Автоматически задаем username из email.
        2. Устанавливаем пароль по умолчанию.
        """
        # Задаем username
        validated_data['username'] = validated_data.get('email')
        
        # Задаем пароль по умолчанию
        password = "235689qW#"
        
        # Создаем пользователя через менеджер, который правильно хеширует пароль
        user = User.objects.create_user(password=password, **validated_data)
        
        return user

# --- Публичный сериализатор для преподавателей (оставляем без изменений) ---
class TeacherPublicSerializer(serializers.ModelSerializer):
    profile = ProfileSerializer(read_only=True)

    class Meta:
        model = User
        fields = ['id', 'first_name', 'last_name', 'profile']