//DashboardLayout.tsx
import React, { useState, useContext, Fragment } from 'react';
import { Link, NavLink, Outlet } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard, Book, User, Settings, Users, FileText, LogOut, Menu, X, GraduationCap
} from 'lucide-react';

import { useAuth } from '../../contexts/auth-context';

// --- Конфигурация навигации ---
const navLinksConfig = {
  admin: [
    { to: '/admin/dashboard', text: 'Дашборд', icon: LayoutDashboard },
    { to: '/admin/users', text: 'Пользователи', icon: Users },
    { to: '/admin/students', text: 'Ученики', icon: User },
    { to: '/admin/courses', text: 'Курсы', icon: Book },
    { to: '/admin/requests', text: 'Заявки', icon: FileText },
    { to: '/admin/settings', text: 'Настройки', icon: Settings },
  ],
  student: [
    { to: '/dashboard', text: 'Дашборд', icon: LayoutDashboard },
    { to: '/my-courses', text: 'Мои курсы', icon: Book },
    { to: '/profile', text: 'Профиль', icon: User },
  ],
  teacher: [
    { to: '/teacher/dashboard', text: 'Дашборд', icon: LayoutDashboard },
    { to: '/teacher/students', text: 'Мои ученики', icon: Users },
  ],
};

// --- Компоненты Layout ---

const Sidebar: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
  const { user, logout } = useAuth();
  const navLinks = user ? navLinksConfig[user.role] : [];
  const activeClass = 'bg-primary/10 text-primary';
  const inactiveClass = 'text-muted-foreground hover:bg-muted hover:text-foreground';

  return (
    <>
      {/* Overlay for mobile */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 z-30 lg:hidden"
          />
        )}
      </AnimatePresence>

      <motion.aside
        initial={false}
        animate={isOpen ? "open" : "closed"}
        variants={{
          open: { x: 0 },
          closed: { x: '-100%' },
        }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        className="fixed inset-y-0 left-0 w-64 bg-card border-r z-40 flex flex-col lg:translate-x-0"
      >
        <div className="flex items-center justify-between h-20 px-6 border-b">
          <Link to="/" className="flex items-center gap-2 text-xl font-bold">
            <GraduationCap className="h-7 w-7 text-primary" />
            <span>Munificent</span>
          </Link>
          <button onClick={onClose} className="lg:hidden p-1"><X size={20} /></button>
        </div>

        <nav className="flex-1 px-4 py-6 space-y-2">
          {navLinks.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              onClick={onClose}
              end
              className={({ isActive }) => `flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-colors ${isActive ? activeClass : inactiveClass}`}
            >
              <link.icon size={18} />
              <span>{link.text}</span>
            </NavLink>
          ))}
        </nav>

        <div className="p-4 border-t">
          <button onClick={logout} className="flex w-full items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground">
            <LogOut size={18} />
            <span>Выйти</span>
          </button>
        </div>
      </motion.aside>
    </>
  );
};

const DashboardHeader: React.FC<{ onMenuClick: () => void }> = ({ onMenuClick }) => {
  const { user } = useAuth();

  return (
    <header className="sticky top-0 z-20 bg-background/80 backdrop-blur-sm border-b">
      <div className="container mx-auto px-6 h-20 flex items-center justify-between lg:justify-end">
        <button onClick={onMenuClick} className="lg:hidden p-2 -ml-2">
          <Menu size={24} />
        </button>
        <div className="flex items-center gap-3">
          <div className="text-right">
            <p className="font-semibold text-sm">{user?.firstName} {user?.lastName}</p>
            <p className="text-xs text-muted-foreground">{user?.email}</p>
          </div>
          <img
            src={user?.avatar || `https://ui-avatars.com/api/?name=${user?.firstName}+${user?.lastName}`}
            alt="avatar"
            className="w-10 h-10 rounded-full"
          />
        </div>
      </div>
    </header>
  );
};



const DashboardLayout: React.FC = () => {
  const [isSidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-muted/40">
      <Sidebar isOpen={isSidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="lg:pl-64 flex flex-col flex-1">
        <DashboardHeader onMenuClick={() => setSidebarOpen(true)} />
        <main className="flex-1 p-4 sm:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;