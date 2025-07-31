from django.contrib.auth.models import AbstractUser
from django.db import models
from django.db.models.signals import post_save
from django.dispatch import receiver
from courses.models import Course

class User(AbstractUser):
    ROLE_CHOICES = (
        ('student', 'Ученик'),
        ('teacher', 'Преподаватель'),
        ('admin', 'Администратор'),
    )
    role = models.CharField(max_length=10, choices=ROLE_CHOICES, default='student')

class Profile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='profile')
    avatar = models.URLField(blank=True, null=True, verbose_name="URL аватара")
    public_description = models.TextField(blank=True, null=True)
    public_subjects = models.CharField(max_length=255, blank=True, null=True)
    phone = models.CharField(max_length=20, blank=True, null=True)
    school = models.CharField(max_length=255, blank=True, null=True)
    student_class = models.CharField(max_length=50, blank=True, null=True)
    parent_name = models.CharField(max_length=255, blank=True, null=True)
    parent_phone = models.CharField(max_length=20, blank=True, null=True)
    enrolled_courses = models.ManyToManyField(
        Course, 
        related_name='enrolled_student_profiles',
        blank=True
    )

    def __str__(self):
        return f'Профиль пользователя {self.user.username}'

