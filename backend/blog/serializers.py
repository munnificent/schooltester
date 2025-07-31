from rest_framework import serializers
from .models import Category, Post
from users.serializers import UserSerializer # Импортируем для вложенного представления

class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ['id', 'name', 'slug']

class PostSerializer(serializers.ModelSerializer):
    # Используем вложенный сериализатор для получения полной информации
    category = CategorySerializer(read_only=True)
    author = UserSerializer(read_only=True)
    # Поля для записи (ID)
    categoryId = serializers.PrimaryKeyRelatedField(
        queryset=Category.objects.all(), source='category', write_only=True, required=False, allow_null=True
    )

    class Meta:
        model = Post
        fields = [
            'id', 'title', 'slug', 'content', 'excerpt', 'image',
            'createdAt', 'updatedAt', 'author', 'category', 'categoryId'
        ]
        read_only_fields = ('createdAt', 'updatedAt', 'author') # Автор будет устанавливаться автоматически

    def create(self, validated_data):
        # Устанавливаем автора из запроса
        validated_data['author'] = self.context['request'].user
        return super().create(validated_data)