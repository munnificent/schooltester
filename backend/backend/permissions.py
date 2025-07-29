from rest_framework import permissions

class IsAdminOrReadOnly(permissions.BasePermission):
    """
    Кастомное правило доступа:
    - Разрешает полный доступ администраторам (is_staff=True).
    - Разрешает доступ только для чтения (GET, HEAD, OPTIONS) всем остальным.
    """
    def has_permission(self, request, view):
        # Разрешить запросы на чтение всем
        if request.method in permissions.SAFE_METHODS:
            return True
        
        # Разрешить запросы на запись только администраторам
        return request.user and request.user.is_staff

class IsAdmin(permissions.BasePermission):
    """
    Кастомное правило доступа:
    - Разрешает доступ только администраторам (is_staff=True).
    """
    def has_permission(self, request, view):
        return request.user and request.user.is_staff

class IsOwnerOrReadOnly(permissions.BasePermission):
    """
    Кастомное правило доступа:
    - Разрешает редактирование только владельцу объекта.
    - Разрешает чтение всем.
    """
    def has_object_permission(self, request, view, obj):
        # Разрешить запросы на чтение всем
        if request.method in permissions.SAFE_METHODS:
            return True
        
        # Разрешить запросы на запись только владельцу объекта
        return obj.user == request.user