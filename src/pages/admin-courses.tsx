import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Plus, Search } from 'lucide-react';
import toast from 'react-hot-toast';

import apiClient from '../api/apiClient';
import { useDebounce } from '../hooks/useDebounce';
import { Course, PaginatedResponse } from '../types';
import { DataTable, ColumnDef } from '../components/admin/DataTable';

// TODO: Заменить на импорты обновленных модальных окон
// import { CourseFormModal } from '../components/admin/modals/CourseFormModal';
// import { DeleteConfirmationModal } from '../components/admin/modals/DeleteConfirmationModal';
// import { LessonManagementModal } from '../components/admin/modals/LessonManagementModal';


// --- Основной компонент страницы ---

const AdminCoursesPage: React.FC = () => {
    const [courses, setCourses] = useState<Course[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    
    // Состояния для модальных окон
    const [isCourseModalOpen, setIsCourseModalOpen] = useState(false);
    const [isLessonModalOpen, setIsLessonModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);

    const debouncedSearch = useDebounce(searchQuery, 400);

    const fetchCourses = useCallback(async () => {
        setIsLoading(true);
        try {
            const params = { search: debouncedSearch };
            const response = await apiClient.get<PaginatedResponse<Course>>('/courses/', { params });
            setCourses(response.data.results);
        } catch (error) {
            toast.error("Не удалось загрузить курсы");
            setCourses([]);
        } finally {
            setIsLoading(false);
        }
    }, [debouncedSearch]);

    useEffect(() => { fetchCourses(); }, [fetchCourses]);
    
    // --- Обработчики действий ---
    const handleAdd = () => {
        setSelectedCourse(null);
        setIsCourseModalOpen(true);
    };
    const handleEdit = (course: Course) => {
        setSelectedCourse(course);
        setIsCourseModalOpen(true);
    };
    const handleManageLessons = (course: Course) => {
        setSelectedCourse(course);
        setIsLessonModalOpen(true);
    };
    const handleDelete = (course: Course) => {
        setSelectedCourse(course);
        setIsDeleteModalOpen(true);
    };
    const confirmDelete = async () => {
        if (!selectedCourse) return;
        const toastId = toast.loading('Удаление курса...');
        try {
            await apiClient.delete(`/courses/${selectedCourse.id}/`);
            toast.success(`Курс "${selectedCourse.title}" удален.`, { id: toastId });
            fetchCourses();
            setIsDeleteModalOpen(false);
        } catch (error) {
            toast.error("Не удалось удалить курс.", { id: toastId });
        }
    };

    // --- Определение колонок для таблицы ---
    const columns = useMemo<ColumnDef<Course>[]>(() => [
        {
            header: 'Название курса',
            accessorKey: 'title',
        },
        {
            header: 'Преподаватель',
            accessorKey: 'teacher',
            cell: (course) => (
                course.teacher ? (
                    <div className="flex items-center gap-3">
                        <img src={course.teacher.avatar || `https://ui-avatars.com/api/?name=${course.teacher.firstName}+${course.teacher.lastName}`} alt="avatar" className="h-9 w-9 rounded-full"/>
                        <p className="font-medium text-foreground">{course.teacher.firstName} {course.teacher.lastName}</p>
                    </div>
                ) : <span className="text-muted-foreground">Не назначен</span>
            )
        },
        { 
            header: 'Предмет', 
            accessorKey: 'subject',
            cell: (course) => <span className="px-2 py-1 text-xs font-medium rounded-full bg-muted">{course.subject}</span>
        },
        { 
            header: 'Цена',
            accessorKey: 'price',
            cell: (course) => new Intl.NumberFormat('ru-RU', { style: 'currency', currency: 'KZT', minimumFractionDigits: 0 }).format(Number(course.price))
        },
    ], []);
  
    return (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
            <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <h1 className="text-2xl font-bold tracking-tight">Управление курсами</h1>
                <button onClick={handleAdd} className="inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90">
                    <Plus size={16} /> Добавить курс
                </button>
            </header>

            <div className="bg-card border rounded-lg p-4 space-y-4">
                <div className="relative max-w-sm">
                    <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                    <input type="text" placeholder="Поиск по названию, предмету..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 bg-input border rounded-md"
                    />
                </div>
                
                <DataTable
                    columns={columns}
                    data={courses}
                    isLoading={isLoading}
                    // Передаем все возможные действия в таблицу
                    actions={[
                        { label: 'Уроки', handler: handleManageLessons },
                        { label: 'Редактировать', handler: handleEdit },
                        { label: 'Удалить', handler: handleDelete, isDestructive: true },
                    ]}
                />
            </div>

            {/* TODO: Заменить на обновленные модальные окна */}
            {/* <CourseFormModal isOpen={isCourseModalOpen} onClose={() => setIsCourseModalOpen(false)} onSuccess={fetchCourses} currentCourse={selectedCourse} /> */}
            {/* <DeleteConfirmationModal isOpen={isDeleteModalOpen} onClose={() => setIsDeleteModalOpen(false)} onConfirm={confirmDelete} itemName={selectedCourse?.title || ''} /> */}
            {/* <LessonManagementModal isOpen={isLessonModalOpen} onClose={() => setIsLessonModalOpen(false)} course={selectedCourse} /> */}
        </motion.div>
    );
};

export default AdminCoursesPage;