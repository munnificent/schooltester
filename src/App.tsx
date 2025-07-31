// src/App.tsx
import React from 'react';
import {
  createBrowserRouter,
  RouterProvider,
  Navigate,
  Outlet,
  useLocation,
} from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { useAuth } from './contexts/auth-context';

// --- Layouts ---
import DashboardLayout from './components/layouts/DashboardLayout';
import PublicLayout from './components/layouts/PublicLayout';

// --- Публичные страницы ---
import LandingPage from './pages/landing-page';
import AboutUsPage from './pages/about-us'; 
import CoursesPage from './pages/courses';
import BlogIndexPage from './pages/blog/index';
import BlogDetailPage from './pages/blog/blog-detail';
import LoginPage from './pages/login';
import NotFoundPage from './pages/not-found';

// --- Страницы студентов ---
import StudentDashboard from './pages/dashboard';
import MyCoursesPage from './pages/my-courses';
import CourseDetailPage from './pages/course-detail';
import StudentProfilePage from './pages/profile';
import TestSimulatorPage from './pages/test-simulator';

// --- Страницы преподавателя ---
import TeacherDashboard from './pages/teacher-dashboard';
import TeacherStudentsPage from './pages/teacher-students';

// --- Страницы администратора ---
import AdminDashboard from './pages/admin-dashboard';
import AdminUsersPage from './pages/admin-users';
import AdminCoursesPage from './pages/admin-courses';
import AdminRequestsPage from './pages/admin-requests';
import AdminSettingsPage from './pages/admin-settings';
import AdminStudentsPage from './pages/admin-students';

// --- Страница ошибки ---
import ErrorPage from './pages/ErrorPage';

// --- Компонент защищенного маршрута ---
const ProtectedRoute: React.FC<{ allowedRoles: string[] }> = ({ allowedRoles }) => {
  const { isAuthenticated, user, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  const hasRole = user && allowedRoles.includes(user.role);
  if (!hasRole) {
    const fallbackPath =
      user?.role === 'admin'
        ? '/admin/dashboard'
        : user?.role === 'teacher'
        ? '/teacher/dashboard'
        : '/dashboard';
    return <Navigate to={fallbackPath} replace />;
  }

  return <Outlet />;
};

// --- Основной маршрутизатор ---
const router = createBrowserRouter([
  // Публичные страницы
  {
    element: <PublicLayout />,
    errorElement: <ErrorPage />,
    children: [
      { path: '/', element: <LandingPage /> },
      { path: '/about-us', element: <AboutUsPage /> },
      { path: '/courses', element: <CoursesPage /> },
      { path: '/blog', element: <BlogIndexPage /> },
      { path: '/blog/:slug', element: <BlogDetailPage /> },
    ],
  },

  // Страница входа
  {
    path: '/login',
    element: <LoginPage />,
  },

  // Роуты студента
  {
    element: <ProtectedRoute allowedRoles={['student']} />,
    errorElement: <ErrorPage />,
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

  // Роуты администратора
  {
    path: '/admin',
    element: <ProtectedRoute allowedRoles={['admin']} />,
    errorElement: <ErrorPage />,
    children: [
      {
        element: <DashboardLayout />,
        children: [
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

  // Роуты преподавателя
  {
    path: '/teacher',
    element: <ProtectedRoute allowedRoles={['teacher']} />,
    errorElement: <ErrorPage />,
    children: [
      {
        element: <DashboardLayout />,
        children: [
          { index: true, element: <Navigate to="/teacher/dashboard" replace /> },
          { path: 'dashboard', element: <TeacherDashboard /> },
          { path: 'students', element: <TeacherStudentsPage /> },
        ],
      },
    ],
  },

  // Страница 404
  {
    path: '*',
    element: <NotFoundPage />,
  },
]);

// --- Главный компонент приложения ---
const App: React.FC = () => {
  return <RouterProvider router={router} />;
};

export default App;
