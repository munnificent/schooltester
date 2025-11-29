# backend/system_settings/admin.py

from django.contrib import admin
from .models import SystemSettings, FAQ, PricingPlan

@admin.register(SystemSettings)
class SystemSettingsAdmin(admin.ModelAdmin):
    list_display = ['school_name', 'phone', 'email']

    def has_add_permission(self, request):
        # Разрешаем создание только если записи еще нет
        return not SystemSettings.objects.exists()

    def has_delete_permission(self, request, obj=None):
        # Запрещаем удаление
        return False

@admin.register(FAQ)
class FAQAdmin(admin.ModelAdmin):
    list_display = ['question', 'order', 'is_published']
    list_editable = ['order', 'is_published']
    ordering = ['order']

@admin.register(PricingPlan)
class PricingPlanAdmin(admin.ModelAdmin):
    list_display = ['name', 'price', 'is_popular', 'order']
    list_editable = ['is_popular', 'order']
    ordering = ['order']