import React, { useEffect } from 'react';
import { useForm, Controller, SubmitHandler } from 'react-hook-form';
import toast from 'react-hot-toast';
import { Save, Loader2 } from 'lucide-react';

import apiClient from '../../../api/apiClient';
import { User, UserRole } from '../../../types';
import { Modal } from './Modal';

// --- Types and Interfaces ---
interface UserFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  currentUser?: User | null;
  defaultRole?: UserRole; // To pre-select a role, e.g., 'student'
}

type UserFormInputs = {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  role: UserRole;
  password?: string;
};

// --- Main Modal Component ---
export const UserFormModal: React.FC<UserFormModalProps> = ({ isOpen, onClose, onSuccess, currentUser, defaultRole }) => {
  const {
    control,
    handleSubmit,
    reset,
    formState: { isSubmitting, errors, isDirty },
  } = useForm<UserFormInputs>({
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      role: defaultRole || 'student',
      password: '',
    }
  });

  // Fill form with data when editing an existing user
  useEffect(() => {
    if (isOpen) {
      if (currentUser) {
        reset({
          firstName: currentUser.firstName,
          lastName: currentUser.lastName,
          email: currentUser.email,
          phone: currentUser.profile?.phone || '',
          role: currentUser.role,
        });
      } else {
        // Reset to default for creating a new user
        reset({
          firstName: '',
          lastName: '',
          email: '',
          phone: '',
          role: defaultRole || 'student',
          password: '',
        });
      }
    }
  }, [currentUser, isOpen, reset, defaultRole]);

  const onSubmit: SubmitHandler<UserFormInputs> = async (data) => {
    // Separate profile data from main user data
    const { phone, ...userData } = data;
    const payload = {
      ...userData,
      profile: { phone },
    };
    
    // Remove password from payload if it's empty (for updates)
    if (!payload.password) {
        delete payload.password;
    }

    const toastId = toast.loading(currentUser ? 'Обновление данных...' : 'Создание пользователя...');

    try {
      if (currentUser) {
        await apiClient.patch(`/users/${currentUser.id}/`, payload);
      } else {
        await apiClient.post('/users/', payload);
      }
      toast.success(currentUser ? 'Пользователь успешно обновлен!' : 'Пользователь успешно создан!', { id: toastId });
      onSuccess();
      onClose();
    } catch (error: any) {
      const errorData = error.response?.data;
      // Concatenate all error messages from the server
      const errorMsg = errorData ? Object.values(errorData).flat().join(' ') : "Не удалось сохранить пользователя.";
      toast.error(errorMsg, { id: toastId });
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={currentUser ? 'Редактировать пользователя' : 'Добавить нового пользователя'}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="p-6 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormInput name="firstName" label="Имя" control={control} error={errors.firstName} rules={{ required: 'Это поле обязательно' }} />
            <FormInput name="lastName" label="Фамилия" control={control} error={errors.lastName} rules={{ required: 'Это поле обязательно' }} />
          </div>
          <FormInput name="email" label="Email" type="email" control={control} error={errors.email} rules={{ required: 'Это поле обязательно', pattern: { value: /^\S+@\S+$/i, message: 'Неверный формат email' } }} />
          
          {/* Show password field only when creating a new user */}
          {!currentUser && (
             <FormInput name="password" label="Пароль" type="password" control={control} error={errors.password} rules={{ required: 'Пароль обязателен', minLength: { value: 8, message: 'Минимум 8 символов' } }} />
          )}

          <FormInput name="phone" label="Телефон" type="tel" control={control} />
          <FormSelect name="role" label="Роль" control={control} error={errors.role} rules={{ required: 'Это поле обязательно' }}>
            <option value="student">Ученик</option>
            <option value="teacher">Преподаватель</option>
            <option value="admin">Администратор</option>
          </FormSelect>
        </div>
        <footer className="flex justify-end gap-3 p-4 bg-muted/50 border-t">
          <button type="button" onClick={onClose} className="px-4 py-2 text-sm font-medium rounded-md hover:bg-muted">Отмена</button>
          <button type="submit" disabled={isSubmitting || !isDirty} className="inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50">
            {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
            {currentUser ? 'Сохранить' : 'Создать'}
          </button>
        </footer>
      </form>
    </Modal>
  );
};

// --- Reusable Form Field Components ---
const FormInput = ({ name, label, control, error, rules = {}, type = "text" }) => (
    <div>
        <label htmlFor={name} className="block text-sm font-medium text-foreground mb-1">{label}</label>
        <Controller name={name} control={control} rules={rules} render={({ field }) => (
            <input {...field} id={name} type={type} className={`block w-full px-3 py-2 bg-input border rounded-md focus:outline-none focus:ring-primary focus:border-primary ${error ? 'border-destructive' : 'border-border'}`} />
        )} />
        {error && <p className="text-xs text-destructive mt-1">{error.message}</p>}
    </div>
);

const FormSelect = ({ name, label, control, error, children, rules = {} }) => (
    <div>
        <label htmlFor={name} className="block text-sm font-medium text-foreground mb-1">{label}</label>
        <Controller name={name} control={control} rules={rules} render={({ field }) => (
            <select {...field} id={name} className={`block w-full px-3 py-2 bg-input border rounded-md focus:outline-none focus:ring-primary focus:border-primary ${error ? 'border-destructive' : 'border-border'}`}>
                {children}
            </select>
        )} />
        {error && <p className="text-xs text-destructive mt-1">{error.message}</p>}
    </div>
);