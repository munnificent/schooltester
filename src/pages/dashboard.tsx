import React, { useState, useEffect, useContext, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  BookOpen, CalendarClock, CheckSquare, ChevronRight,
  Clock, Video, CalendarOff, Loader2, AlertCircle
} from 'lucide-react';
import { useAuth } from '../contexts/auth-context';
import { AuthContext } from '../contexts/auth-context';
import apiClient from'../api/apiClient'; // TODO: Убедиться, что apiClient настроен
import { Lesson, User } from '../types';

// --- Типы для данных дашборда ---
interface DashboardStats {
  totalCourses: number;
  completedPercentage: number;
  testsTaken: number;
}

interface DashboardData {
  upcomingLessons: (Lesson & { course: { title: string } })[];
  stats: DashboardStats;
}

// --- Вспомогательные функции для форматирования даты ---
const formatDateLabel = (date: Date): { label: string; color: string } => {
  const today = new Date();
  const tomorrow = new Date();
  tomorrow.setDate(today.getDate() + 1);

  today.setHours(0, 0, 0, 0);
  tomorrow.setHours(0, 0, 0, 0);
  date.setHours(0, 0, 0, 0);

  if (date.getTime() === today.getTime()) return { label: 'Сегодня', color: 'bg-success/10 text-success' };
  if (date.getTime() === tomorrow.getTime()) return { label: 'Завтра', color: 'bg-amber-500/10 text-amber-500' };
  
  return { 
    label: date.toLocaleDateString('ru-RU', { day: 'numeric', month: 'long' }),
    color: 'bg-primary/10 text-primary'
  };
};

// --- Компоненты-секции ---

const WelcomeHeader: React.FC<{ user: User | null }> = ({ user }) => (
  <div>
    <h1 className="text-3xl font-bold tracking-tight">Привет, {user?.firstName}!</h1>
    <p className="mt-1 text-muted-foreground">Добро пожаловать в твой личный кабинет.</p>
  </div>
);

const StatsOverview: React.FC<{ stats: DashboardStats }> = ({ stats }) => {
  const statItems = [
    { icon: BookOpen, value: stats.totalCourses, label: 'Курсов в процессе' },
    { icon: CheckSquare, value: `${stats.completedPercentage}%`, label: 'Завершено' },
    { icon: CalendarClock, value: stats.testsTaken, label: 'Тестов пройдено' },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      {statItems.map((item, index) => (
        <div key={index} className="bg-card border rounded-lg p-4 flex items-center gap-4">
          <div className="p-3 bg-primary/10 rounded-md">
            <item.icon className="h-6 w-6 text-primary" />
          </div>
          <div>
            <p className="text-2xl font-bold">{item.value}</p>
            <p className="text-sm text-muted-foreground">{item.label}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

const LessonCard: React.FC<{ lesson: Lesson & { course: { title: string } } }> = ({ lesson }) => {
    const lessonDate = useMemo(() => new Date(lesson.date!), [lesson.date]);
    const { label, color } = formatDateLabel(lessonDate);
    const isPast = new Date() > new Date(`${lesson.date}T${lesson.time}`);

    return (
        <div className="bg-card border rounded-lg p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
                <p className={`px-2 py-0.5 text-xs font-medium rounded-full inline-block ${color}`}>{label}</p>
                <h3 className="font-semibold text-lg mt-1">{lesson.course.title}</h3>
                <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                    <Clock size={14} />
                    <span>{lesson.time?.slice(0, 5)}</span>
                </div>
            </div>
            <a
                href={lesson.recordingUrl || '#'}
                target="_blank"
                rel="noopener noreferrer"
                className={`w-full sm:w-auto mt-2 sm:mt-0 inline-flex items-center justify-center gap-2 rounded-md px-4 py-2 text-sm font-medium transition-colors ${
                    isPast ? 'bg-muted text-muted-foreground cursor-not-allowed' : 'bg-primary text-primary-foreground hover:bg-primary/90'
                }`}
                aria-disabled={isPast}
            >
                <Video size={16} />
                {isPast ? 'Занятие прошло' : 'Подключиться'}
            </a>
        </div>
    );
};

// --- Компоненты состояний ---

const LoadingState: React.FC = () => (
    <div className="space-y-8 animate-pulse">
        <div className="space-y-2">
            <div className="h-8 bg-muted rounded w-1/3"></div>
            <div className="h-4 bg-muted rounded w-1/2"></div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="h-24 bg-muted rounded-lg"></div>
            <div className="h-24 bg-muted rounded-lg"></div>
            <div className="h-24 bg-muted rounded-lg"></div>
        </div>
        <div className="space-y-4">
            <div className="h-6 bg-muted rounded w-1/4"></div>
            <div className="h-20 bg-muted rounded-lg"></div>
            <div className="h-20 bg-muted rounded-lg"></div>
        </div>
    </div>
);

const EmptyState: React.FC = () => (
    <div className="text-center bg-card border rounded-lg py-12 px-6">
        <CalendarOff className="mx-auto h-12 w-12 text-muted-foreground" />
        <h3 className="mt-4 text-lg font-semibold text-foreground">Ближайших занятий нет</h3>
        <p className="mt-2 text-sm text-muted-foreground">
            Все ваши предстоящие уроки будут отображаться здесь.
        </p>
    </div>
);

const ErrorState: React.FC<{ onRetry: () => void }> = ({ onRetry }) => (
    <div className="text-center bg-card border rounded-lg py-12 px-6">
        <AlertCircle className="mx-auto h-12 w-12 text-destructive" />
        <h3 className="mt-4 text-lg font-semibold text-foreground">Ошибка загрузки</h3>
        <p className="mt-2 text-sm text-muted-foreground">
            Не удалось получить данные для дашборда.
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
const StudentDashboard: React.FC = () => {
  const { user } = useAuth();
  const [data, setData] = useState<DashboardData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDashboardData = async () => {
    setIsLoading(true);
    setError(null);
    try {
      // const response = await apiClient.get<DashboardData>('/dashboard-summary/');
      // setData(response.data);

      // --- Имитация ответа API ---
      await new Promise(resolve => setTimeout(resolve, 1000));
      const mockData: DashboardData = {
        upcomingLessons: [
          { id: 1, title: 'Введение в алгебру', content: '', course: { title: 'Математическая грамотность' }, date: new Date().toISOString(), time: '15:00:00' },
          { id: 2, title: 'Древний Казахстан', content: '', course: { title: 'История Казахстана' }, date: new Date(Date.now() + 86400000).toISOString(), time: '17:00:00' },
        ],
        stats: { totalCourses: 3, completedPercentage: 65, testsTaken: 5 }
      };
      setData(mockData);

    } catch (err) {
      setError("Произошла ошибка при запросе к серверу.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  if (isLoading) {
    return <LoadingState />;
  }

  if (error || !data) {
    return <ErrorState onRetry={fetchDashboardData} />;
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
      <WelcomeHeader user={user} />
      <StatsOverview stats={data.stats} />
      
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">Ближайшие занятия</h2>
          <Link to="/my-courses" className="flex items-center gap-1 text-sm font-medium text-primary hover:underline">
            Все курсы <ChevronRight size={16} />
          </Link>
        </div>

        {data.upcomingLessons.length > 0 ? (
          <div className="space-y-4">
            {data.upcomingLessons.map((lesson) => <LessonCard key={lesson.id} lesson={lesson} />)}
          </div>
        ) : (
          <EmptyState />
        )}
      </section>
    </motion.div>
  );
};

export default StudentDashboard;