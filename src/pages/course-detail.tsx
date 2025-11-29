// src/pages/course-detail.tsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowLeft, CheckCircle, Download, Video,
  AlertCircle, Calendar, Circle
} from 'lucide-react';

import apiClient from '../api/apiClient';
import { Course, Lesson, LessonStatus } from '../types';

// --- Тип для полных данных курса ---
type FullCourseData = Course & {
  lessons: Lesson[];
  progress: number;
};

// --- Компоненты-секции ---

const CourseHeader: React.FC<{ course: FullCourseData }> = ({ course }) => {
  const navigate = useNavigate();

  return (
    <header className="mb-8">
      <button onClick={() => navigate('/my-courses')} className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-4">
        <ArrowLeft size={18} />
        К моим курсам
      </button>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{course.title}</h1>
          <div className="flex items-center mt-2 gap-2 text-sm text-muted-foreground">
            <img src={course.teacher.profile?.avatar || `https://ui-avatars.com/api/?name=${course.teacher.firstName}+${course.teacher.lastName}&background=random`} alt="Teacher" className="w-6 h-6 rounded-full" />
            <span>Преподаватель: {course.teacher.firstName} {course.teacher.lastName}</span>
          </div>
        </div>
      </div>
    </header>
  );
};

const CourseProgress: React.FC<{ progress: number }> = ({ progress }) => (
  <div className="bg-card border rounded-lg p-5 mb-8">
    <div className="flex items-center justify-between mb-2">
      <h2 className="font-semibold">Прогресс курса</h2>
      <p className="font-bold text-primary">{Math.round(progress)}%</p>
    </div>
    <div className="w-full bg-muted rounded-full h-3">
      <div className="bg-primary h-3 rounded-full" style={{ width: `${progress}%` }}></div>
    </div>
  </div>
);

const LessonItem: React.FC<{
  lesson: Lesson;
  index: number;
  onToggleCompletion: (lessonId: number) => void;
}> = React.memo(({ lesson, index, onToggleCompletion }) => {
  const statusMap: { [key in LessonStatus]: { color: string, label: string } } = {
    completed: { color: 'text-success', label: 'Пройден' },
    planned: { color: 'text-primary', label: 'Запланирован' },
    cancelled: { color: 'text-destructive', label: 'Отменен' },
  };
  const status = lesson.status || 'planned';
  const { color } = statusMap[status];

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.3 }}
      className={`bg-card border rounded-lg p-4 ${lesson.isCompleted ? 'bg-primary/5 border-primary/20' : ''}`}
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <button
            onClick={() => onToggleCompletion(lesson.id)}
            className={`flex-shrink-0 transition-colors ${lesson.isCompleted ? 'text-green-500' : 'text-muted-foreground hover:text-primary'}`}
            title={lesson.isCompleted ? "Отметить как непройденный" : "Отметить как пройденный"}
          >
            {lesson.isCompleted ? <CheckCircle className="h-6 w-6" /> : <Circle className="h-6 w-6" />}
          </button>

          <div>
            <h3 className={`font-medium ${lesson.isCompleted ? 'line-through text-muted-foreground' : ''}`}>{lesson.title}</h3>
            <p className="text-sm text-muted-foreground">
              {lesson.date ? new Date(lesson.date).toLocaleDateString('ru-RU', { day: 'numeric', month: 'long' }) : 'Дата не указана'}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          <a href={lesson.recordingUrl} target="_blank" rel="noopener noreferrer" className={`inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${lesson.recordingUrl ? 'bg-muted text-foreground hover:bg-muted/80' : 'bg-muted text-muted-foreground cursor-not-allowed opacity-50'}`}>
            <Video size={16} /> Смотреть
          </a>
          <a href={lesson.homeworkUrl} target="_blank" rel="noopener noreferrer" className={`inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${lesson.homeworkUrl ? 'bg-muted text-foreground hover:bg-muted/80' : 'bg-muted text-muted-foreground cursor-not-allowed opacity-50'}`}>
            <Download size={16} /> Д/З
          </a>
        </div>
      </div>
    </motion.div>
  );
});


// --- Компоненты состояний ---
const LoadingState: React.FC = () => (
  <div className="animate-pulse">
    <div className="h-6 bg-muted rounded w-1/4 mb-4"></div>
    <div className="h-8 bg-muted rounded w-1/2 mb-8"></div>
    <div className="h-24 bg-muted rounded-lg mb-8"></div>
    <div className="space-y-4">
      <div className="h-20 bg-muted rounded-lg"></div>
      <div className="h-20 bg-muted rounded-lg"></div>
      <div className="h-20 bg-muted rounded-lg"></div>
    </div>
  </div>
);

const ErrorState: React.FC<{ message: string }> = ({ message }) => {
  const navigate = useNavigate();
  return (
    <div className="text-center py-20">
      <AlertCircle className="mx-auto h-12 w-12 text-destructive" />
      <h2 className="mt-4 text-xl font-semibold">Не удалось загрузить курс</h2>
      <p className="mt-2 text-muted-foreground">{message}</p>
      <button onClick={() => navigate('/my-courses')} className="mt-6 inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90">
        <ArrowLeft size={16} /> Вернуться к курсам
      </button>
    </div>
  );
};

// --- Основной компонент страницы ---
const CourseDetailPage: React.FC = () => {
  const { courseId } = useParams<{ courseId: string }>();
  const [course, setCourse] = useState<FullCourseData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCourseData = async () => {
    setIsLoading(true);
    setError(null);
    try {
      // 1. Получаем детали курса (включая уроки, благодаря prefetch_related в backend)
      const response = await apiClient.get<FullCourseData>(`/courses/${courseId}/`);

      // Рассчитываем прогресс на клиенте (или можно было бы на бэкенде)
      const lessons = response.data.lessons || [];
      const completedCount = lessons.filter(l => l.isCompleted).length;
      const progress = lessons.length > 0 ? (completedCount / lessons.length) * 100 : 0;

      setCourse({ ...response.data, progress });

    } catch (err) {
      setError("Возможно, курс не существует или у вас нет к нему доступа.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (courseId) fetchCourseData();
  }, [courseId]);

  const handleToggleCompletion = async (lessonId: number) => {
    if (!course) return;

    // Оптимистичное обновление UI
    const updatedLessons = course.lessons.map(lesson => {
      if (lesson.id === lessonId) {
        return { ...lesson, isCompleted: !lesson.isCompleted };
      }
      return lesson;
    });

    const completedCount = updatedLessons.filter(l => l.isCompleted).length;
    const progress = updatedLessons.length > 0 ? (completedCount / updatedLessons.length) * 100 : 0;

    setCourse({ ...course, lessons: updatedLessons, progress });

    try {
      await apiClient.post(`/courses/${courseId}/lessons/${lessonId}/toggle_completion/`);
    } catch (error) {
      // Откат изменений при ошибке
      console.error("Failed to toggle completion", error);
      fetchCourseData(); // Перезагружаем данные
    }
  };

  if (isLoading) {
    return <LoadingState />;
  }

  if (error || !course) {
    return <ErrorState message={error || "Данные о курсе не найдены."} />;
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <CourseHeader course={course} />
      <CourseProgress progress={course.progress} />

      <div>
        <h2 className="text-xl font-semibold mb-4">Уроки курса</h2>
        <div className="space-y-4">
          {course.lessons.map((lesson, index) => (
            <LessonItem
              key={lesson.id}
              lesson={lesson}
              index={index}
              onToggleCompletion={handleToggleCompletion}
            />
          ))}
          {course.lessons.length === 0 && (
            <p className="text-muted-foreground">В этом курсе пока нет уроков.</p>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default CourseDetailPage;