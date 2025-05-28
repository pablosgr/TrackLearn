import { useEffect, useState } from 'react';
import { useParams } from 'react-router';
import { useUserData } from '../context/UserContext';
import ClassroomTests from '../components/classroom/ClassroomTests';
import ClassroomStudents from '../components/classroom/ClassroomStudents';
import ClassroomSettings from '../components/classroom/ClassroomSettings';

interface ClassroomDetail {
  id: string;
  teacher_id: string;
  teacher_name: string;
  teacher_username: string;
  name: string;
  created_at: string;
}

type Tab = 'tests' | 'students' | 'settings';

export default function ClassroomDetail() {
  const { id } = useParams<{ id: string }>();
  const { userData } = useUserData();
  const [classroom, setClassroom] = useState<ClassroomDetail | null>(null);
  const [activeTab, setActiveTab] = useState<Tab>('tests');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchClassroomDetails = async () => {
      try {
        const response = await fetch(`/php/classroom/get_classroom.php`, {
          method: 'POST',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ id }),
        });

        if (!response.ok) {
          throw new Error('Failed to fetch classroom details');
        }

        const data = await response.json();

        if (data.error) {
          throw new Error(data.error);
        }

        setClassroom(data.classrooms[0]);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setIsLoading(false);
      }
    };

    fetchClassroomDetails();
  }, [id]);

  const handleClassUpdate = (newName: string) => {
    setClassroom(prev => prev ? { ...prev, name: newName } : null);
  };

  if (isLoading) {
    return (
      <main className="h-40 rounded-lg bg-gray-100 grid place-items-center">
        <p className="text-gray-600">Loading classroom details...</p>
      </main>
    );
  }

  if (error || !classroom) {
    return (
      <main className="min-h-screen bg-gray-100 p-8">
        <p className="max-w-4xl mx-auto bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error || 'Classroom not found'}
        </p>
      </main>
    );
  }

  return (
    <main className="bg-gray-100 rounded-lg overflow-hidden h-full">
      <header className="bg-cyan-600 text-white">
        <section className="max-w-7xl mx-auto px-6 pt-4">
          <div className="flex justify-between items-start mb-4">
            <hgroup>
              <h1 className="text-3xl font-medium mb-1">{classroom.name}</h1>
              <p className="flex items-center gap-2 text-white/90 text-sm">
                <span>{classroom.teacher_name}</span>
                <span>•</span>
                <span>{classroom.teacher_username}</span>
              </p>
            </hgroup>
            <time className="text-sm text-white/75">
              Created {new Date(classroom.created_at).toLocaleDateString()}
            </time>
          </div>
          
          <nav className="flex gap-8 text-sm font-medium">
            <button 
              onClick={() => setActiveTab('tests')}
              className={`py-4 ${
                activeTab === 'tests'
                  ? 'border-b-2 border-white text-white'
                  : 'text-white/75 hover:text-white'
              }`}
            >
              Tests
            </button>
            <button 
              onClick={() => setActiveTab('students')}
              className={`py-4 ${
                activeTab === 'students'
                  ? 'border-b-2 border-white text-white'
                  : 'text-white/75 hover:text-white'
              }`}
            >
              Students
            </button>
            {userData?.role === 'teacher' && (
              <button 
                onClick={() => setActiveTab('settings')}
                className={`py-4 ${
                  activeTab === 'settings'
                    ? 'border-b-2 border-white text-white'
                    : 'text-white/75 hover:text-white'
                }`}
              >
                Settings ⚙️
              </button>
            )}
          </nav>
        </section>
      </header>

      <section className="max-w-7xl mx-auto px-6 py-8">
        {activeTab === 'tests' ? (
          <ClassroomTests />
        ) : activeTab === 'students' ? (
          <ClassroomStudents />
        ) : (
          userData?.role === 'teacher' && 
          <ClassroomSettings 
            currentName={classroom.name}
            onUpdate={handleClassUpdate}
          />
        )}
      </section>
    </main>
  );
}
