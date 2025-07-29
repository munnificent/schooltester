import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  title: string;
}

export const Modal: React.FC<ModalProps> = ({ isOpen, onClose, children, title }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="relative bg-card rounded-xl shadow-2xl w-full max-w-lg"
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-title"
          >
            {/* Overlay to prevent clicks behind modal */}
            <div className="fixed inset-0" onClick={onClose}></div>

            <div className="relative z-10">
                 <header className="flex items-center justify-between p-4 border-b">
                    <h3 id="modal-title" className="text-lg font-semibold">{title}</h3>
                    <button onClick={onClose} className="p-1 rounded-full hover:bg-muted text-muted-foreground hover:text-foreground">
                        <X size={20} />
                    </button>
                </header>
                {children}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};