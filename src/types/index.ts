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
  avatar?: string;
  isActive: boolean;
  lastLogin?: string; // Формат ISO 8601
  profile?: UserProfile;
}

// --- Курсы и Уроки ---

export type LessonStatus = 'planned' | 'completed' | 'cancelled';

export interface Lesson {
  id: number;
  title: string;
  content: string;
  course: number; // ID курса, к которому относится урок
  date?: string; // Формат ISO 8601
  time?: string; // Формат HH:MM
  status?: LessonStatus;
  recordingUrl?: string;
  homeworkUrl?: string;
}

export interface Course {
  id: number;
  title: string;
  description: string;
  subject: string;
  price: string; // Цена может быть строкой для форматирования
  teacher: User; // Вложенный полный объект преподавателя
  lessons?: Lesson[]; // Массив уроков этого курса
  students?: User[]; // Массив студентов, записанных на курс
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
  content: string;
  author: User;
  category: BlogCategory;
  createdAt: string; // Формат ISO 8601
  slug: string;
  image?: string;
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