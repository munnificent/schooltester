from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import FAQViewSet, PricingPlanViewSet

router = DefaultRouter()
router.register(r'faqs', FAQViewSet, basename='faq')
router.register(r'pricing-plans', PricingPlanViewSet, basename='pricing-plan')

urlpatterns = [
    path('', include(router.urls)),
]