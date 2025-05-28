import type { FC } from 'react';
import { useParams } from 'react-router';
import { useEffect, useState } from 'react';
import type { UserData } from '../../types/user-context-type';
import UserCard from './UserCard';

const ClassroomStudents: FC = () => {
  const { id } = useParams<{ id: string }>();
  const [students, setStudents] = useState<UserData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const handleStudentDelete = async (studentId: string) => {
    try {
      const response = await fetch('/php/classroom/remove_classroom_student.php', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          classroom_id: id,
          student_id: studentId
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to remove student');
      }

      const data = await response.json();
      
      if (data.error) {
        throw new Error(data.error);
      }

      // Update UI after successful API call
      setStudents(prevStudents => 
        prevStudents.filter(student => student.id !== studentId)
      );
    } catch (err) {
      console.error('Error removing student:', err);
      // Show error message to user
    }
  };

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const response = await fetch('/php/classroom/classroom_get_students.php', {
          method: 'POST',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ id }),
        });

        if (!response.ok) {
          throw new Error('Failed to fetch students');
        }

        const data = await response.json();
        if (data.error) {
          throw new Error(data.error);
        }

        setStudents(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setIsLoading(false);
      }
    };

    fetchStudents();
  }, [id]);

  if (isLoading) {
    return (
      <article className="bg-white rounded-lg shadow-sm p-6">
        <div className="grid place-items-center py-12">
          <p className="text-gray-500">Loading students...</p>
        </div>
      </article>
    );
  }

  if (error) {
    return (
      <article className="bg-white rounded-lg shadow-sm p-6">
        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded">
          {error}
        </div>
      </article>
    );
  }

  return (
    <article className="bg-white rounded-lg shadow-sm p-6">
      <header className="flex justify-between items-center mb-6">
        <h2 className="text-xl text-neutral-900 font-medium">Students</h2>
        <span className="text-sm text-gray-500">
          {students.length} {students.length === 1 ? 'student' : 'students'} enrolled
        </span>
      </header>

      {students.length > 0 ? (
        <ul className="divide-y divide-gray-100">
          {students.map(student => (
            <UserCard
              key={student.id}
              user={student}
              onDelete={handleStudentDelete} 
            />
          ))}
        </ul>
      ) : (
        <div className="text-center py-12">
          <p className="text-gray-500">No students enrolled yet</p>
        </div>
      )}
    </article>
  );
};

export default ClassroomStudents;
