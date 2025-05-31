import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { useUserData } from '../context/UserContext';
import type { UserData } from '../types/user-context-type';
import type { UserFormData } from '../components/form/UserForm';
import UserCard from '../components/classroom/UserCard';
import UserForm from '../components/form/UserForm';
import Modal from '../components/ui/Modal';

export default function Users() {
  const { userData } = useUserData();
  const navigate = useNavigate();
  const [users, setUsers] = useState<UserData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showAddTeacherModal, setShowAddTeacherModal] = useState(false);
  const [addingTeacher, setAddingTeacher] = useState(false);
  const [modalError, setModalError] = useState<string | null>(null);

  const fetchUsers = async () => {
      try {
        const response = await fetch('/php/user/get_all_users.php', {
          credentials: 'include',
        });

        if (!response.ok) {
          throw new Error('Failed to fetch users');
        }

        const data = await response.json();

        if (data.error) {
          throw new Error(data.error);
        }

        setUsers(data.users.filter((user: UserData) => user.role !== 'admin'));
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setIsLoading(false);
      }
    };

  useEffect(() => {
    if (userData && userData.role !== 'admin') {
      navigate('/home');
      return;
    }
    fetchUsers();
  }, [userData, navigate]);

  const handleUserDelete = async (userId: string) => {
    try {
      const response = await fetch('/php/user/delete_user.php', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ user_id: userId }),
      });

      const data = await response.json();

      if (!response.ok || data.error) {
        throw new Error(data.error || 'Failed to delete user');
      }

      setUsers(prevUsers => prevUsers.filter(user => user.id !== userId));
    } catch (err) {
      throw err;
    }
  };

  const handleAddTeacher = async (formData: UserFormData) => {
    setAddingTeacher(true);
    setModalError(null);
    
    try {
      const response = await fetch('/php/user/teacher_register.php', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok || data.error) {
        setModalError(data.error || 'Failed to add teacher');
        throw error;
      }

      await fetchUsers();
      setShowAddTeacherModal(false);
      setModalError(null);
    } catch (err) {
      console.error('Error adding teacher:', err);
    } finally {
      setAddingTeacher(false);
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center items-center">
          <p className="text-gray-600">Loading users...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">User Management</h1>
        <button
          onClick={() => setShowAddTeacherModal(true)}
          className="bg-cyan-600 text-white px-4 py-2 rounded-lg hover:bg-cyan-700 transition-colors"
        >
          ➕ Add Teacher
        </button>
      </div>
      
      <div className="bg-white rounded-lg shadow-sm">
        {users.length > 0 ? (
          <ul className="divide-y divide-gray-100">
            {users.map(user => (
              <UserCard
                key={user.id}
                user={user}
                onDelete={handleUserDelete}
              />
            ))}
          </ul>
        ) : (
          <p className="text-center py-8 text-gray-500">No users found.</p>
        )}
      </div>


      <Modal
        isOpen={showAddTeacherModal}
        onClose={() => {
          setShowAddTeacherModal(false);
          setModalError(null);
        }}
        title="Add New Teacher"
      >
        <div className="space-y-4">
          {modalError && (
            <div className="bg-red-900/50 border border-red-500 text-red-200 px-4 py-3 rounded">
              {modalError}
            </div>
          )}
          <UserForm
            onSubmit={handleAddTeacher}
            submitButtonText="Add Teacher"
            loading={addingTeacher}
          />
        </div>
      </Modal>
    </div>
  );
}
