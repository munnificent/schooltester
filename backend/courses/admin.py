from django.contrib import admin
from .models import Course, Lesson # Убираем импорт Subject и TestQuestion

# Регистрируем только те модели, которые реально существуют
admin.site.register(Course)
admin.site.register(Lesson)