import { useState, useEffect } from 'react';
import { useParams } from 'react-router';
import { useUserData } from '../context/UserContext';
import type { TestType, TestQuestion } from '../types/test-type';
import TestQuestions from '../components/test/TestQuestion';
import TestSettings from '../components/test/TestSettings';

export default function TestDetail() {
    const { id } = useParams();
    const { userData } = useUserData();
    const [test, setTest] = useState<TestType | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isSaving, setIsSaving] = useState(false);
    const [saveState, setSaveState] = useState<{ type: string, message: string } | null>(null);

    useEffect(() => {
        const fetchTestDetail = async () => {
            try {
                const response = await fetch(`/php/test/get_test.php`, {
                    method: 'POST',
                    credentials: 'include',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ id }),
                });

                if (!response.ok) {
                    throw new Error('Failed to fetch test details');
                }

                const data = await response.json();

                if (!data || data.length === 0) {
                    throw new Error('Test not found');
                }

                setTest(data[0]);
            } catch (err) {
                setError(err instanceof Error ? err.message : 'An error occurred');
                console.error('Error fetching test details:', err);
            } finally {
                setIsLoading(false);
            }
        };

        fetchTestDetail();
    }, [id]);

    const isTeacher = userData?.role === 'teacher' && userData?.username === test?.author_username;

    const handleQuestionsUpdate = (updatedQuestions: TestQuestion[]) => {
        if (!test) return;
        setTest(prev => prev ? {
            ...prev,
            questions: updatedQuestions
        } : null);
    };

    const handleTestSettingsUpdate = (newName: string, newCategoryId: number, newCategory: string) => {
        if (!test) return;
        
        setTest(prev => prev ? {
            ...prev,
            name: newName,
            category_id: newCategoryId,
            category: newCategory
        } : null);
    };

    const handleSaveTest = async () => {
        if (!test) return;
        setIsSaving(true);
        setSaveState(null);
        
        try {
            const response = await fetch('/php/test/update_test.php', {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(test)
            });

            if (!response.ok) {
                throw new Error('Failed to update test');
            }

            const updatedTest = await response.json();
            setTest(updatedTest);
            setSaveState({ type: 'success', message: 'Changes saved successfully!' });
            setTimeout(() => setSaveState(null), 2000);

        } catch (err) {
            console.error('Error updating test:', err);
            setSaveState({ type: 'error', message: (err instanceof Error ? err.message : 'Failed to save changes') });
            setTimeout(() => setSaveState(null), 3000);
        } finally {
            setIsSaving(false);
        }
    };

    if (isLoading) {
        return (
            <main className="h-40 rounded-lg bg-gray-100 grid place-items-center">
                <p className="text-gray-600">Loading test details...</p>
            </main>
        );
    }

    if (error || !test) {
        return (
            <main className="min-h-screen bg-gray-100 p-8">
                <p className="max-w-4xl mx-auto bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                    {error || 'Test not found'}
                </p>
            </main>
        );
    }

    return (
        <main className="bg-gray-100 rounded-lg overflow-hidden h-full">
            <header className="bg-cyan-600 text-white">
                <section className="max-w-7xl mx-auto px-6 pt-4">
                    <div className="flex justify-between items-start mb-4">
                        <div>
                            <h1 className="text-3xl font-medium mb-1">{test.name}</h1>
                            <div className="flex items-center gap-2 text-white/90 text-sm">
                                <span>{test.author_name}</span>
                                <span>•</span>
                                <span>{test.author_username}</span>
                                <span>•</span>
                                <span>{test.category}</span>
                            </div>
                        </div>
                        <time className="text-sm text-white/75">
                            Created {new Date(test.created_at).toLocaleDateString()}
                        </time>
                    </div>
                    
                    {/* Rest of the header content */}
                </section>
            </header>

            <div className="max-w-7xl mx-auto px-6 py-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Settings Section */}
                {userData?.role === 'teacher' && (
                    <div className="lg:col-span-1">
                        <TestSettings 
                            test={test}
                            onUpdate={handleTestSettingsUpdate}
                        />
                    </div>
                )}

                {/* Questions Section */}
                <div className={`${userData?.role === 'teacher' ? 'lg:col-span-2' : 'lg:col-span-3'}`}>
                    <TestQuestions
                        questions={test.questions}
                        onQuestionsUpdate={handleQuestionsUpdate}
                        isTeacher={isTeacher}
                    />
                    
                    {isTeacher && (
                        <div className="mt-8 flex justify-end">
                            {saveState && (
                                <p className={`text-sm ${ saveState.type === 'error' ? 'text-red-600' : 'text-green-600' }`}>
                                    {saveState.message}
                                </p>
                            )}
                            <button
                                onClick={handleSaveTest}
                                disabled={isSaving}
                                className={`px-4 py-2 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700 
                                    disabled:opacity-50 disabled:cursor-not-allowed font-medium
                                    flex items-center gap-2`}
                            >
                                {isSaving ? (
                                    <>
                                        <span className="animate-spin">↻</span>
                                        Saving...
                                    </>
                                ) : (
                                    'Save Changes'
                                )}
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </main>
    );
}
