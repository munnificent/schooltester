# backend/system_settings/admin.py

from django.contrib import admin
from .models import SystemSettings

# Чтобы настройки можно было редактировать и в стандартной админке
@admin.register(SystemSettings)
class SystemSettingsAdmin(admin.ModelAdmin):
    def has_add_permission(self, request):
        # Запрещаем создание новых записей, т.к. у нас Singleton
        return not SystemSettings.objects.exists()