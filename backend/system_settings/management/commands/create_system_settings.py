from django.core.management.base import BaseCommand
from system_settings.models import SystemSettings

class Command(BaseCommand):
    help = 'Creates the default SystemSettings object'

    def handle(self, *args, **options):
        if not SystemSettings.objects.exists():
            SystemSettings.objects.create(id=1)
            self.stdout.write(self.style.SUCCESS('Successfully created SystemSettings object'))
        else:
            self.stdout.write('SystemSettings object already exists')