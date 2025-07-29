/** @type {import('tailwindcss').Config} */

export default {
  // Включаем темную тему, управляемую через добавление класса 'dark' к body
  darkMode: 'class',

  // Указываем Tailwind, где искать классы для оптимизации CSS
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],

  theme: {
    extend: {
      // Расширяем стандартную палитру Tailwind вашими фирменными цветами
      colors: {
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
          // Добавляем оттенки для ховеров и других состояний
          dark: '#4338CA', //
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
          dark: '#D97706',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
        // Ваши кастомные цвета из старого конфига
        success: {
          DEFAULT: '#10B981',
          foreground: '#FFFFFF',
        },
        danger: {
          DEFAULT: '#EF4444',
          foreground: '#FFFFFF',
        },
      },
      // Стандартные радиусы скругления для единообразия
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
    },
  },

  // Добавляем плагины для расширения функциональности Tailwind
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/typography'), // <-- ДОБАВЬТЕ ЭТУ СТРОКУ
  ],
};