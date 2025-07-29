# backend/applications/models.py

from django.db import models

class Application(models.Model):
    """Модель заявки с сайта"""
    STATUS_CHOICES = (
        ('new', 'Новая'),
        ('contacted', 'На связи'),
        ('registered', 'Оформлен'),
        ('archived', 'В архиве'),
    )
    name = models.CharField(max_length=100, verbose_name='Имя')
    phone = models.CharField(max_length=20, verbose_name='Телефон')
    student_class = models.CharField(max_length=50, blank=True, verbose_name='Класс ученика')
    subject = models.CharField(max_length=100, blank=True, verbose_name='Предмет')
    comment = models.TextField(blank=True, verbose_name='Комментарий')
    status = models.CharField(max_length=10, choices=STATUS_CHOICES, default='new', verbose_name='Статус')
    created_at = models.DateTimeField(auto_now_add=True, verbose_name='Дата создания')

    class Meta:
        verbose_name = 'Заявка'
        verbose_name_plural = 'Заявки'
        ordering = ['-created_at']

    def __str__(self):
        return f'Заявка от {self.name} ({self.created_at.strftime("%d.%m.%Y")})'