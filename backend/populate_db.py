#!/usr/bin/env python
"""
Скрипт для заполнения базы данных тестовыми данными
"""
import os
import django
import sys
from datetime import datetime, timedelta

# Настройка Django окружения
sys.path.append(os.path.dirname(os.path.abspath(__file__)))
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
django.setup()

from users.models import User, Profile
from courses.models import Course, Lesson
from reviews.models import Review
from system_settings.models import FAQ, PricingPlan
from blog.models import Post, Category
from applications.models import Application

def create_users():
    """Создание пользователей"""
    print("Создание пользователей...")
    
    # Админ (если не существует)
    admin, created = User.objects.get_or_create(
        email='admin@school.kz',
        defaults={
            'username': 'admin@school.kz',
            'first_name': 'Администратор',
            'last_name': 'Системы',
            'role': 'admin',
            'is_staff': True,
            'is_superuser': True,
        }
    )
    if created:
        admin.set_password('admin123')
        admin.save()
        print(f"✓ Создан admin: {admin.email}")
    
    # Преподаватели
    teachers_data = [
        {
            'email': 'aigerim@school.kz',
            'first_name': 'Айгерим',
            'last_name': 'Нурсултанова',
            'password': 'teacher123',
            'subjects': 'Математика, Физика',
            'description': 'Сдала ЕНТ по математике на 38 баллов. Верит, что даже гуманитарий может понять логарифмы.',
            'experience': '8 лет опыта'
        },
        {
            'email': 'daniyar@school.kz',
            'first_name': 'Данияр',
            'last_name': 'Сапаров',
            'password': 'teacher123',
            'subjects': 'Физика, Информатика',
            'description': 'Участник международных олимпиад по физике. Объясняет квантовую механику через мемы.',
            'experience': '6 лет опыта'
        },
        {
            'email': 'aliya@school.kz',
            'first_name': 'Алия',
            'last_name': 'Кадырова',
            'password': 'teacher123',
            'subjects': 'Казахский язык, Литература',
            'description': 'Магистр филологии с 5-летним опытом подготовки к ЕНТ.',
            'experience': '5 лет опыта'
        },
    ]
    
    teachers = []
    for data in teachers_data:
        teacher, created = User.objects.get_or_create(
            email=data['email'],
            defaults={
                'username': data['email'],
                'first_name': data['first_name'],
                'last_name': data['last_name'],
                'role': 'teacher',
            }
        )
        if created:
            teacher.set_password(data['password'])
            teacher.save()
            profile, _ = Profile.objects.get_or_create(user=teacher)
            profile.public_subjects = data['subjects']
            profile.public_description = data['description']
            profile.experience = data['experience']
            profile.save()
            print(f"✓ Создан преподаватель: {teacher.email}")
        teachers.append(teacher)
    
    # Студенты
    students_data = [
        {'email': 'student1@school.kz', 'first_name': 'Ескендыр', 'last_name': 'Айтжанов', 'password': 'student123', 'class': '11 класс'},
        {'email': 'student2@school.kz', 'first_name': 'Алия', 'last_name': 'Сериков', 'password': 'student123', 'class': '10 класс'},
        {'email': 'student3@school.kz', 'first_name': 'Данияр', 'last_name': 'Жумабеков', 'password': 'student123', 'class': '11 класс'},
    ]
    
    students = []
    for data in students_data:
        student, created = User.objects.get_or_create(
            email=data['email'],
            defaults={
                'username': data['email'],
                'first_name': data['first_name'],
                'last_name': data['last_name'],
                'role': 'student',
            }
        )
        if created:
            student.set_password(data['password'])
            student.save()
            profile, _ = Profile.objects.get_or_create(user=student)
            profile.student_class = data['class']
            profile.save()
            print(f"✓ Создан студент: {student.email}")
        students.append(student)
    
    return {'admin': admin, 'teachers': teachers, 'students': students}

def create_courses(teachers, students):
    """Создание курсов"""
    print("\nСоздание курсов...")
    
    courses_data = [
        {
            'title': 'Математика (ЕНТ)',
            'description': 'Полный курс подготовки к ЕНТ по математике',
            'subject': 'Математика',
            'price': 15000,
            'teacher': teachers[0],
        },
        {
            'title': 'Физика, 10 класс',
            'description': 'Школьный курс физики для 10 класса',
            'subject': 'Физика',
            'price': 18000,
            'teacher': teachers[1],
        },
        {
            'title': 'Казахский язык',
            'description': 'Подготовка к ЕНТ по казахскому языку',
            'subject': 'Казахский язык',
            'price': 15000,
            'teacher': teachers[2],
        },
    ]
    
    courses = []
    for data in courses_data:
        course, created = Course.objects.get_or_create(
            title=data['title'],
            defaults=data
        )
        if created:
            # Добавляем студентов к курсу через их профили
            for student in students:
                student.profile.enrolled_courses.add(course)
            print(f"✓ Создан курс: {course.title}")
        courses.append(course)
    
    return courses

def create_lessons(courses):
    """Создание уроков"""
    print("\nСоздание уроков...")
    
    today = datetime.now().date()
    
    lessons_data = [
        # Математика
        [
            {'title': 'Линейные уравнения и неравенства', 'date': today - timedelta(days=20), 'status': 'completed'},
            {'title': 'Квадратные уравнения', 'date': today - timedelta(days=13), 'status': 'completed'},
            {'title': 'Функции и их свойства', 'date': today - timedelta(days=6), 'status': 'completed'},
            {'title': 'Тригонометрические функции', 'date': today + timedelta(days=1), 'status': 'planned'},
            {'title': 'Производные', 'date': today + timedelta(days=8), 'status': 'planned'},
        ],
        # Физика
        [
            {'title': 'Кинематика', 'date': today - timedelta(days=18), 'status': 'completed'},
            {'title': 'Динамика', 'date': today - timedelta(days=11), 'status': 'completed'},
            {'title': 'Законы сохранения', 'date': today + timedelta(days=3), 'status': 'planned'},
            {'title': 'Механические колебания', 'date': today + timedelta(days=10), 'status': 'planned'},
        ],
        # Казахский язык
        [
            {'title': 'Фонетика казахского языка', 'date': today - timedelta(days=19), 'status': 'completed'},
            {'title': 'Лексика и фразеология', 'date': today - timedelta(days=12), 'status': 'completed'},
            {'title': 'Морфология', 'date': today - timedelta(days=5), 'status': 'completed'},
            {'title': 'Синтаксис простого предложения', 'date': today + timedelta(days=2), 'status': 'planned'},
        ],
    ]
    
    for i, course in enumerate(courses):
        for lesson_data in lessons_data[i]:
            lesson, created = Lesson.objects.get_or_create(
                course=course,
                title=lesson_data['title'],
                defaults={
                    'content': f'Материалы по теме: {lesson_data["title"]}',
                    'date': lesson_data['date'],
                    'time': '18:00',
                    'status': lesson_data['status'],
                    'recording_url': 'https://zoom.us/rec/example' if lesson_data['status'] == 'completed' else None,
                    'homework_url': 'https://drive.google.com/homework' if lesson_data['status'] == 'completed' else None,
                }
            )
            if created:
                print(f"  ✓ Урок: {lesson.title}")

def create_reviews():
    """Создание отзывов"""
    print("\nСоздание отзывов...")
    
    reviews_data = [
        {
            'author': 'Алан, 11 класс',
            'text': 'Думал, физика — это не мое, но с Данияром всё стало понятно! Теперь это мой любимый предмет.',
            'score_info': 'Сдал ЕНТ по физике на 35 баллов',
            'rating': 5,
            'is_published': True,
        },
        {
            'author': 'Дина, 9 класс',
            'text': 'Благодаря занятиям с Алией я наконец-то полюбила казахскую литературу. Она рассказывает так интересно!',
            'score_info': 'Средний балл вырос с 3 до 5',
            'rating': 5,
            'is_published': True,
        },
        {
            'author': 'Ержан, 11 класс',
            'text': 'За три месяца занятий мой уровень в математике вырос настолько, что родители не поверили. Спасибо Айгерим!',
            'score_info': 'Сдал ЕНТ по математике на 37 баллов',
            'rating': 5,
            'is_published': True,
        },
    ]
    
    for data in reviews_data:
        review, created = Review.objects.get_or_create(
            author=data['author'],
            defaults=data
        )
        if created:
            print(f"✓ Отзыв от: {review.author}")

def create_faqs():
    """Создание FAQ"""
    print("\nСоздание FAQ...")
    
    faqs_data = [
        {
            'question': 'Как проходят занятия?',
            'answer': 'Занятия проходят онлайн через платформу Zoom. Каждое занятие длится 60-90 минут. Все уроки записываются, и у учеников есть доступ к этим записям.',
            'order': 1,
        },
        {
            'question': 'Как оценивается прогресс ученика?',
            'answer': 'Мы регулярно проводим тестирования, а преподаватели ведут подробную статистику по каждому ученику, отслеживая успехи и выявляя области, требующие дополнительного внимания.',
            'order': 2,
        },
        {
            'question': 'Что делать, если я пропустил занятие?',
            'answer': 'Все занятия записываются. Вы всегда можете просмотреть пропущенный урок в личном кабинете и задать вопросы преподавателю.',
            'order': 3,
        },
        {
            'question': 'Можно ли сменить преподавателя или курс?',
            'answer': 'Да, мы гибко подходим к обучению. Если вам что-то не подошло, мы с радостью предложим другого специалиста или поможем сменить направление подготовки.',
            'order': 4,
        },
    ]
    
    for data in faqs_data:
        faq, created = FAQ.objects.get_or_create(
            question=data['question'],
            defaults=data
        )
        if created:
            print(f"✓ FAQ: {faq.question}")

def create_pricing_plans():
    """Создание тарифных планов"""
    print("\nСоздание тарифных планов...")
    
    plans_data = [
        {
            'name': 'Базовый',
            'description': 'Для точечной помощи по одному предмету.',
            'price': '15 000',
            'features': '1 предмет\n4 занятия в месяц\nДоступ к записям уроков\nДомашние задания',
            'is_popular': False,
            'order': 1,
        },
        {
            'name': 'Стандарт',
            'description': 'Лучший баланс для комплексной подготовки.',
            'price': '25 000',
            'features': 'До 2 предметов\n8 занятий в месяц\nПробные тесты\nКонсультации с методистом',
            'is_popular': True,
            'order': 2,
        },
        {
            'name': 'Премиум',
            'description': 'Максимальный фокус для гарантированного результата.',
            'price': '45 000',
            'features': 'До 3 предметов\n12 занятий в месяц\nИндивидуальные консультации\nПриоритетная поддержка',
            'is_popular': False,
            'order': 3,
        },
    ]
    
    for data in plans_data:
        plan, created = PricingPlan.objects.get_or_create(
            name=data['name'],
            defaults=data
        )
        if created:
            print(f"✓ Тариф: {plan.name}")

def main():
    print("=" * 50)
    print("ЗАПОЛНЕНИЕ БАЗЫ ДАННЫХ ТЕСТОВЫМИ ДАННЫМИ")
    print("=" * 50)
    
    users = create_users()
    courses = create_courses(users['teachers'], users['students'])
    create_lessons(courses)
    create_reviews()
    create_faqs()
    create_pricing_plans()
    
    print("\n" + "=" * 50)
    print("ГОТОВО!")
    print("=" * 50)
    print("\n📝 Учетные данные для входа:")
    print("\nАдмин:")
    print("  Email: admin@school.kz")
    print("  Пароль: admin123")
    print("\nПреподаватель:")
    print("  Email: aigerim@school.kz")
    print("  Пароль: teacher123")
    print("\nСтудент:")
    print("  Email: student1@school.kz")
    print("  Пароль: student123")
    print("\n" + "=" * 50)

if __name__ == '__main__':
    main()
