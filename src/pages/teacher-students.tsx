// src/pages/teacher-students.tsx
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search } from 'lucide-react';
import apiClient from '../api/apiClient';
import { User } from '../types';
import { StatusIndicator } from '../components/admin/DataTable';

const TeacherStudents: React.FC = () => {
  const [students, setStudents] = useState<User[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadStudents = async () => {
      try {
        const res = await apiClient.get('/teacher-students/', {
          params: { role: 'student', search: searchQuery }
        });
        setStudents(res.data.results || []);
      } catch (error) {
        console.error("Ошибка загрузки студентов", error);
      } finally {
        setLoading(false);
      }
    };
    loadStudents();
  }, [searchQuery]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Мои ученики</h1>
        <div className="relative max-w-sm w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
          <input
            type="text"
            placeholder="Поиск по имени или email"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-input border rounded-md"
          />
        </div>
      </div>

      <div className="bg-card p-4 border rounded-lg overflow-x-auto">
        {loading ? (
          <p className="text-muted-foreground">Загрузка...</p>
        ) : students.length === 0 ? (
          <p className="text-muted-foreground">Ученики не найдены</p>
        ) : (
          <table className="min-w-full divide-y divide-border text-sm">
            <thead className="bg-muted/50 text-left text-muted-foreground">
              <tr>
                <th className="px-4 py-2">Имя</th>
                <th className="px-4 py-2">Email</th>
                <th className="px-4 py-2">Телефон</th>
                <th className="px-4 py-2">Статус</th>
              </tr>
            </thead>
            <tbody className="bg-card divide-y divide-border">
              {students.map(student => (
                <tr key={student.id}>
                  <td className="px-4 py-2">{student.firstName} {student.lastName}</td>
                  <td className="px-4 py-2">{student.email}</td>
                  <td className="px-4 py-2">{student.profile?.phone || 'Не указан'}</td>
                  <td className="px-4 py-2">
                    <StatusIndicator isActive={student.isActive} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </motion.div>
  );
};

export default TeacherStudents;
