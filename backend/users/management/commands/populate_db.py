from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model
from courses.models import Course, Lesson
from blog.models import Post, Category

User = get_user_model()

class Command(BaseCommand):
    help = 'Populates the database with test data'

    def handle(self, *args, **options):
        self.stdout.write('Populating database...')

        # Create users
        admin, _ = User.objects.get_or_create(username='admin', defaults={'email': 'admin@example.com', 'first_name': 'Admin', 'last_name': 'User', 'role': 'admin', 'is_staff': True, 'is_superuser': True})
        admin.set_password('admin')
        admin.save()

        teacher1, _ = User.objects.get_or_create(username='teacher1', email='teacher1@example.com', first_name='Teacher', last_name='One', role='teacher')
        teacher1.set_password('teacher1')
        teacher1.save()

        student1, _ = User.objects.get_or_create(username='student1', email='student1@example.com', first_name='Student', last_name='One', role='student')
        student1.set_password('student1')
        student1.save()

        # Create courses
        course1, _ = Course.objects.get_or_create(title='Math 101', description='An introductory course to mathematics.', subject='Math', price=100, teacher=teacher1)
        course2, _ = Course.objects.get_or_create(title='History 101', description='An introductory course to history.', subject='History', price=100, teacher=teacher1)

        # Create lessons
        from django.utils import timezone

        Lesson.objects.get_or_create(title='Lesson 1', content='This is the first lesson.', course=course1, defaults={'date': timezone.now().date(), 'time': timezone.now().time()})
        Lesson.objects.get_or_create(title='Lesson 2', content='This is the second lesson.', course=course1, defaults={'date': timezone.now().date(), 'time': timezone.now().time()})
        Lesson.objects.get_or_create(title='Lesson 1', content='This is the first lesson.', course=course2, defaults={'date': timezone.now().date(), 'time': timezone.now().time()})

        # Create blog categories
        category1, _ = Category.objects.get_or_create(name='General', slug='general')
        category2, _ = Category.objects.get_or_create(name='News', slug='news')

        # Create blog posts
        Post.objects.get_or_create(title='Welcome to our blog!', content='This is our first blog post.', author=admin, category=category1)
        Post.objects.get_or_create(title='New course available!', content='We have a new course available.', author=admin, category=category2)

        self.stdout.write(self.style.SUCCESS('Successfully populated database.'))