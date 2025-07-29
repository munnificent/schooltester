import React, { useContext } from 'react';
import {
  createBrowserRouter,
  RouterProvider,
  Navigate,
  Outlet,
  useLocation,
} from 'react-router-dom';
import { useAuth } from './contexts/auth-context';
import { Loader2 } from 'lucide-react';

// --- Импорт Layouts (Оберток страниц) ---
import DashboardLayout from './components/layouts/DashboardLayout';
import PublicLayout from './components/layouts/PublicLayout';

// --- Импорт всех страниц приложения ---
// Публичные страницы
import LandingPage from './pages/landing-page';
// import AboutUsPage from './pages/about-us'; // TODO: Создать или раскомментировать
import CoursesPage from './pages/courses';
import BlogIndexPage from './pages/blog/index';
import BlogDetailPage from './pages/blog/blog-detail';
import LoginPage from './pages/login';
import NotFoundPage from './pages/not-found';

// Страницы Студента
import StudentDashboard from './pages/dashboard';
import MyCoursesPage from './pages/my-courses';
import CourseDetailPage from './pages/course-detail';
import StudentProfilePage from './pages/profile';
import TestSimulatorPage from './pages/test-simulator';

// Страницы Преподавателя (пока заглушки)
// import TeacherDashboard from './pages/teacher-dashboard';
// import TeacherStudentsPage from './pages/teacher-students';

// Страницы Администратора
import AdminDashboard from './pages/admin-dashboard';
import AdminUsersPage from './pages/admin-users';
import AdminCoursesPage from './pages/admin-courses';
import AdminRequestsPage from './pages/admin-requests';
import AdminSettingsPage from './pages/admin-settings';
import AdminStudentsPage from './pages/admin-students';


/**
 * Компонент для защиты роутов.
 * 1. Проверяет, авторизован ли пользователь.
 * 2. Если нет - перенаправляет на /login.
 * 3. Проверяет, соответствует ли роль пользователя разрешенным ролям.
 * 4. Если роль не подходит - перенаправляет на страницу по умолчанию для этой роли.
 */
const ProtectedRoute: React.FC<{ allowedRoles: string[] }> = ({ allowedRoles }) => {
  const { isAuthenticated, user, isLoading } = useAuth();
  const location = useLocation();

  // Пока идет проверка авторизации, показываем спиннер
  if (isLoading) {
    return (
        <div className="flex h-screen w-full items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
    );
  }

  // Если пользователь не авторизован, отправляем на логин
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Если роль пользователя не входит в список разрешенных, перенаправляем
  const userHasRequiredRole = user && allowedRoles.includes(user.role);
  if (!userHasRequiredRole) {
    const homePath = user?.role === 'admin' ? '/admin/dashboard' : user?.role === 'teacher' ? '/teacher/dashboard' : '/dashboard';
    return <Navigate to={homePath} replace />;
  }

  // Если все проверки пройдены, рендерим дочерний роут
  return <Outlet />;
};


// --- Конфигурация всех роутов приложения ---
const router = createBrowserRouter([
  // --- Публичные роуты ---
  {
    element: <PublicLayout />,
    children: [
      { path: '/', element: <LandingPage /> },
      // { path: '/about-us', element: <AboutUsPage /> },
      { path: '/courses', element: <CoursesPage /> },
      { path: '/blog', element: <BlogIndexPage /> },
      { path: '/blog/:slug', element: <BlogDetailPage /> },
    ],
  },

  // --- Страница входа ---
  {
    path: '/login',
    element: <LoginPage />,
  },

  // --- Роуты для Студента ---
  {
    element: <ProtectedRoute allowedRoles={['student']} />,
    children: [
      {
        element: <DashboardLayout />,
        children: [
          { path: '/dashboard', element: <StudentDashboard /> },
          { path: '/my-courses', element: <MyCoursesPage /> },
          { path: '/course-detail/:courseId', element: <CourseDetailPage /> },
          { path: '/my-courses/:courseId/test', element: <TestSimulatorPage /> },
          { path: '/profile', element: <StudentProfilePage /> },
        ],
      },
    ],
  },
  
  // --- Роуты для Администратора ---
  {
    path: '/admin', // Группируем все админские роуты
    element: <ProtectedRoute allowedRoles={['admin']} />,
    children: [
      {
        element: <DashboardLayout />,
        children: [
          // Редирект с /admin на /admin/dashboard
          { index: true, element: <Navigate to="/admin/dashboard" replace /> },
          { path: 'dashboard', element: <AdminDashboard /> },
          { path: 'users', element: <AdminUsersPage /> },
          { path: 'students', element: <AdminStudentsPage /> },
          { path: 'courses', element: <AdminCoursesPage /> },
          { path: 'requests', element: <AdminRequestsPage /> },
          { path: 'settings', element: <AdminSettingsPage /> },
        ],
      },
    ],
  },

  // --- Страница 404 ---
  {
    path: '*',
    element: <NotFoundPage />,
  },
]);

// Главный компонент App, который просто предоставляет роутер
const App: React.FC = () => {
  return <RouterProvider router={router} />;
};

export default App;