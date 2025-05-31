import { useState } from 'react';
import { useNavigate } from 'react-router';
import type { UserFormData } from '../components/form/UserForm';
import UserForm from '../components/form/UserForm';

export default function Register() {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async (formData: UserFormData) => {
    setLoading(true);
    
    try {
      const response = await fetch('/php/user/user_register.php', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      
      const data = await response.json();
      
      if (!response.ok || data.error) {
        throw new Error(data.error || 'Registration failed');
      }
      
      navigate('/login');
    } catch (err) {
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen grid place-items-center bg-neutral-800 text-white p-4">
      <div className="w-full max-w-md">
        <h1 className="text-2xl font-bold text-center mb-6">Student Registration</h1>
        <UserForm 
          onSubmit={handleRegister}
          submitButtonText="Register"
          loading={loading}
        />
      </div>
    </main>
  );
}
