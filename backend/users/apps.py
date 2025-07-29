# backend/users/apps.py

from django.apps import AppConfig

class UsersConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'users'

    # Добавьте этот метод
    def ready(self):
        import users.signals # noqa