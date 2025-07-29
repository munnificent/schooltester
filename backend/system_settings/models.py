# backend/system_settings/models.py

from django.db import models

class SystemSettings(models.Model):
    """
    Модель для хранения системных настроек в виде единственной записи (Singleton).
    """
    school_name = models.CharField(max_length=255, default="Munificent School", verbose_name="Название школы")
    address = models.TextField(default="г. Алматы, ул. Достык 132, БЦ 'Прогресс', офис 401", verbose_name="Адрес")
    phone = models.CharField(max_length=50, default="+7 (777) 123-45-67", verbose_name="Телефон")
    email = models.EmailField(default="info@munificentschool.kz", verbose_name="Email")
    
    # Настройки уведомлений
    email_notifications = models.BooleanField(default=True, verbose_name="Email-уведомления")
    sms_notifications = models.BooleanField(default=True, verbose_name="SMS-уведомления")
    payment_reminders = models.BooleanField(default=True, verbose_name="Напоминания об оплате")
    class_reminders = models.BooleanField(default=True, verbose_name="Напоминания о занятиях")

    # Системные настройки
    timezone = models.CharField(max_length=100, default="Asia/Almaty", verbose_name="Часовой пояс")
    language = models.CharField(max_length=50, default="Русский", verbose_name="Язык системы")
    currency = models.CharField(max_length=10, default="KZT", verbose_name="Валюта")

    def __str__(self):
        return "Системные настройки"

    # Гарантируем, что в таблице будет только одна запись
    def save(self, *args, **kwargs):
        self.pk = 1
        super(SystemSettings, self).save(*args, **kwargs)

    @classmethod
    def load(cls):
        # .get_or_create() возвращает кортеж (объект, создан_ли_он)
        obj, created = cls.objects.get_or_create(pk=1)
        return obj

    class Meta:
        verbose_name = "Системные настройки"
        verbose_name_plural = "Системные настройки"