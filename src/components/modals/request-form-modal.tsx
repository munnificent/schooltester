import React from 'react';
import { useForm, Controller, SubmitHandler } from 'react-hook-form';
import toast from 'react-hot-toast';
import { Send, MessageCircle, Loader2 } from 'lucide-react';

import apiClient from '../../api/apiClient';
import { Modal } from '../admin/modals/Modal'; // Импортируем нашу кастомную модалку

// --- Типы и Конфигурация ---
interface RequestFormInputs {
  name: string;
  phone: string;
  studentClass: string;
  subject?: string;
  comment?: string;
}

const WHATSAPP_CONFIG = {
  PHONE: '77771234567', // TODO: Заменить на реальный номер
  MESSAGE: 'Здравствуйте! Я хотел(а) бы узнать подробнее о курсах Munificent School.',
};

const classOptions = ['5 класс', '6 класс', '7 класс', '8 класс', '9 класс', '10 класс', '11 класс'];
const subjectOptions = ['Математика', 'Физика', 'Химия', 'Биология', 'История Казахстана', 'Другое'];


// --- Основной компонент модального окна ---
export const RequestFormModal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
    const { register, control, handleSubmit, reset, formState: { isSubmitting, errors, isValid } } = useForm<RequestFormInputs>({
        mode: 'onChange' // Включаем валидацию при изменении
    });

    const handleWhatsAppContact = () => {
        const link = `https://wa.me/${WHATSAPP_CONFIG.PHONE}?text=${encodeURIComponent(WHATSAPP_CONFIG.MESSAGE)}`;
        window.open(link, '_blank');
    };

    const onSubmit: SubmitHandler<RequestFormInputs> = async (data) => {
        const toastId = toast.loading('Отправка заявки...');
        try {
            await apiClient.post('/applications/', data);
            toast.success('Заявка успешно отправлена!', { id: toastId });
            reset();
            onClose();
        } catch (error) {
            toast.error('Не удалось отправить заявку.', { id: toastId });
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Оставить заявку на консультацию">
            <form onSubmit={handleSubmit(onSubmit)}>
                <div className="p-6 space-y-4">
                    <FormInput name="name" label="Ваше имя" register={register} error={errors.name} rules={{ required: 'Это поле обязательно' }} />
                    <FormInput name="phone" label="Номер телефона" type="tel" register={register} error={errors.phone} rules={{ required: 'Это поле обязательно' }} />
                    <FormSelect name="studentClass" label="Класс ученика" control={control} error={errors.studentClass} rules={{ required: 'Выберите класс' }}>
                        <option value="" disabled>Выберите класс</option>
                        {classOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                    </FormSelect>
                     <FormSelect
                        name="subject"
                        label="Интересующий предмет (опционально)"
                        control={control}
                        error={errors.subject}
                                >
                     <option value="">Любой предмет</option>
                        {subjectOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                    </FormSelect>

                    <button type="button" onClick={handleWhatsAppContact} className="w-full mt-2 inline-flex items-center justify-center gap-2 rounded-md bg-emerald-500 px-4 py-2.5 text-sm font-medium text-white shadow-sm transition-colors hover:bg-emerald-600">
                        <MessageCircle size={18} />
                        Связаться через WhatsApp
                    </button>
                </div>
                <footer className="flex justify-end gap-3 p-4 bg-muted/50 border-t">
                    <button type="button" onClick={onClose} className="px-4 py-2 text-sm font-medium rounded-md hover:bg-muted">Отмена</button>
                    <button type="submit" disabled={isSubmitting || !isValid} className="inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50">
                        {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin"/> : <Send className="h-4 w-4"/>}
                        Отправить заявку
                    </button>
                </footer>
            </form>
        </Modal>
    );
};


// --- Переиспользуемые компоненты форм ---
const FormInput = ({ name, label, register, error, rules = {}, type = "text" }) => (
    <div>
        <label htmlFor={name} className="block text-sm font-medium text-foreground mb-1">{label}</label>
        <input {...register(name, rules)} id={name} type={type} className={`block w-full px-3 py-2 bg-input border rounded-md focus:outline-none focus:ring-primary focus:border-primary ${error ? 'border-destructive' : 'border-border'}`} />
        {error && <p className="text-xs text-destructive mt-1">{error.message}</p>}
    </div>
);

const FormSelect = ({ name, label, control, error, children, rules = {} }) => (
    <div>
        <label htmlFor={name} className="block text-sm font-medium text-foreground mb-1">{label}</label>
        <Controller name={name} control={control} rules={rules} defaultValue="" render={({ field }) => (
            <select {...field} id={name} className={`block w-full px-3 py-2 bg-input border rounded-md focus:outline-none focus:ring-primary focus:border-primary ${error ? 'border-destructive' : 'border-border'}`}>
                {children}
            </select>
        )} />
        {error && <p className="text-xs text-destructive mt-1">{error.message}</p>}
    </div>
);