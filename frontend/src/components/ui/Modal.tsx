import type { FC, ReactNode } from 'react';
import { createPortal } from 'react-dom';

interface ModalProps {
  isOpen: boolean;
  onClose: (e?: React.MouseEvent) => void;
  onConfirm?: (e?: React.MouseEvent) => void;
  title: string;
  children: ReactNode;
}

const Modal: FC<ModalProps> = ({ isOpen, onClose, onConfirm, title, children }) => {
  if (!isOpen) return null;

  return createPortal(
    <div 
      className="fixed inset-0 bg-black/50 flex items-center justify-center"
      onClick={onClose}
    >
      <article 
        className="modal-content bg-neutral-500 rounded-lg p-6 max-w-sm w-full mx-4 space-y-6"
        onClick={(e) => e.stopPropagation()}
      >
        <h3 className="text-lg font-medium">{title}</h3>
        {children}
        <footer className="flex justify-end gap-4">
          <button 
            onClick={onClose}
            className="px-4 py-2 text-gray-600 hover:text-gray-800"
          >
            Cancel
          </button>
          <button 
            onClick={onConfirm}
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
          >
            Accept
          </button>
        </footer>
      </article>
    </div>,
    document.body
  );
};

export default Modal;
