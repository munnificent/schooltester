from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import User, Profile

class CustomUserAdmin(UserAdmin):
    """
    Кастомная конфигурация для модели User в админ-панели.
    """
    # Добавляем кастомные поля в список и фильтры
    list_display = ('username', 'email', 'first_name', 'last_name', 'role', 'is_staff')
    list_filter = ('role', 'is_staff', 'is_active', 'groups')

    # Добавляем поле role в стандартные наборы полей для редактирования
    # UserAdmin.fieldsets - это кортеж, поэтому мы преобразуем его в список для модификации
    fieldsets = list(UserAdmin.fieldsets)
    # Добавляем наш набор полей 'Дополнительная информация'
    fieldsets.append(
        ('Дополнительная информация', {'fields': ('role',)})
    )
    
    # Чтобы можно было редактировать профиль вместе с пользователем
    # class ProfileInline(admin.StackedInline):
    #     model = Profile
    #     can_delete = False
    #     verbose_name_plural = 'Профиль'

    # inlines = (ProfileInline,)

# Регистрируем нашу кастомную модель User с кастомной админкой
admin.site.register(User, CustomUserAdmin)

# Также регистрируем модель Profile для отдельного просмотра/редактирования
@admin.register(Profile)
class ProfileAdmin(admin.ModelAdmin):
    list_display = ('user', 'student_class', 'parent_name', 'parent_phone')