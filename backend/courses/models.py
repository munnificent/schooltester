from django.db import models
from django.conf import settings

class Course(models.Model):
    title = models.CharField(max_length=255, verbose_name="Название курса")
    description = models.TextField(blank=True, null=True, verbose_name="Описание")
    subject = models.CharField(max_length=100, verbose_name="Предмет")
    price = models.DecimalField(max_digits=10, decimal_places=2, verbose_name="Цена")
    teacher = models.ForeignKey(
        settings.AUTH_USER_MODEL, 
        on_delete=models.SET_NULL, 
        null=True, 
        blank=True,
        limit_choices_to={'role': 'teacher'},
        related_name='teaching_courses',
        verbose_name="Преподаватель"
    )
    students = models.ManyToManyField(
        settings.AUTH_USER_MODEL,
        related_name='enrolled_courses',
        blank=True,
        limit_choices_to={'role': 'student'}
    )

    def __str__(self):
        return self.title

class Lesson(models.Model):
    class LessonStatus(models.TextChoices):
        PLANNED = 'planned', 'Запланирован'
        COMPLETED = 'completed', 'Проведен'
        CANCELLED = 'cancelled', 'Отменен'

    title = models.CharField(max_length=255, verbose_name="Название урока")
    content = models.TextField(blank=True, null=True, verbose_name="Содержание/материалы")
    course = models.ForeignKey(Course, on_delete=models.CASCADE, related_name='lessons', verbose_name="Курс")
    date = models.DateField(verbose_name="Дата урока", null=True, blank=True)
    time = models.TimeField(verbose_name="Время урока", null=True, blank=True)
    status = models.CharField(
        max_length=10,
        choices=LessonStatus.choices,
        default=LessonStatus.PLANNED,
        verbose_name="Статус урока"
    )
    recording_url = models.URLField(blank=True, null=True, verbose_name="Ссылка на запись")
    homework_url = models.URLField(blank=True, null=True, verbose_name="Ссылка на Д/З")

    def __str__(self):
        return self.title