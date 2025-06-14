import type { FC } from 'react';
import { useState } from 'react';
import { useNavigate } from 'react-router';
import { useUserData } from '../../context/UserContext.tsx';
import Modal from '../ui/Modal';
import { Trash } from 'lucide-react';

interface ClassroomCardProps {
    id: string;
    name: string;
    teacherUsername: string;
    onDelete?: (id: string) => void;
}

const ClassroomCard: FC<ClassroomCardProps> = ({ id, name, teacherUsername, onDelete }) => {
  const navigate = useNavigate();
  const { userData } = useUserData();
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleDelete = async () => {
    try {
      if (onDelete) {
        onDelete(id);
      }
      setShowDeleteModal(false);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to delete classroom');
      setShowDeleteModal(false);
    }
  };

  const handleCardClick = (e: React.MouseEvent) => {
    const target = e.target as HTMLElement;
    if (target.hasAttribute('data-no-navigate')) {
      e.stopPropagation();
      return;
    }
    navigate(`/classroom/${id}`);
  };

  return (
    <div 
      className="bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden cursor-pointer w-80 relative"
      onClick={handleCardClick}
    >
      <div className="bg-cyan-600 text-white p-6 h-32 flex items-end">
        <h2 className="text-xl font-medium line-clamp-2">{name}</h2>
      </div>
      <div className="p-4">
        <p className="text-neutral-500 text-sm h-10">Teacher: {teacherUsername}</p>
      </div>

      {(userData?.role === 'admin' || userData?.role === 'teacher') && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            setShowDeleteModal(true);
          }}
          data-no-navigate
          className="
            delete-btn absolute top-2 right-2 p-2 rounded-lg transition-colors
            hover:bg-cyan-500 hover:bg-opacity-20 hover:cursor-pointer 
          "
          title="Delete classroom"
        >
          <Trash color='white'/>
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
          setShowDeleteModal(false);
        }}
        title="Delete Classroom"
        data-no-navigate
      >
        <p>Are you sure you want to delete "{name}"? This action cannot be undone.</p>
      </Modal>
    </div>
  );
};

export default ClassroomCard;
