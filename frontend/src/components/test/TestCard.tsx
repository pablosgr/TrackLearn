import { useState } from 'react';
import { useNavigate } from 'react-router';
import { useUserData } from '../../context/UserContext';
import Modal from '../ui/Modal';
import type { TestType } from '../../types/test-type';

export default function TestCard({ test, onDelete }: { test: TestType, onDelete?: (id: string) => Promise<void>; }) {
  const navigate = useNavigate();
  const { userData } = useUserData();
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleDelete = async () => {
    try {
      if (onDelete) {
        await onDelete(test.id.toString());
      }
      setShowDeleteModal(false);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to delete test');
      setShowDeleteModal(false);
    }
  };

  const handleCardClick = (e: React.MouseEvent) => {
    // Prevent navigation when clicking delete button or modal
    if ((e.target as HTMLElement).closest('.delete-btn') || 
        (e.target as HTMLElement).closest('.modal-content')) {
      e.stopPropagation();
      return;
    }
    navigate(`/test/${test.id}`);
  };

  return (
    <div 
      className="bg-gradient-to-br from-white to-gray-50 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden cursor-pointer w-80 relative"
      onClick={handleCardClick}
    >
      <div className="bg-gradient-to-r from-cyan-600 to-cyan-700 text-white p-6 h-28 flex items-end relative">
        <div className="absolute top-3 left-3 bg-cyan-500 px-2 py-1 rounded text-xs font-medium opacity-90">
          {test.category}
        </div>
        <h2 className="text-xl font-medium line-clamp-2">{test.name}</h2>
      </div>
      
      <div className="p-4">
        <div className="flex items-center gap-2 text-gray-600 text-sm">
          <span className="text-base">🕒</span>
          <time>{new Date(test.created_at).toLocaleDateString()}</time>
        </div>
        <div className="mt-3 flex items-center gap-2 text-gray-600 text-sm">
          <span className="text-base">👤</span>
          <span>{test.author_name}</span>
        </div>
      </div>

      {(userData?.role === 'teacher') && onDelete && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            setShowDeleteModal(true);
          }}
          className="delete-btn absolute top-2 right-2 p-2 hover:bg-white hover:bg-opacity-20 rounded-full transition-colors"
          title="Delete test"
        >
          🗑️
        </button>
      )}

      {error && (
        <p className="text-red-500 text-sm absolute bottom-2 left-2">{error}</p>
      )}

      <Modal
        isOpen={showDeleteModal}
        onClose={(e) => {
          e?.stopPropagation();
          setShowDeleteModal(false);
        }}
        onConfirm={(e) => {
          e?.stopPropagation();
          handleDelete();
        }}
        title="Delete Test"
      >
        <p>Are you sure you want to delete "{test.name}"? This action cannot be undone.</p>
      </Modal>
    </div>
  );
}
