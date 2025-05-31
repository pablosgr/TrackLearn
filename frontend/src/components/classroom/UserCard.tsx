import type { FC } from 'react';
import { useState } from 'react';
import type { UserData } from '../../types/user-context-type';
import { useUserData } from '../../context/UserContext';
import Modal from '../ui/Modal';

interface UserCardProps {
  user: UserData;
  onDelete: (userId: string) => Promise<void>;
}

const UserCard: FC<UserCardProps> = ({ user, onDelete }) => {
  const { userData } = useUserData();
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleDelete = async () => {
    if (!user.id) return;
    
    try {
      await onDelete(user.id);
      setShowDeleteModal(false);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete user');
      setShowDeleteModal(false);
      setTimeout(() => {
        setError(null);
      }, 3000);
    }
  };

  return (
    <>
      <li className="flex items-center gap-4 p-4 hover:bg-gray-50 rounded-lg transition-colors">
        <div className="h-10 w-10 rounded-full bg-cyan-600 grid place-items-center">
          <span className="text-white font-medium">
            {user.name && user.name.charAt(0).toUpperCase()}
          </span>
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-sm font-medium text-gray-900 truncate">{user.name}</h3>
          <p className="text-sm text-gray-500">@{user.username}</p>
          <p className="text-xs text-gray-400">{user.role}</p>
          {error && (
            <p className="text-red-500 text-xs mt-1">{error}</p>
          )}
        </div>
        {userData?.role === 'admin' && (
          <button
            onClick={() => {
              setShowDeleteModal(true);
              setError(null); // Clear any previous errors
            }}
            className="text-red-600 hover:text-red-800 p-2 hover:cursor-pointer"
            title="Delete user"
          >
            ❌
          </button>
        )}
      </li>

      <Modal
        isOpen={showDeleteModal}
        onClose={() => {
          setShowDeleteModal(false);
          setError(null);
        }}
        onConfirm={handleDelete}
        title="Delete User"
      >
        <p className="text-neutral-200">
          Are you sure you want to delete user <strong>{user.name}</strong>?
          <br />
          This action cannot be undone.
        </p>
      </Modal>
    </>
  );
};

export default UserCard;
