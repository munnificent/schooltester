import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Plus, Search } from 'lucide-react';
import toast from 'react-hot-toast';

import apiClient from '../api/apiClient';
import { useDebounce } from '../hooks/useDebounce';
import { User, PaginatedResponse } from '../types';
import { DataTable, ColumnDef, StatusIndicator } from '../components/admin/DataTable';

// TODO: Заменить на импорты обновленных модальных окон
// import { UserFormModal } from '../components/admin/modals/UserFormModal';
// import { DeleteConfirmationModal } from '../components/admin/modals/DeleteConfirmationModal';
// import { EnrollStudentModal } from '../components/admin/modals/EnrollStudentModal';


// --- Основной компонент страницы ---

const AdminStudentsPage: React.FC = () => {
    const [students, setStudents] = useState<User[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    
    // Состояния для модальных окон
    const [isUserModalOpen, setIsUserModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [isEnrollModalOpen, setIsEnrollModalOpen] = useState(false);
    const [selectedStudent, setSelectedStudent] = useState<User | null>(null);

    const debouncedSearch = useDebounce(searchQuery, 400);

    const fetchStudents = useCallback(async () => {
        setIsLoading(true);
        try {
            const params = { search: debouncedSearch, role: 'student' }; // Всегда запрашиваем только студентов
            const response = await apiClient.get<PaginatedResponse<User>>('/users/', { params });
            setStudents(response.data.results);
        } catch (error) {
            toast.error("Не удалось загрузить список учеников");
            setStudents([]);
        } finally {
            setIsLoading(false);
        }
    }, [debouncedSearch]);

    useEffect(() => { fetchStudents(); }, [fetchStudents]);
    
    // --- Обработчики действий ---
    const handleAdd = () => {
        setSelectedStudent(null);
        setIsUserModalOpen(true);
    };
    const handleEdit = (student: User) => {
        setSelectedStudent(student);
        setIsUserModalOpen(true);
    };
    const handleDelete = (student: User) => {
        setSelectedStudent(student);
        setIsDeleteModalOpen(true);
    };
    const handleEnroll = (student: User) => {
        setSelectedStudent(student);
        setIsEnrollModalOpen(true);
    };
    const confirmDelete = async () => {
        if (!selectedStudent) return;
        const toastId = toast.loading('Удаление ученика...');
        try {
            await apiClient.delete(`/users/${selectedStudent.id}/`);
            toast.success(`Ученик ${selectedStudent.email} удален.`, { id: toastId });
            fetchStudents();
            setIsDeleteModalOpen(false);
        } catch (error) {
            toast.error("Не удалось удалить ученика.", { id: toastId });
        }
    };

    // --- Определение колонок для таблицы ---
    const columns = useMemo<ColumnDef<User>[]>(() => [
        {
            header: 'Ученик',
            accessorKey: 'firstName',
            cell: (user) => (
                <div className="flex items-center gap-3">
                    <img src={user.avatar || `https://ui-avatars.com/api/?name=${user.firstName}+${user.lastName}`} alt="avatar" className="h-9 w-9 rounded-full"/>
                    <div>
                        <p className="font-medium text-foreground">{user.firstName} {user.lastName}</p>
                        <p className="text-xs text-muted-foreground">{user.email}</p>
                    </div>
                </div>
            )
        },
        { 
            header: 'Телефон', 
            accessorKey: 'profile.phone', 
            cell: (user) => user.profile?.phone || <span className="text-muted-foreground">Не указан</span>
        },
        { header: 'Статус', accessorKey: 'isActive', cell: (user) => <StatusIndicator isActive={user.isActive} /> },
        { header: 'Последний вход', accessorKey: 'lastLogin', cell: (user) => user.lastLogin ? new Date(user.lastLogin).toLocaleString('ru-RU') : "Никогда" },
    ], []);
  
    return (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
            <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <h1 className="text-2xl font-bold tracking-tight">Управление учениками</h1>
                <button onClick={handleAdd} className="inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90">
                    <Plus size={16} /> Добавить ученика
                </button>
            </header>

            <div className="bg-card border rounded-lg p-4 space-y-4">
                <div className="relative max-w-sm">
                    <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                    <input type="text" placeholder="Поиск по имени, email..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 bg-input border rounded-md"
                    />
                </div>
                
                <DataTable
                    columns={columns}
                    data={students}
                    isLoading={isLoading}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                    // Добавляем кастомное действие
                    customActions={[
                        { label: 'Записать на курс', handler: handleEnroll }
                    ]}
                />
            </div>

            {/* TODO: Заменить на обновленные модальные окна */}
            {/* <UserFormModal isOpen={isUserModalOpen} onClose={() => setIsUserModalOpen(false)} onSuccess={fetchStudents} currentUser={selectedStudent} defaultRole="student" /> */}
            {/* <DeleteConfirmationModal isOpen={isDeleteModalOpen} onClose={() => setIsDeleteModalOpen(false)} onConfirm={confirmDelete} itemName={selectedStudent?.email || ''} /> */}
            {/* <EnrollStudentModal isOpen={isEnrollModalOpen} onClose={() => setIsEnrollModalOpen(false)} student={selectedStudent} /> */}
        </motion.div>
    );
};

export default AdminStudentsPage;