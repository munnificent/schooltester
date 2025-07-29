from rest_framework_nested import routers
from .views import CourseViewSet, LessonViewSet

# Этот роутер нужен только для того, чтобы на его основе построить вложенный
# Он не будет генерировать URL-ы сам по себе в данном файле
router = routers.SimpleRouter()
router.register(r'courses', CourseViewSet, basename='course')

# Создаем вложенный роутер для уроков
courses_router = routers.NestedSimpleRouter(router, r'courses', lookup='course')
courses_router.register(r'lessons', LessonViewSet, basename='course-lessons')

# Экспортируем только вложенные URL
urlpatterns = courses_router.urls