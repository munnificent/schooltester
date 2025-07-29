# backend/blog/views.py

from rest_framework import viewsets, permissions
from .models import Post, Category
from .serializers import PostSerializer, CategorySerializer

class PostViewSet(viewsets.ReadOnlyModelViewSet):
    """Показывает посты блога. Доступно всем."""
    queryset = Post.objects.all().select_related('category', 'author')
    serializer_class = PostSerializer
    permission_classes = [permissions.AllowAny] # Разрешаем доступ всем

class CategoryViewSet(viewsets.ReadOnlyModelViewSet):
    """Показывает категории блога. Доступно всем."""
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    permission_classes = [permissions.AllowAny]