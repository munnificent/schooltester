#!/bin/bash

# Активируем виртуальное окружение (если нужно)
source venv/bin/activate

# Выполняем миграции (на всякий случай)
python manage.py migrate

# Создаем суперпользователя через Python
python manage.py shell <<EOF
from django.contrib.auth import get_user_model
User = get_user_model()
username = "schooladmin"
password = "235689qW#"
email = "kosmozasranec954@gmail.com"
if not User.objects.filter(username=username).exists():
    User.objects.create_superuser(username=username, password=password, email=email)
    print("Суперпользователь успешно создан.")
else:
    print("Суперпользователь уже существует.")
EOF
