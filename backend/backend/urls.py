from django.contrib import admin
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

# --- Импортируем все необходимые ViewSets ---
from users.views import UserViewSet, TeacherPublicViewSet
from courses.views import CourseViewSet
from blog.views import PostViewSet, CategoryViewSet
from applications.views import ApplicationViewSet
from reviews.views import ReviewViewSet

# --- Создаем единый роутер для всего API ---
router = DefaultRouter()
router.register(r'users', UserViewSet, basename='user')
router.register(r'public-teachers', TeacherPublicViewSet, basename='public-teacher')
router.register(r'courses', CourseViewSet, basename='course')
router.register(r'posts', PostViewSet, basename='post')
router.register(r'categories', CategoryViewSet, basename='category')
router.register(r'applications', ApplicationViewSet, basename='application')
router.register(r'reviews', ReviewViewSet, basename='review')


urlpatterns = [
    path('admin/', admin.site.urls),

    # --- Эндпоинты для аутентификации ---
    path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),

    # --- Подключаем все URL ---
    path('api/blog/', include('blog.urls')),
    path('api/', include('users.custom_urls')),
    path('api/', include('courses.nested_urls')),
    path('api/', include('courses.custom_urls')), # <--- ДОБАВЛЕНО
    path('api/', include(router.urls)),
]