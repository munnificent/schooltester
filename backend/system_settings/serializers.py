from rest_framework import serializers
from .models import FAQ, PricingPlan

class FAQSerializer(serializers.ModelSerializer):
    class Meta:
        model = FAQ
        fields = ['id', 'question', 'answer', 'order']

class PricingPlanSerializer(serializers.ModelSerializer):
    features_list = serializers.SerializerMethodField()

    class Meta:
        model = PricingPlan
        fields = ['id', 'name', 'description', 'price', 'features', 'features_list', 'is_popular', 'order']

    def get_features_list(self, obj):
        # Разбиваем текст features на список строк
        if not obj.features:
            return []
        # Пробуем разбить по новой строке, если нет - по запятой
        if '\n' in obj.features:
            return [f.strip() for f in obj.features.split('\n') if f.strip()]
        return [f.strip() for f in obj.features.split(',') if f.strip()]