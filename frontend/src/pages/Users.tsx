import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { useUserData } from '../context/UserContext';
import type { UserData } from '../types/user-context-type';
import UserCard from '../components/classroom/UserCard';

export default function Users() {
  const { userData } = useUserData();
  const navigate = useNavigate();
  const [users, setUsers] = useState<UserData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (userData && userData.role !== 'admin') {
      navigate('/home');
      return;
    }

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
      // Throw the error up to the UserCard component
      throw err;
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
      <h1 className="text-3xl font-bold mb-8">User Management</h1>
      
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
    </div>
  );
}
