from django.test import TestCase
from rest_framework.test import APIClient
from rest_framework import status
from .models import FAQ, PricingPlan

class SystemSettingsTests(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.faq = FAQ.objects.create(question="Q1", answer="A1", is_published=True)
        self.plan = PricingPlan.objects.create(name="Basic", price="100", features="f1, f2")

    def test_get_faqs(self):
        response = self.client.get('/api/faqs/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        # Check results in paginated response
        self.assertEqual(len(response.data['results']), 1)
        self.assertEqual(response.data['results'][0]['question'], "Q1")

    def test_get_pricing_plans(self):
        response = self.client.get('/api/pricing-plans/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data['results']), 1)
        self.assertEqual(response.data['results'][0]['name'], "Basic")
        self.assertEqual(response.data['results'][0]['features_list'], ["f1", "f2"])
