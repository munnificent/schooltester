# backend/applications/views.py

from rest_framework import viewsets, permissions
from .models import Application
from .serializers import ApplicationSerializer
from backend.permissions import IsAdmin

class ApplicationViewSet(viewsets.ModelViewSet):
    """ViewSet для заявок. Создание - для всех, управление - для админов."""
    queryset = Application.objects.all()
    serializer_class = ApplicationSerializer

    def get_permissions(self):
        # Разрешаем любому пользователю создавать заявку (метод POST)
        if self.action == 'create':
            return [permissions.AllowAny()]
        # Все остальные действия (просмотр, редактирование, удаление) - только для админа
        return [IsAdmin()]