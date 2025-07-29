# backend/reviews/models.py
from django.db import models

class Review(models.Model):
    author = models.CharField(max_length=100, verbose_name='Автор отзыва (имя, класс)')
    text = models.TextField(verbose_name='Текст отзыва')
    score_info = models.CharField(max_length=255, verbose_name='Информация о баллах/оценках')
    # Изменяем значение по умолчанию на False
    is_published = models.BooleanField(default=False, verbose_name='Опубликован')

    class Meta:
        verbose_name = 'Отзыв'
        verbose_name_plural = 'Отзывы'
        ordering = ['-id']

    def __str__(self):
        return f'Отзыв от {self.author}'