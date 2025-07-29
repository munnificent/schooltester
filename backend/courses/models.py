from django.db import models
from django.conf import settings

class Course(models.Model):
    """
    Модель для учебного курса.
    """
    title = models.CharField(max_length=255, verbose_name="Название курса")
    description = models.TextField(blank=True, null=True, verbose_name="Описание")
    subject = models.CharField(max_length=100, verbose_name="Предмет")
    price = models.DecimalField(max_digits=10, decimal_places=2, verbose_name="Цена")
    
    # Связь с преподавателем (модель User)
    teacher = models.ForeignKey(
        settings.AUTH_USER_MODEL, 
        on_delete=models.SET_NULL, 
        null=True, 
        blank=True,
        limit_choices_to={'role': 'teacher'}, # Ограничиваем выбор только преподавателями
        related_name='teaching_courses',
        verbose_name="Преподаватель"
    )

    def __str__(self):
        return self.title

class Lesson(models.Model):
    """
    Модель для урока внутри курса.
    """
    title = models.CharField(max_length=255, verbose_name="Название урока")
    content = models.TextField(blank=True, null=True, verbose_name="Содержание/материалы")
    course = models.ForeignKey(Course, on_delete=models.CASCADE, related_name='lessons', verbose_name="Курс")

    def __str__(self):
        return self.title