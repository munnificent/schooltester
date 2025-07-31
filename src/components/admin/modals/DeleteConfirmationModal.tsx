// src/components/admin/modals/DeleteConfirmationModal.tsx
import React from 'react';
import { Button } from '../../ui/button';
import { Modal } from './Modal';
import { AlertTriangle, Trash2, Loader2 } from 'lucide-react';

interface DeleteConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  itemName: string;
  isDeleting: boolean;
}

export const DeleteConfirmationModal: React.FC<DeleteConfirmationModalProps> = ({ isOpen, onClose, onConfirm, itemName, isDeleting }) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Подтвердите удаление">
      <div className="p-6">
        <div className="flex items-start gap-4">
          <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-destructive/10 sm:mx-0 sm:h-10 sm:w-10">
            <AlertTriangle className="h-6 w-6 text-destructive" aria-hidden="true" />
          </div>
          <div className="mt-0 text-left">
            <p className="text-foreground">
              Вы уверены, что хотите удалить <strong>{itemName}</strong>?
            </p>
            <p className="mt-1 text-sm text-muted-foreground">
              Это действие невозможно отменить. Все связанные данные будут безвозвратно удалены.
            </p>
          </div>
        </div>
      </div>
      <footer className="flex flex-row-reverse gap-3 p-4 bg-muted/50 border-t">
        <Button
          variant="destructive"
          onClick={onConfirm}
          disabled={isDeleting}
        >
          {isDeleting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
          Удалить
        </Button>
        <Button
          variant="outline"
          onClick={onClose}
          disabled={isDeleting}
        >
          Отмена
        </Button>
      </footer>
    </Modal>
  );
};