# backend/system_settings/views.py

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import permissions
from .models import SystemSettings
from .serializers import SystemSettingsSerializer
from backend.permissions import IsAdmin

class SystemSettingsView(APIView):
    """
    View для получения и обновления системных настроек.
    Доступно только администраторам.
    """
    permission_classes = [IsAdmin]

    def get(self, request, *args, **kwargs):
        settings = SystemSettings.load()
        serializer = SystemSettingsSerializer(settings)
        return Response(serializer.data)

    def patch(self, request, *args, **kwargs):
        settings = SystemSettings.load()
        serializer = SystemSettingsSerializer(settings, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=400)