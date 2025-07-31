import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Users, UserCheck, BookOpen, FileText, ArrowRight, Inbox } from 'lucide-react';

import apiClient from '../api/apiClient';
import { Application, ApplicationStatus, PaginatedResponse } from '../types';

// --- Типы для данных дашборда ---
interface DashboardStats {
  studentsCount: number;
  teachersCount: number;
  coursesCount: number;
  newApplicationsCount: number;
}

interface DashboardData {
  stats: DashboardStats;
  recentApplications: Application[];
}

// --- Компоненты-секции ---

const StatCard: React.FC<{
  icon: React.ElementType;
  label: string;
  value?: number;
  color: string;
  isLoading: boolean;
}> = ({ icon: Icon, label, value, color, isLoading }) => {
  if (isLoading) {
    return (
      <div className="bg-card border rounded-lg p-5 flex items-center gap-4 animate-pulse">
        <div className={`p-4 rounded-lg ${color.replace('text-', 'bg-')}/10`}>
          <div className="h-6 w-6 bg-muted rounded-md"></div>
        </div>
        <div className="space-y-2">
          <div className="h-4 bg-muted rounded w-24"></div>
          <div className="h-7 bg-muted rounded w-12"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-card border rounded-lg p-5 flex items-center gap-4">
      <div className={`p-3 rounded-lg ${color.replace('text-', 'bg-')}/10`}>
        <Icon className={`h-6 w-6 ${color}`} />
      </div>
      <div>
        <p className="text-sm text-muted-foreground">{label}</p>
        <h3 className="text-2xl font-bold">{value ?? 0}</h3>
      </div>
    </div>
  );
};

const RecentApplications: React.FC<{ applications: Application[]; isLoading: boolean }> = ({ applications, isLoading }) => {
    const StatusChip = ({ status }: { status: ApplicationStatus }) => {
        const statusStyle: Record<ApplicationStatus, string> = {
            new: 'bg-blue-100 text-blue-800',
            in_progress: 'bg-amber-100 text-amber-800',
            closed: 'bg-emerald-100 text-emerald-800',
        };
        const textMap: Record<ApplicationStatus, string> = { new: 'Новая', in_progress: 'В работе', closed: 'Оформлен' };
        return <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${statusStyle[status]}`}>{textMap[status]}</span>;
    };

    if (isLoading) {
        return <div className="bg-card border rounded-lg p-6 space-y-4 animate-pulse">
            <div className="h-6 w-1/3 bg-muted rounded"></div>
            <div className="h-10 bg-muted rounded"></div>
            <div className="h-10 bg-muted rounded"></div>
            <div className="h-10 bg-muted rounded"></div>
        </div>
    }
    
    return (
        <div className="bg-card border rounded-lg">
            <header className="p-4 border-b flex justify-between items-center">
                <h3 className="font-semibold">Последние заявки</h3>
                <Link to="/admin/requests" className="flex items-center gap-1 text-sm font-medium text-primary hover:underline">
                    Все заявки <ArrowRight size={16} />
                </Link>
            </header>
            {applications.length > 0 ? (
                <ul className="divide-y divide-border">
                    {applications.map(app => (
                        <li key={app.id} className="p-4 flex justify-between items-center hover:bg-muted/50">
                            <div>
                                <p className="font-medium">{app.name}</p>
                                <p className="text-sm text-muted-foreground">{app.phone}</p>
                            </div>
                            <StatusChip status={app.status} />
                        </li>
                    ))}
                </ul>
            ) : (
                <div className="text-center py-10 text-muted-foreground">
                    <Inbox size={32} className="mx-auto mb-2" />
                    <p>Новых заявок нет</p>
                </div>
            )}
        </div>
    );
};

// --- Основной компонент страницы ---
const AdminDashboard: React.FC = () => {
    const [data, setData] = useState<DashboardData | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            setError(null);
            try {
                const response = await apiClient.get<DashboardData>('/admin-dashboard-summary/');
                setData(response.data);
            } catch (err) {
                setError("Не удалось загрузить данные для панели управления.");
            } finally {
                setIsLoading(false);
            }
        };
        fetchData();
    }, []);

    const statCards = [
        { icon: Users, label: 'Учеников', value: data?.stats.studentsCount, color: 'text-blue-500' },
        { icon: UserCheck, label: 'Преподавателей', value: data?.stats.teachersCount, color: 'text-emerald-500' },
        { icon: BookOpen, label: 'Активных курсов', value: data?.stats.coursesCount, color: 'text-amber-500' },
        { icon: FileText, label: 'Новых заявок', value: data?.stats.newApplicationsCount, color: 'text-rose-500' },
    ];

    return (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
            <header>
                <h1 className="text-2xl font-bold tracking-tight">Панель управления</h1>
                <p className="text-muted-foreground mt-1">Общий обзор состояния школы.</p>
            </header>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {statCards.map(card => <StatCard key={card.label} {...card} isLoading={isLoading} />)}
            </div>
            
            <RecentApplications applications={data?.recentApplications || []} isLoading={isLoading} />
        </motion.div>
    );
};

export default AdminDashboard;