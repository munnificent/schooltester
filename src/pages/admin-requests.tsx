import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Search, ChevronDown, Check, Clock, Archive, Inbox } from 'lucide-react';
import toast from 'react-hot-toast';

import apiClient from '../api/apiClient';
import { useDebounce } from '../hooks/useDebounce';
import { Application, ApplicationStatus, PaginatedResponse } from '../types';
import { DataTable, ColumnDef } from '../components/admin/DataTable';

// --- Компоненты UI для таблицы ---

const StatusChip: React.FC<{ status: ApplicationStatus }> = ({ status }) => {
    const statusStyle: Record<ApplicationStatus, { text: string; className: string; icon: React.ElementType }> = {
        new: { text: 'Новая', className: 'bg-blue-100 text-blue-800', icon: Inbox },
        in_progress: { text: 'В работе', className: 'bg-amber-100 text-amber-800', icon: Clock },
        closed: { text: 'Оформлен', className: 'bg-emerald-100 text-emerald-800', icon: Check },
        // archived: { text: 'В архиве', className: 'bg-gray-100 text-gray-800', icon: Archive },
    };
    const { text, className, icon: Icon } = statusStyle[status] || { text: 'Неизвестно', className: 'bg-gray-100 text-gray-800', icon: Inbox };
    return (
        <span className={`inline-flex items-center gap-1.5 px-2 py-1 text-xs font-medium rounded-full ${className}`}>
            <Icon size={14} /> {text}
        </span>
    );
};

// --- Основной компонент страницы ---

const AdminRequestsPage: React.FC = () => {
    const [applications, setApplications] = useState<Application[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [statusFilter, setStatusFilter] = useState<string>("all");

    const debouncedSearch = useDebounce(searchQuery, 400);

    const fetchApplications = useCallback(async () => {
        setIsLoading(true);
        try {
            const params = { search: debouncedSearch, status: statusFilter === 'all' ? '' : statusFilter };
            const response = await apiClient.get<PaginatedResponse<Application>>('/applications/', { params });
            setApplications(response.data.results);
        } catch (error) {
            toast.error("Не удалось загрузить заявки");
            setApplications([]);
        } finally {
            setIsLoading(false);
        }
    }, [debouncedSearch, statusFilter]);

    useEffect(() => { fetchApplications(); }, [fetchApplications]);

    const handleStatusChange = async (id: number, newStatus: ApplicationStatus) => {
        const originalApplications = [...applications];
        // Оптимистичное обновление UI
        setApplications(prev => prev.map(app => app.id === id ? { ...app, status: newStatus } : app));

        try {
            await apiClient.patch(`/applications/${id}/`, { status: newStatus });
            toast.success("Статус заявки обновлен");
        } catch (error) {
            toast.error("Не удалось обновить статус");
            setApplications(originalApplications); // Возвращаем исходное состояние в случае ошибки
        }
    };

    const columns = useMemo<ColumnDef<Application>[]>(() => [
        {
            header: 'Клиент',
            accessorKey: 'name',
            cell: (app) => (
                <div>
                    <p className="font-medium text-foreground">{app.name}</p>
                    <p className="text-xs text-muted-foreground">{app.phone}</p>
                </div>
            )
        },
        {
            header: 'Курс',
            accessorKey: 'course.title',
            cell: (app) => app.course?.title || <span className="text-muted-foreground">Не указан</span>
        },
        {
            header: 'Дата заявки',
            accessorKey: 'createdAt',
            cell: (app) => new Date(app.createdAt).toLocaleDateString('ru-RU')
        },
        {
            header: 'Статус',
            accessorKey: 'status',
            cell: (app) => (
                // TODO: Заменить на кастомный Dropdown для смены статуса
                <select 
                    value={app.status} 
                    onChange={(e) => handleStatusChange(app.id, e.target.value as ApplicationStatus)}
                    className="p-1 text-xs border-none bg-transparent rounded-md focus:ring-1 focus:ring-primary"
                    onClick={(e) => e.stopPropagation()} // Предотвращаем клик по всей строке
                >
                    <option value="new">Новая</option>
                    <option value="in_progress">В работе</option>
                    <option value="closed">Оформлен</option>
                </select>
            )
        },
    ], []);

    const statusOptions = [
        { key: 'all', label: 'Все статусы' },
        { key: 'new', label: 'Новые' },
        { key: 'in_progress', label: 'В работе' },
        { key: 'closed', label: 'Оформленные' },
    ];

    return (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
            <header>
                <h1 className="text-2xl font-bold tracking-tight">Заявки на обучение</h1>
                <p className="text-muted-foreground mt-1">Управление входящими заявками от потенциальных клиентов.</p>
            </header>

            <div className="bg-card border rounded-lg p-4 space-y-4">
                <div className="flex flex-col sm:flex-row gap-4">
                    <div className="relative flex-1">
                        <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                        <input type="text" placeholder="Поиск по имени, телефону..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 bg-input border rounded-md"
                        />
                    </div>
                    <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="w-full sm:w-auto px-3 py-2 bg-input border rounded-md text-sm"
                    >
                        {statusOptions.map(opt => <option key={opt.key} value={opt.key}>{opt.label}</option>)}
                    </select>
                </div>
                
                <DataTable
                    columns={columns}
                    data={applications}
                    isLoading={isLoading}
                    // Убираем действия, так как они теперь внутри колонки статуса
                    onEdit={() => {}} 
                    onDelete={() => {}}
                    hideActionsColumn={true}
                />
            </div>
        </motion.div>
    );
};

export default AdminRequestsPage;