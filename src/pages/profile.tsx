import React, { useContext, useState, useRef } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { User, Mail, Phone, Building, GraduationCap, Edit, KeyRound, Loader2, Save, X } from 'lucide-react';

import { AuthContext } from '../contexts/auth-context';
import { User as UserType } from '../types'; // Импортируем наш основной тип
import apiClient from'../api/apiClient'; // TODO: Убедиться, что apiClient настроен

// --- Типы для форм ---
type ProfileFormInputs = {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  school?: string;
  studentClass?: string;
  parentName?: string;
  parentPhone?: string;
};

type PasswordFormInputs = {
  oldPassword: string;
  newPassword: string;
  newPasswordConfirm: string;
};

// --- Основной компонент ---
const ProfilePage: React.FC = () => {
  const { user, isLoading: isAuthLoading, refetchUser } = useContext(AuthContext);
  const [activeTab, setActiveTab] = useState<'personal' | 'security'>('personal');

  if (isAuthLoading || !user) {
    return (
      <div className="flex justify-center items-center h-96">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
      <header className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Профиль</h1>
        <p className="text-muted-foreground mt-1">Управляйте вашей учетной записью и настройками</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <UserProfileCard user={user} onAvatarChange={refetchUser} />
        
        <div className="lg:col-span-2">
          <div className="bg-card text-card-foreground rounded-xl border shadow-sm">
            <div className="border-b">
              <nav className="flex gap-4 p-2">
                <button 
                  onClick={() => setActiveTab('personal')} 
                  className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${activeTab === 'personal' ? 'bg-primary/10 text-primary' : 'hover:bg-muted/50'}`}
                >
                  Личные данные
                </button>
                <button 
                  onClick={() => setActiveTab('security')} 
                  className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${activeTab === 'security' ? 'bg-primary/10 text-primary' : 'hover:bg-muted/50'}`}
                >
                  Безопасность
                </button>
              </nav>
            </div>
            
            <div className="p-6">
              {activeTab === 'personal' && <PersonalDataForm currentUser={user} onUpdate={refetchUser} />}
              {activeTab === 'security' && <SecurityForm />}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};


// --- Компоненты-секции ---

const UserProfileCard: React.FC<{ user: UserType, onAvatarChange: () => void }> = ({ user, onAvatarChange }) => {
  const avatarInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleAvatarClick = () => avatarInputRef.current?.click();

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('avatar', file);
    setIsUploading(true);
    const toastId = toast.loading('Загрузка аватара...');

    try {
      await apiClient.post('/users/me/upload-avatar/', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      toast.success('Аватар успешно обновлен!', { id: toastId });
      onAvatarChange();
    } catch (error) {
      toast.error('Ошибка при загрузке аватара.', { id: toastId });
    } finally {
      setIsUploading(false);
    }
  };

  const infoItems = [
    { icon: Mail, value: user.email },
    { icon: Phone, value: user.profile?.phone || 'Не указан' },
    { icon: Building, value: user.profile?.school || 'Не указана' },
    { icon: GraduationCap, value: user.profile?.studentClass || 'Не указан' },
  ];

  return (
    <div className="bg-card text-card-foreground rounded-xl border shadow-sm p-6 flex flex-col items-center text-center">
      <div className="relative">
        <img
            src={user.avatar || `https://ui-avatars.com/api/?name=${user.firstName}+${user.lastName}&background=random`}
            alt="Avatar"
            className="w-24 h-24 rounded-full object-cover mb-4 border-2 border-primary"
        />
        <button onClick={handleAvatarClick} disabled={isUploading} className="absolute bottom-4 -right-1 bg-primary text-primary-foreground p-1.5 rounded-full hover:bg-primary/90 transition-transform hover:scale-110">
          {isUploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Edit className="h-4 w-4"/>}
        </button>
        <input type="file" ref={avatarInputRef} onChange={handleFileChange} accept="image/*" className="hidden" />
      </div>

      <h2 className="text-xl font-semibold">{user.firstName} {user.lastName}</h2>
      <p className="text-muted-foreground mt-1">ID: MS-2023-{user.id}</p>
      <hr className="w-full my-4 border-border" />
      <div className="w-full space-y-2 text-left">
        {infoItems.map((item, index) => (
          <div key={index} className="flex items-center gap-3 text-sm">
            <item.icon className="w-4 h-4 text-muted-foreground" />
            <span className="text-foreground truncate">{item.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

const PersonalDataForm: React.FC<{ currentUser: UserType, onUpdate: () => void }> = ({ currentUser, onUpdate }) => {
  const [isEditing, setIsEditing] = useState(false);
  const { register, handleSubmit, reset, formState: { isSubmitting, errors } } = useForm<ProfileFormInputs>({
    defaultValues: {
      firstName: currentUser.firstName,
      lastName: currentUser.lastName,
      email: currentUser.email,
      phone: currentUser.profile?.phone || '',
      school: currentUser.profile?.school || '',
      studentClass: currentUser.profile?.studentClass || '',
      parentName: currentUser.profile?.parentName || '',
      parentPhone: currentUser.profile?.parentPhone || '',
    },
  });

  const onSubmit: SubmitHandler<ProfileFormInputs> = async (data) => {
    const { firstName, lastName, email, ...profileData } = data;
    const payload = { firstName, lastName, email, profile: profileData };

    const toastId = toast.loading('Сохранение профиля...');
    try {
      await apiClient.patch('/users/me/', payload);
      toast.success('Профиль успешно обновлен!', { id: toastId });
      await onUpdate();
      setIsEditing(false);
    } catch (error: any) {
        const errorMsg = error.response?.data?.detail || "Не удалось сохранить профиль.";
        toast.error(errorMsg, { id: toastId });
    }
  };
  
  const handleCancel = () => {
    reset(); // Сбрасываем форму к исходным значениям
    setIsEditing(false);
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <header className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-semibold">Личные данные</h3>
        <div className="flex gap-2">
            {isEditing ? (
                <>
                    <button type="button" onClick={handleCancel} className="inline-flex items-center justify-center gap-1 rounded-md px-3 py-1.5 text-sm font-medium hover:bg-muted/50">
                        <X className="h-4 w-4"/> Отмена
                    </button>
                    <button type="submit" disabled={isSubmitting} className="inline-flex items-center justify-center gap-1 rounded-md bg-primary px-3 py-1.5 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50">
                         {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin"/> : <Save className="h-4 w-4"/>} Сохранить
                    </button>
                </>
            ) : (
                <button type="button" onClick={() => setIsEditing(true)} className="inline-flex items-center justify-center gap-1 rounded-md bg-primary/10 px-3 py-1.5 text-sm font-medium text-primary hover:bg-primary/20">
                    <Edit className="h-4 w-4"/> Редактировать
                </button>
            )}
        </div>
      </header>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormInput id="firstName" label="Имя" register={register} readOnly={!isEditing} />
        <FormInput id="lastName" label="Фамилия" register={register} readOnly={!isEditing} />
        <FormInput id="email" label="Email" type="email" register={register} readOnly={!isEditing} />
        <FormInput id="phone" label="Телефон" type="tel" register={register} readOnly={!isEditing} />
        <FormInput id="school" label="Школа" register={register} readOnly={!isEditing} />
        <FormSelect id="studentClass" label="Класс" register={register} readOnly={!isEditing} options={['Не выбрано', '9 класс', '10 класс', '11 класс']} />
      </div>

      <hr className="w-full my-6 border-border" />
      
      <div>
        <h3 className="text-lg font-semibold mb-4">Информация о родителе/опекуне</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormInput id="parentName" label="ФИО родителя" register={register} readOnly={!isEditing} />
          <FormInput id="parentPhone" label="Телефон родителя" type="tel" register={register} readOnly={!isEditing} />
        </div>
      </div>
    </form>
  );
};

const SecurityForm = () => {
    const { register, handleSubmit, formState: { errors, isSubmitting }, reset } = useForm<PasswordFormInputs>();

    const onSubmit: SubmitHandler<PasswordFormInputs> = async (data) => {
        if (data.newPassword !== data.newPasswordConfirm) {
            toast.error("Новые пароли не совпадают.");
            return;
        }
        
        const toastId = toast.loading('Изменение пароля...');
        try {
            await apiClient.post('/users/change-password/', data);
            toast.success('Пароль успешно изменен!', { id: toastId });
            reset();
        } catch (error: any) {
            const errorMsg = Object.values(error.response?.data || {}).flat().join(' ') || "Не удалось изменить пароль.";
            toast.error(errorMsg, { id: toastId });
        }
    };
    
    return (
        <form onSubmit={handleSubmit(onSubmit)} className="max-w-md">
            <h3 className="text-lg font-semibold mb-6">Изменение пароля</h3>
            <div className="flex flex-col gap-4">
                <FormInput id="oldPassword" label="Текущий пароль" type="password" register={register} required />
                <FormInput id="newPassword" label="Новый пароль" type="password" register={register} required />
                <FormInput id="newPasswordConfirm" label="Подтверждение пароля" type="password" register={register} required />
                <div className="mt-2">
                    <button type="submit" disabled={isSubmitting} className="inline-flex items-center justify-center gap-1 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50">
                        {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin"/> : <KeyRound className="h-4 w-4"/>} Изменить пароль
                    </button>
                </div>
            </div>
        </form>
    );
}

// --- Переиспользуемые компоненты форм ---
const FormInput = ({ id, label, register, readOnly = false, type = 'text', required = false }) => (
    <div className="space-y-1">
        <label htmlFor={id} className="text-sm font-medium">{label}</label>
        <input 
            id={id}
            type={type}
            {...register(id, { required })}
            readOnly={readOnly}
            className="block w-full px-3 py-2 bg-input border border-border rounded-md shadow-sm placeholder-muted-foreground focus:outline-none focus:ring-primary focus:border-primary sm:text-sm disabled:bg-muted/50"
            disabled={readOnly}
        />
    </div>
);

const FormSelect = ({ id, label, register, readOnly = false, options, required = false }) => (
    <div className="space-y-1">
        <label htmlFor={id} className="text-sm font-medium">{label}</label>
        <select
            id={id}
            {...register(id, { required })}
            disabled={readOnly}
            className="block w-full px-3 py-2 bg-input border border-border rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm disabled:bg-muted/50"
        >
            {options.map(opt => <option key={opt} value={opt}>{opt}</option>)}
        </select>
    </div>
);


export default ProfilePage;