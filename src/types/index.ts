// src/types/index.ts
/*
  Примечание о стиле кода:
  В коде TypeScript/Frontend мы используем стиль camelCase (например, `firstName`).
  Наш API-клиент (axios) будет настроен так, чтобы автоматически преобразовывать
  стиль snake_case (например, `first_name`) от Python-бэкенда в camelCase и обратно.
  Это позволяет нам писать чистый и идиоматический код на обеих сторонах.
*/

// --- Пользователи и Роли ---

export type UserRole = 'student' | 'teacher' | 'admin';

export interface UserProfile {
  id: number;
  avatar?: string;
  phone?: string;
  dateOfBirth?: string;
  parentName?: string;
  parentPhone?: string;
  school?: string;
  studentClass?: string;
}

export interface User {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  isActive: boolean;
  lastLogin?: string; // Формат ISO 8601
  profile?: UserProfile;
}

// --- Курсы и Уроки ---

export type LessonStatus = 'planned' | 'completed' | 'cancelled';
  id: number;
  title: string;
  content: string;
  course: number;
  date?: string; // ISO 8601
  time?: string; // HH:MM
  status?: 'planned' | 'completed' | 'cancelled';
  recordingUrl?: string;
  homeworkUrl?: string;
}

export interface Course {
  id: number;
  title: string;
  description: string;
  subject: string;
  price: string;
  teacher: User;
  students?: User[];
  lessons?: Lesson[];
}

// --- Блог ---

export interface BlogCategory {
  id: number;
  name: string;
  slug: string;
}

export interface BlogPost {
  id: number;
  title: string;
  slug: string;
  content: string;
  excerpt?: string;
  image?: string;
  author: User;
  category: BlogCategory;
  createdAt: string; // ISO 8601
  updatedAt: string; // ISO 8601
  isPublished: boolean;
}

// --- Отзывы ---

export interface Review {
  id: number;
  text: string;
  author: User;
  rating: 1 | 2 | 3 | 4 | 5;
  isPublished: boolean;
  createdAt: string; // Формат ISO 8601
}

// --- Заявки и Настройки ---

export type ApplicationStatus = 'new' | 'in_progress' | 'closed';

export interface Application {
  id: number;
  name: string;
  phone: string;
  status: ApplicationStatus;
  course?: Course;
  createdAt: string; // Формат ISO 8601
  comment?: string;
}

export interface SystemSettings {
  id: number;
  schoolName: string;
  contactEmail: string;
  contactPhone: string;
  // ... любые другие глобальные настройки
}

// --- Вспомогательные типы для API ---

// Универсальный тип для ответов API с пагинацией
export interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}