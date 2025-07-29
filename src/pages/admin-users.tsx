import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { motion } from 'framer-motion';
import { MoreHorizontal, Plus, Search } from 'lucide-react';
import toast from 'react-hot-toast';

import apiClient from '../api/apiClient';
import { useDebounce } from '../hooks/useDebounce';
import { User, UserRole, PaginatedResponse } from '../types';
// TODO: Заменить на импорты обновленных модальных окон
// import { UserFormModal } from '../components/admin/modals/UserFormModal';
// import { DeleteConfirmationModal } from '../components/admin/modals/DeleteConfirmationModal';

// --- Компоненты UI для таблицы ---

const RoleChip: React.FC<{ role: UserRole }> = ({ role }) => {
    const roleStyle: Record<UserRole, { text: string; className: string }> = {
        student: { text: 'Ученик', className: 'bg-blue-100 text-blue-800' },
        teacher: { text: 'Преподаватель', className: 'bg-emerald-100 text-emerald-800' },
        admin: { text: 'Администратор', className: 'bg-amber-100 text-amber-800' },
    };
    const { text, className } = roleStyle[role] || { text: 'Неизвестно', className: 'bg-gray-100 text-gray-800' };
    return <span className={`px-2 py-1 text-xs font-medium rounded-full ${className}`}>{text}</span>;
};

const StatusIndicator: React.FC<{ isActive: boolean }> = ({ isActive }) => (
    <div className="flex items-center gap-2">
        <span className={`h-2.5 w-2.5 rounded-full ${isActive ? 'bg-success' : 'bg-gray-400'}`}></span>
        <span className="text-sm">{isActive ? 'Активен' : 'Неактивен'}</span>
    </div>
);

// --- Переиспользуемый компонент Таблицы ---

interface ColumnDef<T> {
  header: string;
  accessorKey: keyof T | string;
  cell?: (row: T) => React.ReactNode;
}

interface DataTableProps<T extends { id: number }> {
  columns: ColumnDef<T>[];
  data: T[];
  isLoading: boolean;
  onEdit: (item: T) => void;
  onDelete: (item: T) => void;
}

function DataTable<T extends { id: number }>({ columns, data, isLoading, onEdit, onDelete }: DataTableProps<T>) {
    // Рендеринг скелетона во время загрузки
    if (isLoading) {
        return (
            <div className="space-y-2 animate-pulse">
                {Array.from({ length: 5 }).map((_, i) => <div key={i} className="h-12 bg-muted rounded-md" />)}
            </div>
        );
    }
    // Рендеринг сообщения, если нет данных
    if (data.length === 0) {
        return <div className="text-center py-10 bg-muted rounded-md">Пользователи не найдены.</div>;
    }
    
    return (
        <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-border">
                <thead className="bg-muted/50">
                    <tr>
                        {columns.map(col => <th key={String(col.accessorKey)} className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">{col.header}</th>)}
                        <th className="px-6 py-3 text-right text-xs font-medium text-muted-foreground uppercase tracking-wider">Действия</th>
                    </tr>
                </thead>
                <tbody className="bg-card divide-y divide-border">
                    {data.map((item) => (
                        <tr key={item.id}>
                            {columns.map(col => (
                                <td key={String(col.accessorKey)} className="px-6 py-4 whitespace-nowrap text-sm">
                                    {col.cell ? col.cell(item) : String(item[col.accessorKey as keyof T] || '')}
                                </td>
                            ))}
                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                {/* TODO: Заменить на кастомный Dropdown, когда он будет готов */}
                                <button onClick={() => onEdit(item)} className="text-primary hover:text-primary/80 mr-4">Редактировать</button>
                                <button onClick={() => onDelete(item)} className="text-destructive hover:text-destructive/80">Удалить</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}


// --- Основной компонент страницы ---

const AdminUsersPage: React.FC = () => {
    const [users, setUsers] = useState<User[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedRole, setSelectedRole] = useState<string>("all");
    
    // Состояния для модальных окон
    const [isUserModalOpen, setIsUserModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState<User | null>(null);

    const debouncedSearch = useDebounce(searchQuery, 400);

    const fetchUsers = useCallback(async () => {
        setIsLoading(true);
        try {
            const params = { search: debouncedSearch, role: selectedRole === 'all' ? '' : selectedRole };
            const response = await apiClient.get<PaginatedResponse<User>>('/users/', { params });
            setUsers(response.data.results);
        } catch (error) {
            toast.error("Не удалось загрузить пользователей");
            setUsers([]);
        } finally {
            setIsLoading(false);
        }
    }, [debouncedSearch, selectedRole]);

    useEffect(() => { fetchUsers(); }, [fetchUsers]);
    
    // --- Обработчики действий ---
    const handleAdd = () => {
        setSelectedUser(null);
        setIsUserModalOpen(true);
    };
    const handleEdit = (user: User) => {
        setSelectedUser(user);
        setIsUserModalOpen(true);
    };
    const handleDelete = (user: User) => {
        setSelectedUser(user);
        setIsDeleteModalOpen(true);
    };
    const confirmDelete = async () => {
        if (!selectedUser) return;
        const toastId = toast.loading('Удаление пользователя...');
        try {
            await apiClient.delete(`/users/${selectedUser.id}/`);
            toast.success(`Пользователь ${selectedUser.email} удален.`, { id: toastId });
            fetchUsers();
            setIsDeleteModalOpen(false);
        } catch (error) {
            toast.error("Не удалось удалить пользователя.", { id: toastId });
        }
    };

    // --- Определение колонок для таблицы ---
    const columns = useMemo<ColumnDef<User>[]>(() => [
        {
            header: 'Пользователь',
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
        { header: 'Роль', accessorKey: 'role', cell: (user) => <RoleChip role={user.role} /> },
        { header: 'Статус', accessorKey: 'isActive', cell: (user) => <StatusIndicator isActive={user.isActive} /> },
        { header: 'Последний вход', accessorKey: 'lastLogin', cell: (user) => user.lastLogin ? new Date(user.lastLogin).toLocaleString('ru-RU') : "Никогда" },
    ], []);
  
    return (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
            <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <h1 className="text-2xl font-bold tracking-tight">Управление пользователями</h1>
                <button onClick={handleAdd} className="inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90">
                    <Plus size={16} /> Добавить пользователя
                </button>
            </header>

            <div className="bg-card border rounded-lg p-4 space-y-4">
                <div className="flex flex-col sm:flex-row gap-4">
                    <div className="relative flex-1">
                        <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                        <input type="text" placeholder="Поиск по имени, email..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 bg-input border rounded-md"
                        />
                    </div>
                    {/* TODO: Заменить на кастомный Tabs */}
                    <div className="flex items-center gap-2 p-1 bg-muted rounded-md">
                        {['all', 'admin', 'teacher', 'student'].map(role => (
                            <button key={role} onClick={() => setSelectedRole(role)}
                                className={`px-3 py-1 text-sm font-medium rounded-md transition-colors ${selectedRole === role ? 'bg-background shadow-sm' : 'hover:bg-background/50'}`}>
                                {role.charAt(0).toUpperCase() + role.slice(1)}
                            </button>
                        ))}
                    </div>
                </div>
                
                <DataTable
                    columns={columns}
                    data={users}
                    isLoading={isLoading}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                />
            </div>

            {/* TODO: Заменить на обновленные модальные окна */}
            {/* <UserFormModal isOpen={isUserModalOpen} onClose={() => setIsUserModalOpen(false)} onSuccess={fetchUsers} currentUser={selectedUser}/> */}
            {/* <DeleteConfirmationModal isOpen={isDeleteModalOpen} onClose={() => setIsDeleteModalOpen(false)} onConfirm={confirmDelete} itemName={selectedUser?.email || ''} /> */}
        </motion.div>
    );
};

export default AdminUsersPage;