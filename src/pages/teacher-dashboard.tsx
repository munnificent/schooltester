import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Users, Book } from 'lucide-react';
import apiClient from '../api/apiClient';

interface TeacherStats {
  studentCount: number;
  courseCount: number;
}

const TeacherDashboard: React.FC = () => {
  const [stats, setStats] = useState<TeacherStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      setLoading(true);
      try {
        const res = await apiClient.get<TeacherStats>('/teacher-dashboard-summary/');
        setStats(res.data);
      } catch (e) {
        console.error('Ошибка загрузки статистики:', e);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }} 
      animate={{ opacity: 1, y: 0 }} 
      className="space-y-6"
    >
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Панель преподавателя</h1>
        <p className="text-muted-foreground">Быстрая статистика по ученикам и курсам</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <StatCard 
            icon={Users} 
            label="Всего учеников" 
            value={stats?.studentCount} 
            isLoading={loading} 
        />
        <StatCard 
            icon={Book} 
            label="Активных курсов" 
            value={stats?.courseCount} 
            isLoading={loading} 
        />
      </div>
    </motion.div>
  );
};

interface StatCardProps {
    icon: React.ElementType;
    label: string;
    value?: number;
    isLoading: boolean;
}

const StatCard: React.FC<StatCardProps> = ({ icon: Icon, label, value, isLoading }) => (
    <div className="bg-card rounded-lg p-6 shadow-sm border flex items-center gap-4">
        <div className="p-3 bg-primary/10 rounded-md">
            <Icon className="h-6 w-6 text-primary" />
        </div>
        <div>
            <p className="text-muted-foreground text-sm">{label}</p>
            <h2 className="text-2xl font-bold">
                {isLoading ? (
                    <div className="h-7 w-12 bg-muted-foreground/20 rounded-md animate-pulse" />
                ) : (
                    value
                )}
            </h2>
        </div>
    </div>
);

export default TeacherDashboard;
