from rest_framework import viewsets
from rest_framework.permissions import AllowAny
from .models import FAQ, PricingPlan
from .serializers import FAQSerializer, PricingPlanSerializer

class FAQViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = FAQ.objects.filter(is_published=True)
    serializer_class = FAQSerializer
    permission_classes = [AllowAny]

class PricingPlanViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = PricingPlan.objects.all()
    serializer_class = PricingPlanSerializer
    permission_classes = [AllowAny]