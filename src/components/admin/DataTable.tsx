import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MoreHorizontal } from 'lucide-react';

// --- ОБЩИЕ ТИПЫ ДЛЯ КОМПОНЕНТА ТАБЛИЦЫ ---

/**
 * Определяет, как будет выглядеть колонка в таблице.
 */
export interface ColumnDef<T> {
  header: string;
  accessorKey: keyof T | string; // Ключ для доступа к данным (может быть вложенным, например 'profile.phone')
  cell?: (row: T) => React.ReactNode; // Функция для кастомного рендеринга ячейки
}

/**
 * Определяет действие в выпадающем меню для каждой строки.
 */
export interface ActionItem<T> {
  label: string;
  handler: (item: T) => void;
  isDestructive?: boolean; // Помечает действие как "опасное" (например, удаление)
}

/**
 * Пропсы для основного компонента DataTable.
 */
interface DataTableProps<T extends { id: React.Key }> {
  columns: ColumnDef<T>[];
  data: T[];
  isLoading: boolean;
  actions?: ActionItem<T>[]; // Массив действий для каждой строки
  hideActionsColumn?: boolean; // Флаг для скрытия колонки действий
}

// --- ВСПОМОГАТЕЛЬНЫЕ КОМПОНЕНТЫ ДЛЯ ТАБЛИЦЫ ---

/**
 * Компонент для отображения статуса "Активен" / "Неактивен".
 * Мы экспортируем его, чтобы использовать в других файлах (например, admin-users).
 */
export const StatusIndicator: React.FC<{ isActive: boolean }> = ({ isActive }) => (
    <div className="flex items-center gap-2">
        <span className={`h-2 w-2 rounded-full ${isActive ? 'bg-emerald-500' : 'bg-gray-400'}`}></span>
        <span className="text-sm">{isActive ? 'Активен' : 'Неактивен'}</span>
    </div>
);


// --- ОСНОВНОЙ КОМПОНЕНТ ТАБЛИЦЫ ---

export const DataTable = <T extends { id: React.Key }>({
  columns,
  data,
  isLoading,
  actions = [],
  hideActionsColumn = false,
}: DataTableProps<T>) => {
  const [openMenuId, setOpenMenuId] = useState<React.Key | null>(null);

  // Скелетон для состояния загрузки
  if (isLoading) {
    return (
      <div className="space-y-2 animate-pulse">
        {/* Создаем фейковые строки для скелетона */}
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="h-16 bg-muted rounded-md" />
        ))}
      </div>
    );
  }

  // Сообщение, если данных нет
  if (data.length === 0) {
    return (
        <div className="text-center py-16 bg-muted/50 rounded-md">
            <p className="font-medium text-foreground">Данные не найдены</p>
            <p className="text-sm text-muted-foreground mt-1">Попробуйте изменить фильтры или поисковый запрос.</p>
        </div>
    );
  }

  return (
    <div className="overflow-x-auto border rounded-lg">
      <table className="min-w-full divide-y divide-border">
        <thead className="bg-muted/50">
          <tr>
            {columns.map(col => (
              <th key={String(col.accessorKey)} className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                {col.header}
              </th>
            ))}
            {!hideActionsColumn && (
              <th className="relative px-6 py-3">
                <span className="sr-only">Действия</span>
              </th>
            )}
          </tr>
        </thead>
        <tbody className="bg-card divide-y divide-border">
          {data.map((item) => (
            <tr key={item.id} className="hover:bg-muted/50 transition-colors">
              {columns.map(col => (
                <td key={String(col.accessorKey)} className="px-6 py-4 whitespace-nowrap text-sm text-foreground">
                  {col.cell ? col.cell(item) : String((item as any)[col.accessorKey] || '')}
                </td>
              ))}
              {!hideActionsColumn && (
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div className="relative inline-block text-left">
                    <button onClick={() => setOpenMenuId(openMenuId === item.id ? null : item.id)} className="p-1.5 rounded-md hover:bg-muted">
                      <MoreHorizontal size={18} />
                    </button>
                    <AnimatePresence>
                      {openMenuId === item.id && (
                        <motion.div
                          initial={{ opacity: 0, scale: 0.95 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.95 }}
                          transition={{ duration: 0.1 }}
                          className="absolute right-0 z-10 w-48 mt-2 origin-top-right bg-card border rounded-md shadow-lg"
                        >
                          <div className="py-1" role="menu" aria-orientation="vertical">
                            {actions.map(action => (
                              <button
                                key={action.label}
                                onClick={() => {
                                  action.handler(item);
                                  setOpenMenuId(null);
                                }}
                                className={`w-full text-left block px-4 py-2 text-sm ${action.isDestructive ? 'text-destructive' : 'text-foreground'} hover:bg-muted`}
                                role="menuitem"
                              >
                                {action.label}
                              </button>
                            ))}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};