import React, { useState, useEffect, useCallback } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import toast from 'react-hot-toast';
import { Plus, Edit, Trash2, Save, Loader2 } from 'lucide-react';

import apiClient from '../../../api/apiClient';
import { Course, Lesson } from '../../../types';
import { Modal } from './Modal';
import { DeleteConfirmationModal } from './DeleteConfirmationModal';

// --- Types and Interfaces ---
interface LessonManagementModalProps {
  isOpen: boolean;
  onClose: () => void;
  course: Course | null;
}

type LessonFormInputs = {
  title: string;
  content: string;
  // TODO: Add other fields like date, homeworkUrl, etc. if needed
};

// --- Child Components ---

const LessonForm: React.FC<{
  currentLesson: Lesson | null;
  onSave: (data: LessonFormInputs) => Promise<void>;
  onCancel: () => void;
  isSaving: boolean;
}> = ({ currentLesson, onSave, onCancel, isSaving }) => {
  const { register, handleSubmit, reset, formState: { errors, isDirty } } = useForm<LessonFormInputs>();

  useEffect(() => {
    if (currentLesson) {
      reset({ title: currentLesson.title, content: currentLesson.content });
    } else {
      reset({ title: '', content: '' });
    }
  }, [currentLesson, reset]);

  return (
    <form onSubmit={handleSubmit(onSave)} className="p-5 bg-muted/50 border rounded-lg h-full flex flex-col">
      <h3 className="text-base font-semibold mb-4">
        {currentLesson ? 'Редактировать урок' : 'Добавить новый урок'}
      </h3>
      <div className="space-y-4 flex-grow">
        <div>
          <label htmlFor="title" className="text-sm font-medium">Название урока</label>
          <input {...register('title', { required: 'Название обязательно' })} id="title" className="mt-1 w-full input" />
          {errors.title && <p className="text-xs text-destructive mt-1">{errors.title.message}</p>}
        </div>
        <div>
          <label htmlFor="content" className="text-sm font-medium">Содержание (ссылки, текст)</label>
          <textarea {...register('content')} id="content" rows={5} className="mt-1 w-full input" />
        </div>
      </div>
      <div className="flex gap-2 mt-4">
        <button type="submit" disabled={isSaving || !isDirty} className="btn-primary flex-1">
          {isSaving ? <Loader2 className="h-4 w-4 animate-spin"/> : <Save className="h-4 w-4"/>}
          {currentLesson ? 'Сохранить' : 'Добавить'}
        </button>
        {currentLesson && (
          <button type="button" onClick={onCancel} className="btn-outline">Отмена</button>
        )}
      </div>
    </form>
  );
};

const LessonList: React.FC<{
  lessons: Lesson[];
  isLoading: boolean;
  onEdit: (lesson: Lesson) => void;
  onDelete: (lesson: Lesson) => void;
}> = ({ lessons, isLoading, onEdit, onDelete }) => {
  if (isLoading) {
    return <div className="space-y-2 animate-pulse">
        {Array.from({ length: 4 }).map((_, i) => <div key={i} className="h-12 bg-muted rounded-md" />)}
    </div>
  }

  if (lessons.length === 0) {
    return <div className="text-center py-10 text-muted-foreground">Уроков пока нет.</div>
  }

  return (
    <ul className="space-y-2">
      {lessons.map(lesson => (
        <li key={lesson.id} className="flex items-center justify-between p-3 rounded-md bg-muted/50">
          <span className="font-medium text-sm">{lesson.title}</span>
          <div className="flex gap-2">
            <button onClick={() => onEdit(lesson)} className="p-1.5 hover:text-primary"><Edit size={16} /></button>
            <button onClick={() => onDelete(lesson)} className="p-1.5 hover:text-destructive"><Trash2 size={16} /></button>
          </div>
        </li>
      ))}
    </ul>
  );
}


// --- Main Modal Component ---
export const LessonManagementModal: React.FC<LessonManagementModalProps> = ({ isOpen, onClose, course }) => {
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [currentLesson, setCurrentLesson] = useState<Lesson | null>(null);
  const [lessonToDelete, setLessonToDelete] = useState<Lesson | null>(null);

  const fetchLessons = useCallback(async () => {
    if (!course) return;
    setIsLoading(true);
    try {
      const response = await apiClient.get<Lesson[]>(`/courses/${course.id}/lessons/`);
      setLessons(response.data);
    } catch (error) {
      toast.error("Не удалось загрузить уроки.");
    } finally {
      setIsLoading(false);
    }
  }, [course]);

  useEffect(() => {
    if (isOpen) {
      fetchLessons();
    } else {
        setCurrentLesson(null); // Reset form when modal closes
    }
  }, [isOpen, fetchLessons]);

  const handleSave = async (data: LessonFormInputs) => {
    if (!course) return;
    setIsSaving(true);
    const toastId = toast.loading(currentLesson ? 'Обновление урока...' : 'Создание урока...');

    const url = currentLesson
      ? `/courses/${course.id}/lessons/${currentLesson.id}/`
      : `/courses/${course.id}/lessons/`;
    const method = currentLesson ? 'patch' : 'post';

    try {
      await apiClient[method](url, data);
      toast.success(currentLesson ? 'Урок обновлен!' : 'Урок создан!', { id: toastId });
      setCurrentLesson(null); // Reset form
      fetchLessons(); // Refresh list
    } catch (error) {
      toast.error('Не удалось сохранить урок.', { id: toastId });
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!course || !lessonToDelete) return;
    const toastId = toast.loading('Удаление урока...');
    try {
        await apiClient.delete(`/courses/${course.id}/lessons/${lessonToDelete.id}/`);
        toast.success('Урок удален!', { id: toastId });
        setLessonToDelete(null); // Close confirmation modal
        fetchLessons(); // Refresh list
    } catch (error) {
        toast.error('Не удалось удалить урок.', { id: toastId });
    }
  };

  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose} title={`Уроки курса: ${course?.title}`}>
        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6 max-h-[70vh] overflow-y-auto">
            <LessonForm
                currentLesson={currentLesson}
                onSave={handleSave}
                onCancel={() => setCurrentLesson(null)}
                isSaving={isSaving}
            />
            <div className="h-full">
                 <h3 className="text-base font-semibold mb-4">Список уроков</h3>
                <LessonList
                    lessons={lessons}
                    isLoading={isLoading}
                    onEdit={setCurrentLesson}
                    onDelete={setLessonToDelete}
                />
            </div>
        </div>
        <footer className="flex justify-end p-4 bg-muted/50 border-t">
          <button type="button" onClick={onClose} className="px-4 py-2 text-sm font-medium rounded-md hover:bg-muted">Закрыть</button>
        </footer>
      </Modal>

      <DeleteConfirmationModal
        isOpen={!!lessonToDelete}
        onClose={() => setLessonToDelete(null)}
        onConfirm={handleDelete}
        itemName={lessonToDelete?.title || ''}
        isDeleting={false} // Loading state is handled by toast
      />
    </>
  );
};