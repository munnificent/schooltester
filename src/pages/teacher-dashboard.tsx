// src/pages/teacher-dashboard.tsx
import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import apiClient from '../api/apiClient';
import { User } from '../types';

const TeacherDashboard: React.FC = () => {
  const [studentsCount, setStudentsCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await apiClient.get<User[]>('/users/?role=student');
        setStudentsCount(res.data.length);
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

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-card rounded-lg p-6 shadow-sm border">
          <p className="text-muted-foreground text-sm mb-1">Всего учеников</p>
          <h2 className="text-2xl font-bold">{loading ? '...' : studentsCount}</h2>
        </div>
        {/* Можно добавить больше карточек: курсы, домашние задания, уведомления */}
      </div>
    </motion.div>
  );
};

export default TeacherDashboard;
