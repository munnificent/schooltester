import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MoreHorizontal, Plus, Search } from 'lucide-react';
import toast from 'react-hot-toast';

import apiClient from '../api/apiClient';
import { useDebounce } from '../hooks/useDebounce';
import { User, UserRole, PaginatedResponse } from '../types';

import { UserFormModal } from '../components/admin/modals/UserFormModal';
import { DeleteConfirmationModal } from '../components/admin/modals/DeleteConfirmationModal';
import { DataTable, ColumnDef, StatusIndicator } from '../components/admin/DataTable';


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



// --- Переиспользуемый компонент Таблицы ---





// --- Основной компонент страницы ---

function AdminUsersPage() {
    const [users, setUsers] = useState<User[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedRole, setSelectedRole] = useState<string>('all');
    const [isDeleting, setIsDeleting] = useState(false);

    const [isUserModalOpen, setIsUserModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState<User | null>(null);

    const debouncedSearch = useDebounce(searchQuery, 400);

    const fetchUsers = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        try {
            const params = { search: debouncedSearch, role: selectedRole === 'all' ? '' : selectedRole, ordering: '-created_at' };
            const response = await apiClient.get<PaginatedResponse<User>>('/users/', { params });
            setUsers(response.data.results);
        } catch (error) {
            setError("Не удалось загрузить пользователей");
            setUsers([]);
        } finally {
            setIsLoading(false);
        }
    }, [debouncedSearch, selectedRole]);

    useEffect(() => {
        fetchUsers();
    }, [fetchUsers]);

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
            toast.success(`Пользователь ${selectedUser.email} удалён.`, { id: toastId });
            fetchUsers();
            setIsDeleteModalOpen(false);
        } catch (error) {
            toast.error("Не удалось удалить пользователя.", { id: toastId });
        }
    };

    const columns = useMemo<ColumnDef<User>[]>(() => [
        {
            header: 'Пользователь',
            accessorKey: 'firstName',
            cell: (user) => (
                <div className="flex items-center gap-3">
                    <img
                        src={user.profile?.avatar || `https://ui-avatars.com/api/?name=${user.firstName}+${user.lastName}`}
                        alt="avatar"
                        className="h-9 w-9 rounded-full"
                    />
                    <div>
                        <p className="font-medium text-foreground">{user.firstName} {user.lastName}</p>
                        <p className="text-xs text-muted-foreground">{user.email}</p>
                    </div>
                </div>
            )
        },
        { header: 'Роль', accessorKey: 'role', cell: (user) => <RoleChip role={user.role} /> },
        { header: 'Статус', accessorKey: 'isActive', cell: (user) => <StatusIndicator isActive={user.isActive} /> },
        { header: 'Последний вход', accessorKey: 'lastLogin', cell: (user) => user.lastLogin ? new Date(user.lastLogin).toLocaleString('ru-RU') : 'Никогда' },
    ], []);

    if (error) {
        return (
            <div className="text-center py-10 bg-muted rounded-md">
                <p className="font-medium text-destructive">{error}</p>
                <button onClick={fetchUsers} className="mt-4 px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition">
                    Попробовать снова
                </button>
            </div>
        );
    }

    return (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
            <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <h1 className="text-2xl font-bold tracking-tight">Управление пользователями</h1>
                <button
                    onClick={handleAdd}
                    className="inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
                >
                    <Plus size={16} /> Добавить пользователя
                </button>
            </header>

            <div className="bg-card border rounded-lg p-4 space-y-4">
                <div className="flex flex-col sm:flex-row gap-4">
                    <div className="relative flex-1">
                        <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                        <input
                            type="text"
                            placeholder="Поиск по имени, email..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 bg-input border rounded-md"
                        />
                    </div>
                    <div className="flex items-center gap-2 p-1 bg-muted rounded-md">
                        {['all', 'admin', 'teacher', 'student'].map(role => (
                            <button
                                key={role}
                                onClick={() => setSelectedRole(role)}
                                className={`px-3 py-1 text-sm font-medium rounded-md transition-colors ${selectedRole === role ? 'bg-background shadow-sm' : 'hover:bg-background/50'}`}
                            >
                                {role.charAt(0).toUpperCase() + role.slice(1)}
                            </button>
                        ))}
                    </div>
                </div>

                <DataTable
                    columns={columns}
                    data={users}
                    isLoading={isLoading}
                    actions={[
                        { label: 'Редактировать', handler: handleEdit },
                        { label: 'Удалить', handler: handleDelete, isDestructive: true },
                    ]}
                />
            </div>

            <UserFormModal
                isOpen={isUserModalOpen}
                onClose={() => setIsUserModalOpen(false)}
                onSuccess={fetchUsers}
                currentUser={selectedUser}
            />

            <DeleteConfirmationModal
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                onConfirm={confirmDelete}
                itemName={selectedUser?.email || ''}
                isDeleting={isDeleting}
            />
        </motion.div>
    );
};

export default AdminUsersPage;