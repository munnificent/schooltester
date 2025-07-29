import React, { useEffect, useState } from 'react';
import { useForm, SubmitHandler, Controller } from 'react-hook-form';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { Save, Loader2, FileText, FileSpreadsheet, Download, Trash2, AlertTriangle } from 'lucide-react';

import apiClient from '../api/apiClient';
import { SystemSettings } from '../types';
// import { ConfirmationModal } from '../components/admin/modals/ConfirmationModal'; // TODO: Создать этот компонент

// --- Типы для формы (используем camelCase) ---
type SettingsFormInputs = {
  schoolName: string;
  address: string;
  phone: string;
  email: string;
  emailNotifications: boolean;
  smsNotifications: boolean;
  paymentReminders: boolean;
  classReminders: boolean;
  timezone: string;
  language: string;
  currency: string;
};

// --- Компоненты полей формы ---
const FormInput = ({ name, label, control, type = "text" }) => (
    <div>
        <label htmlFor={name} className="block text-sm font-medium text-foreground">{label}</label>
        <Controller
            name={name}
            control={control}
            render={({ field }) => (
                <input {...field} id={name} type={type} className="mt-1 block w-full px-3 py-2 bg-input border border-border rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"/>
            )}
        />
    </div>
);

const FormSwitch = ({ name, label, control }) => (
    <div className="flex items-center justify-between">
        <label htmlFor={name} className="text-sm font-medium text-foreground">{label}</label>
        <Controller
            name={name}
            control={control}
            render={({ field }) => (
                <button type="button" onClick={() => field.onChange(!field.value)} className={`${field.value ? 'bg-primary' : 'bg-muted'} relative inline-flex h-6 w-11 items-center rounded-full transition-colors`}>
                    <span className={`${field.value ? 'translate-x-6' : 'translate-x-1'} inline-block h-4 w-4 transform rounded-full bg-white transition-transform`}/>
                </button>
            )}
        />
    </div>
);

// --- Основной компонент страницы ---
const AdminSettingsPage: React.FC = () => {
    const [isLoading, setIsLoading] = useState(true);
    const { control, handleSubmit, reset, formState: { isSubmitting, isDirty } } = useForm<SettingsFormInputs>();

    useEffect(() => {
        const fetchSettings = async () => {
            setIsLoading(true);
            try {
                const response = await apiClient.get<SystemSettings>('/system-settings/1/');
                reset(response.data); // Заполняем форму данными с сервера
            } catch (error) {
                toast.error("Не удалось загрузить настройки");
            } finally {
                setIsLoading(false);
            }
        };
        fetchSettings();
    }, [reset]);

    const onSubmit: SubmitHandler<SettingsFormInputs> = async (data) => {
        const toastId = toast.loading("Сохранение настроек...");
        try {
            await apiClient.patch('/system-settings/1/', data);
            toast.success("Настройки успешно сохранены", { id: toastId });
            reset(data); // Обновляем "чистое" состояние формы
        } catch (error) {
            toast.error("Не удалось сохранить настройки", { id: toastId });
        }
    };

    if (isLoading) {
        return (
            <div className="animate-pulse space-y-6">
                <div className="h-10 w-1/3 bg-muted rounded-md"></div>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="h-64 bg-muted rounded-xl"></div>
                    <div className="h-64 bg-muted rounded-xl"></div>
                    <div className="h-64 bg-muted rounded-xl"></div>
                    <div className="h-64 bg-muted rounded-xl"></div>
                </div>
            </div>
        );
    }
  
    return (
        <motion.form onSubmit={handleSubmit(onSubmit)} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">Настройки системы</h1>
                    <p className="text-muted-foreground mt-1">Управление глобальными параметрами платформы.</p>
                </div>
                <button type="submit" disabled={!isDirty || isSubmitting} className="inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50">
                    {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                    Сохранить изменения
                </button>
            </header>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Общие настройки */}
                <div className="bg-card border rounded-lg p-6 space-y-4">
                    <h3 className="text-lg font-semibold">Общие настройки</h3>
                    <FormInput name="schoolName" label="Название школы" control={control} />
                    <FormInput name="address" label="Адрес" control={control} />
                    <FormInput name="phone" label="Телефон" control={control} />
                    <FormInput name="email" label="Email для связи" type="email" control={control} />
                </div>

                {/* Уведомления */}
                <div className="bg-card border rounded-lg p-6 space-y-4">
                    <h3 className="text-lg font-semibold">Уведомления</h3>
                    <FormSwitch name="emailNotifications" label="Email-уведомления" control={control} />
                    <FormSwitch name="smsNotifications" label="SMS-уведомления" control={control} />
                    <FormSwitch name="paymentReminders" label="Напоминания об оплате" control={control} />
                    <FormSwitch name="classReminders" label="Напоминания о занятиях" control={control} />
                </div>
                
                {/* Системные настройки */}
                <div className="bg-card border rounded-lg p-6 space-y-4">
                    <h3 className="text-lg font-semibold">Региональные стандарты</h3>
                     {/* TODO: Заменить на кастомный FormSelect */}
                    <p>Часовой пояс, Язык, Валюта...</p>
                </div>

                {/* Управление данными */}
                <div className="bg-card border rounded-lg p-6 space-y-4">
                    <h3 className="text-lg font-semibold">Управление данными</h3>
                    <div className="space-y-3">
                        <ButtonWithDescription title="Экспорт данных" description="Экспорт пользователей и курсов в CSV." icon={FileText} />
                        <ButtonWithDescription title="Резервное копирование" description="Создать полную резервную копию базы данных." icon={Download} />
                    </div>
                     <div className="mt-4 p-4 border border-destructive/50 bg-destructive/10 rounded-md">
                        <h4 className="font-semibold text-destructive flex items-center gap-2"><AlertTriangle size={18}/>Опасная зона</h4>
                        <p className="text-sm text-destructive/80 mt-1 mb-3">Это действие невозможно отменить. Будьте предельно осторожны.</p>
                        <button type="button" /* onClick={() => setIsConfirmOpen(true)} */ className="inline-flex items-center gap-2 rounded-md bg-destructive px-3 py-1.5 text-sm font-medium text-destructive-foreground hover:bg-destructive/90">
                           <Trash2 size={16}/> Очистить все данные
                        </button>
                    </div>
                </div>
            </div>
        </motion.form>
    );
};

const ButtonWithDescription = ({ title, description, icon: Icon }) => (
    <div className="flex items-center justify-between">
        <div>
            <h4 className="font-medium">{title}</h4>
            <p className="text-sm text-muted-foreground">{description}</p>
        </div>
        <button type="button" className="inline-flex items-center gap-2 rounded-md bg-muted px-3 py-1.5 text-sm font-medium text-foreground hover:bg-muted/80">
            <Icon size={16}/> Выполнить
        </button>
    </div>
);

export default AdminSettingsPage;