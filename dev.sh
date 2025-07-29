#!/bin/bash

# Очистка порта 5173
PID=$(lsof -ti:5173)
if [ -n "$PID" ]; then
  echo "🔴 Завершается процесс на порту 5173 (PID: $PID)..."
  kill -9 $PID
else
  echo "✅ Порт 5173 свободен"
fi

# Запуск npm
echo "🚀 Запуск npm run dev..."
npm run dev
