import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router';
import { useUserData } from '../context/UserContext';

export default function EnrollClassroom() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { userData } = useUserData();
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const enrollStudent = async () => {
      try {
        const response = await fetch('/php/classroom/enroll_student.php', {
          method: 'POST',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ classroom_id: id }),
        });

        const data = await response.json();

        if (data.error) {
          throw new Error(data.error);
        }

        navigate(`/classroom/${id}`);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to enroll');
      } finally {
        setIsLoading(false);
      }
    };

    if (userData && userData.role === 'student') {
      enrollStudent();
    } else if (userData && (userData.role === 'teacher' || userData.role === 'admin')) {
      setError("Only students can enroll in classrooms");
      setIsLoading(false);
    } else {
      navigate('/login');
    }
  }, [id, userData, navigate]);

  if (isLoading) {
    return (
      <main className="h-full grid place-items-center">
        <p className="text-gray-600">Enrolling in classroom...</p>
      </main>
    );
  }

  if (error) {
    return (
      <main className="h-full grid place-items-center">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      </main>
    );
  }

  return null;
}
