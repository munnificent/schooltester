# backend/reviews/admin.py
from django.contrib import admin
from .models import Review

# Декоратор для создания нового действия
@admin.action(description='Опубликовать выбранные отзывы')
def make_published(modeladmin, request, queryset):
    """Действие для публикации отзывов."""
    queryset.update(is_published=True)

@admin.register(Review)
class ReviewAdmin(admin.ModelAdmin):
    list_display = ('author', 'text', 'score_info', 'is_published')
    list_filter = ('is_published',)
    # Добавляем наше действие в список доступных
    actions = [make_published]

