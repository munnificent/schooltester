import React, { useState, useEffect, useCallback, useMemo } from 'react';
import toast from 'react-hot-toast';
import { Save, Loader2, Search } from 'lucide-react';

import apiClient from '../../../api/apiClient';
import { User, Course, PaginatedResponse } from '../../../types';
import { Modal } from './Modal';

// --- Типы и интерфейсы ---
interface EnrollStudentModalProps {
  isOpen: boolean;
  onClose: () => void;
  student: User | null;
}

// --- Основной компонент модального окна ---
export const EnrollStudentModal: React.FC<EnrollStudentModalProps> = ({ isOpen, onClose, student }) => {
  const [allCourses, setAllCourses] = useState<Course[]>([]);
  const [selectedCourseIds, setSelectedCourseIds] = useState<Set<number>>(new Set());
  const [initialSelectedIds, setInitialSelectedIds] = useState<Set<number>>(new Set());
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Загрузка данных при открытии модального окна
  const fetchData = useCallback(async () => {
    if (!student) return;
    setIsLoading(true);
    try {
      // Загружаем все курсы и данные о текущем студенте параллельно
      const coursesPromise = apiClient.get<PaginatedResponse<Course>>('/courses/');
      const studentPromise = apiClient.get(`/users/${student.id}/`); // Предполагаем, что этот эндпоинт вернет курсы студента
      
      const [coursesResponse, studentResponse] = await Promise.all([coursesPromise, studentPromise]);

      setAllCourses(coursesResponse.data.results || []);

      // @ts-ignore - Бэкенд должен возвращать `enrolledCourses` в профиле
      const enrolledIds = new Set<number>(studentResponse.data.profile?.enrolledCourses?.map((c: Course) => c.id) || []);
      setSelectedCourseIds(enrolledIds);
      setInitialSelectedIds(enrolledIds); // Сохраняем начальное состояние для сравнения

    } catch (error) {
      toast.error("Не удалось загрузить данные.");
    } finally {
      setIsLoading(false);
    }
  }, [student]);

  useEffect(() => {
    if (isOpen) {
      fetchData();
    } else {
      // Сбрасываем состояние при закрытии
      setSearchQuery('');
    }
  }, [isOpen, fetchData]);

  // Обработчик сохранения
  const handleSave = async () => {
    if (!student) return;
    setIsSaving(true);
    const toastId = toast.loading('Сохранение изменений...');
    try {
      await apiClient.post(`/users/students/${student.id}/enroll/`, {
        courseIds: Array.from(selectedCourseIds)
      });
      toast.success('Запись на курсы успешно обновлена!', { id: toastId });
      onClose();
    } catch (error) {
      toast.error('Не удалось сохранить изменения.', { id: toastId });
    } finally {
      setIsSaving(false);
    }
  };

  // Фильтрация курсов по поисковому запросу
  const filteredCourses = useMemo(() => {
    return allCourses.filter(course =>
      course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.subject.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [allCourses, searchQuery]);

  // Проверка, были ли изменения
  const hasChanges = useMemo(() => {
    if (initialSelectedIds.size !== selectedCourseIds.size) return true;
    for (const id of initialSelectedIds) {
      if (!selectedCourseIds.has(id)) return true;
    }
    return false;
  }, [initialSelectedIds, selectedCourseIds]);

  // Обработчик выбора курса
  const handleToggleCourse = (courseId: number) => {
    setSelectedCourseIds(prev => {
      const newSet = new Set(prev);
      if (newSet.has(courseId)) {
        newSet.delete(courseId);
      } else {
        newSet.add(courseId);
      }
      return newSet;
    });
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Запись на курсы: ${student?.firstName} ${student?.lastName}`}>
        <div className="p-4 border-b">
             <div className="relative">
                <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <input
                    type="text"
                    placeholder="Поиск по названию или предмету..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 bg-input border rounded-md"
                />
            </div>
        </div>
        <div className="p-6 h-96 overflow-y-auto">
            {isLoading ? (
                <div className="space-y-3 animate-pulse">
                    <div className="h-8 bg-muted rounded"></div>
                    <div className="h-8 bg-muted rounded"></div>
                    <div className="h-8 bg-muted rounded"></div>
                </div>
            ) : filteredCourses.length > 0 ? (
                <div className="space-y-3">
                    {filteredCourses.map(course => (
                        <label key={course.id} className="flex items-center gap-3 p-3 rounded-md hover:bg-muted cursor-pointer">
                            <input
                                type="checkbox"
                                checked={selectedCourseIds.has(course.id)}
                                onChange={() => handleToggleCourse(course.id)}
                                className="h-5 w-5 rounded border-gray-300 text-primary focus:ring-primary"
                            />
                            <div>
                                <p className="font-medium">{course.title}</p>
                                <p className="text-sm text-muted-foreground">{course.subject}</p>
                            </div>
                        </label>
                    ))}
                </div>
            ) : (
                <p className="text-center text-muted-foreground py-10">Курсы не найдены.</p>
            )}
        </div>
        <footer className="flex justify-end gap-3 p-4 bg-muted/50 border-t">
          <button type="button" onClick={onClose} className="px-4 py-2 text-sm font-medium rounded-md hover:bg-muted">Отмена</button>
          <button type="button" onClick={handleSave} disabled={isSaving || !hasChanges} className="inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50">
            {isSaving ? <Loader2 className="h-4 w-4 animate-spin"/> : <Save className="h-4 w-4"/>}
            Сохранить
          </button>
        </footer>
    </Modal>
  );
};