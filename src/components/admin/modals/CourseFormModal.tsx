import React, { useState, useEffect } from 'react';
import { useForm, Controller, SubmitHandler } from 'react-hook-form';
import toast from 'react-hot-toast';
import { Save, Loader2 } from 'lucide-react';

import apiClient from '../../../api/apiClient';
import { Course, User, PaginatedResponse } from '../../../types';
import { Modal } from './Modal';

// --- Типы и интерфейсы ---
interface CourseFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  currentCourse?: Course | null;
}

type CourseFormInputs = {
  title: string;
  description: string;
  subject: string;
  price: number;
  teacherId: string; // В форме используем строку для ID
};

// --- Основной компонент модального окна ---
export const CourseFormModal: React.FC<CourseFormModalProps> = ({ isOpen, onClose, onSuccess, currentCourse }) => {
  const [teachers, setTeachers] = useState<User[]>([]);
  const [isLoadingTeachers, setIsLoadingTeachers] = useState(false);

  const { control, handleSubmit, reset, formState: { isSubmitting, errors } } = useForm<CourseFormInputs>();

  // Загрузка списка преподавателей при открытии модального окна
  useEffect(() => {
    if (!isOpen) return;

    const fetchTeachers = async () => {
      setIsLoadingTeachers(true);
      try {
        const response = await apiClient.get<PaginatedResponse<User>>('/users/', { params: { role: 'teacher' } });
        setTeachers(response.data.results);
      } catch (error) {
        toast.error('Не удалось загрузить список преподавателей.');
      } finally {
        setIsLoadingTeachers(false);
      }
    };

    fetchTeachers();
  }, [isOpen]);

  // Заполнение формы данными при редактировании курса
  useEffect(() => {
    if (isOpen) {
      if (currentCourse) {
        reset({
          title: currentCourse.title,
          description: currentCourse.description,
          subject: currentCourse.subject,
          price: Number(currentCourse.price),
          teacherId: String(currentCourse.teacher?.id || ''),
        });
      } else {
        reset({ title: '', description: '', subject: '', price: 0, teacherId: '' });
      }
    }
  }, [currentCourse, isOpen, reset]);


  const onSubmit: SubmitHandler<CourseFormInputs> = async (data) => {
    const payload = {
        ...data,
        teacher: data.teacherId ? Number(data.teacherId) : null, // Преобразуем ID преподавателя
    };
    delete (payload as any).teacherId;

    const toastId = toast.loading(currentCourse ? 'Обновление курса...' : 'Создание курса...');

    try {
      if (currentCourse) {
        await apiClient.patch(`/courses/${currentCourse.id}/`, payload);
      } else {
        await apiClient.post('/courses/', payload);
      }
      toast.success(currentCourse ? 'Курс успешно обновлен!' : 'Курс успешно создан!', { id: toastId });
      onSuccess();
      onClose();
    } catch (error: any) {
        const errorMsg = error.response?.data?.detail || "Не удалось сохранить курс.";
        toast.error(errorMsg, { id: toastId });
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={currentCourse ? "Редактировать курс" : "Добавить новый курс"}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="p-6 space-y-4">
          <FormInput name="title" label="Название курса" control={control} error={errors.title} rules={{ required: 'Это поле обязательно' }} />
          <FormTextarea name="description" label="Описание" control={control} />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormInput name="subject" label="Предмет" control={control} error={errors.subject} rules={{ required: 'Это поле обязательно' }}/>
            <FormInput name="price" label="Цена (тг)" type="number" control={control} error={errors.price} rules={{ required: 'Это поле обязательно', min: { value: 0, message: 'Цена не может быть отрицательной' } }}/>
          </div>
          <FormSelect name="teacherId" label="Преподаватель" control={control} error={errors.teacherId} isLoading={isLoadingTeachers}>
            <option value="">Не назначен</option>
            {teachers.map(t => <option key={t.id} value={t.id}>{t.firstName} {t.lastName}</option>)}
          </FormSelect>
        </div>
        <footer className="flex justify-end gap-3 p-4 bg-muted/50 border-t">
          <button type="button" onClick={onClose} className="px-4 py-2 text-sm font-medium rounded-md hover:bg-muted">Отмена</button>
          <button type="submit" disabled={isSubmitting} className="inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50">
            {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin"/> : <Save className="h-4 w-4"/>}
            {currentCourse ? "Сохранить" : "Создать"}
          </button>
        </footer>
      </form>
    </Modal>
  );
};


// --- Переиспользуемые компоненты форм ---
const FormInput = ({ name, label, control, error, rules = {}, type = "text" }) => (
    <div>
        <label htmlFor={name} className="block text-sm font-medium text-foreground mb-1">{label}</label>
        <Controller name={name} control={control} rules={rules} render={({ field }) => (
            <input {...field} id={name} type={type} className={`block w-full px-3 py-2 bg-input border rounded-md focus:outline-none focus:ring-primary focus:border-primary ${error ? 'border-destructive' : 'border-border'}`} />
        )}/>
        {error && <p className="text-xs text-destructive mt-1">{error.message}</p>}
    </div>
);

const FormTextarea = ({ name, label, control }) => (
     <div>
        <label htmlFor={name} className="block text-sm font-medium text-foreground mb-1">{label}</label>
        <Controller name={name} control={control} render={({ field }) => (
            <textarea {...field} id={name} rows={4} className="block w-full px-3 py-2 bg-input border border-border rounded-md focus:outline-none focus:ring-primary focus:border-primary" />
        )}/>
    </div>
);

const FormSelect = ({ name, label, control, error, children, isLoading = false }) => (
    <div>
        <label htmlFor={name} className="block text-sm font-medium text-foreground mb-1">{label}</label>
        <Controller name={name} control={control} render={({ field }) => (
            <select {...field} id={name} disabled={isLoading} className={`block w-full px-3 py-2 bg-input border rounded-md focus:outline-none focus:ring-primary focus:border-primary ${error ? 'border-destructive' : 'border-border'}`}>
                {isLoading ? <option>Загрузка...</option> : children}
            </select>
        )}/>
        {error && <p className="text-xs text-destructive mt-1">{error.message}</p>}
    </div>
);