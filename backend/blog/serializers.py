# backend/blog/serializers.py

from rest_framework import serializers
from .models import Category, Post

class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ['id', 'name', 'slug']

class PostSerializer(serializers.ModelSerializer):
    # Для удобства фронтенда сразу отдаем имя категории и автора
    category_name = serializers.CharField(source='category.name', read_only=True)
    author_name = serializers.CharField(source='author.get_full_name', read_only=True)

    class Meta:
        model = Post
        fields = [
            'id', 'title', 'excerpt', 'content', 'author_name',
            'category', 'category_name', 'created_at', 'image_url'
        ]