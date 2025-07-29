import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Book, CheckCircle, BookX, Loader2, AlertCircle } from 'lucide-react';

import apiClient from'../api/apiClient'; // TODO: Убедиться, что apiClient настроен
import { Course } from '../types'; // Используем наш обновленный тип

// --- Компонент карточки курса ---
const CourseCard: React.FC<{ course: Course & { progress: number }; index: number }> = ({ course, index }) => {
  const { teacher, progress } = course;
  const isCompleted = progress >= 100;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.08, duration: 0.4 }}
    >
      <Link 
        to={`/my-courses/${course.id}`} 
        className="block h-full bg-card text-card-foreground rounded-xl border shadow-sm transition-all duration-300 hover:shadow-md hover:-translate-y-1"
      >
        <div className="p-5 flex flex-col h-full">
          <header className="flex items-start justify-between mb-4">
            <div>
              <h2 className="text-lg font-semibold text-foreground">{course.title}</h2>
              {teacher && (
                <div className="flex items-center mt-2 gap-2">
                  <img
                    src={teacher.avatar || `https://ui-avatars.com/api/?name=${teacher.firstName}+${teacher.lastName}&background=random`}
                    alt={`Аватар ${teacher.firstName}`}
                    className="w-6 h-6 rounded-full object-cover"
                  />
                  <span className="text-sm text-muted-foreground">{`${teacher.firstName} ${teacher.lastName}`}</span>
                </div>
              )}
            </div>
            <div className={`p-2 rounded-full ${isCompleted ? 'bg-success/10 text-success' : 'bg-primary/10 text-primary'}`}>
              {isCompleted ? <CheckCircle size={20} /> : <Book size={20} />}
            </div>
          </header>
          
          <div className="mt-auto">
            <div className="flex items-center justify-between mb-1 text-sm">
              <span className="text-muted-foreground">Прогресс:</span>
              <span className={`font-medium ${isCompleted ? 'text-success' : 'text-primary'}`}>{progress}%</span>
            </div>
            <div className="w-full bg-muted rounded-full h-2">
              <div 
                className={`h-2 rounded-full ${isCompleted ? 'bg-success' : 'bg-primary'}`}
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

// --- Компоненты состояний ---

const LoadingSkeleton: React.FC = () => (
  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
    {Array.from({ length: 3 }).map((_, i) => (
      <div key={i} className="bg-card rounded-xl border p-5 space-y-4 animate-pulse">
        <div className="h-6 bg-muted rounded w-3/4"></div>
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 bg-muted rounded-full"></div>
          <div className="h-4 bg-muted rounded w-1/2"></div>
        </div>
        <div className="pt-4 space-y-2">
          <div className="h-2 bg-muted rounded w-full"></div>
          <div className="h-2 bg-muted rounded w-5/6"></div>
        </div>
      </div>
    ))}
  </div>
);

const EmptyState: React.FC = () => (
  <div className="text-center bg-card border rounded-lg py-12 px-6">
     <BookX className="mx-auto h-12 w-12 text-muted-foreground" />
     <h3 className="mt-4 text-lg font-semibold text-foreground">У вас пока нет курсов</h3>
     <p className="mt-2 text-sm text-muted-foreground">
       Вы еще не записаны ни на один курс. Новые курсы появятся здесь.
     </p>
     <div className="mt-6">
        <Link
            to="/courses"
            className="inline-flex items-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow-sm transition-colors hover:bg-primary/90"
        >
            Перейти в каталог курсов
        </Link>
     </div>
  </div>
);

const ErrorState: React.FC<{ onRetry: () => void }> = ({ onRetry }) => (
  <div className="text-center bg-card border rounded-lg py-12 px-6">
     <AlertCircle className="mx-auto h-12 w-12 text-destructive" />
     <h3 className="mt-4 text-lg font-semibold text-foreground">Ошибка загрузки</h3>
     <p className="mt-2 text-sm text-muted-foreground">
       Не удалось получить список ваших курсов. Пожалуйста, попробуйте еще раз.
     </p>
     <div className="mt-6">
        <button
            onClick={onRetry}
            className="inline-flex items-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow-sm transition-colors hover:bg-primary/90"
        >
            Повторить попытку
        </button>
     </div>
  </div>
);


// --- Основной компонент страницы ---
const MyCoursesPage: React.FC = () => {
  // Добавляем тип для данных, включая прогресс
  const [courses, setCourses] = useState<(Course & { progress: number })[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchMyCourses = async () => {
    setIsLoading(true);
    setError(null);
    try {
      // const response = await apiClient.get<(Course & { progress: number })[]>('/courses/my/');
      // setCourses(response.data);
      
      // --- Имитация ответа API с прогрессом ---
      await new Promise(resolve => setTimeout(resolve, 1000));
      const mockCourses: (Course & { progress: number })[] = [
        { id: 1, title: 'Математическая грамотность', description: '', subject: 'Математика', price: '15000', teacher: { id: 1, firstName: 'Айжан', lastName: 'Берикова', email: '', role: 'teacher', isActive: true }, progress: 75 },
        { id: 2, title: 'История Казахстана', description: '', subject: 'История', price: '15000', teacher: { id: 2, firstName: 'Тимур', lastName: 'Сапаров', email: '', role: 'teacher', isActive: true }, progress: 100 },
        { id: 3, title: 'Физика для ЕНТ', description: '', subject: 'Физика', price: '18000', teacher: { id: 3, firstName: 'Ермек', lastName: 'Жангиров', email: '', role: 'teacher', isActive: true }, progress: 30 },
      ];
      setCourses(mockCourses);

    } catch (err) {
      setError("Произошла ошибка при запросе к серверу.");
      console.error("Failed to fetch courses:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMyCourses();
  }, []);

  const renderContent = () => {
    if (isLoading) {
      return <LoadingSkeleton />;
    }

    if (error) {
      return <ErrorState onRetry={fetchMyCourses} />;
    }

    if (courses.length === 0) {
      return <EmptyState />;
    }

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {courses.map((course, index) => (
          <CourseCard key={course.id} course={course} index={index} />
        ))}
      </div>
    );
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
      <header className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Мои курсы</h1>
        <p className="text-muted-foreground mt-1">Здесь собраны все твои курсы и прогресс по ним.</p>
      </header>
      
      {renderContent()}
    </motion.div>
  );
};

export default MyCoursesPage;