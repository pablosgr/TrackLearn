import { useState, useEffect } from 'react';
import type { ChangeEvent, FormEvent } from 'react';
import { useUserData } from '../context/UserContext';
import Button from '../components/ui/Button';
import ProfileCard from '../components/profile/ProfileCard';
import ProfileHeader from '../components/profile/ProfileHeader';
import ProfileField from '../components/profile/ProfileField';
import EditableField from '../components/profile/EditableField';

export default function Profile() {
  const { userData, setUserData } = useUserData();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: userData?.name || '',
    username: userData?.username || ''
  });
  const [errors, setErrors] = useState({
    name: '',
    username: ''
  });
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    validateForm();
  }, [formData]);

  const validateForm = () => {
    const newErrors = {
      name: '',
      username: ''
    };
    
    if (!formData.name.trim()) {
      newErrors.name = 'This field cannot be empty';
    } else if (formData.name.length > 70) {
      newErrors.name = 'Name must be 70 characters or less';
    }

    if (!formData.username.trim()) {
      newErrors.username = 'This field cannot be empty';
    } else if (formData.username.length > 15) {
      newErrors.username = 'Username must be 15 characters or less';
    }
    
    setErrors(newErrors);
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    if (errors.name || errors.username) {
      return;
    }
    
    setIsLoading(true);
    
    try {
      const response = await fetch('/php/user/user_edit_data.php', {
        method: 'PUT',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name: formData.name, username: formData.username }),
      });

      if (!response.ok) {
        throw new Error('Network response failed');
      }

      const data = await response.json();
      if (data.error) {
        throw new Error(data.error);
      }

      if (data.message) {
        if (userData) {
            setUserData({
                ...userData,
                name: formData.name,
                username: formData.username
            });
        }
    }
      
      setIsEditing(false);
    } catch (error) {
      console.error('Error in petition:', error);
    } finally {
      setIsLoading(false);
      setIsEditing(false);
    }
  };

  const hasErrors = !!errors.name || !!errors.username;

  return (
    <>
      <h1 className="text-3xl font-bold mb-8 text-neutral-200">User Profile</h1>
      
      <ProfileCard>
        <ProfileHeader name={userData?.name} role={userData?.role} />

        {isEditing ? (
          <form onSubmit={handleSubmit}>
            <div className="space-y-6">
                <EditableField 
                  id="name"
                  label="Name"
                  value={formData.name}
                  onChange={handleChange}
                />
                {errors.name && (
                  <p className="mt-1 text-sm text-red-800">{errors.name}</p>
                )}
              
                <EditableField 
                  id="username"
                  label="Username"
                  value={formData.username}
                  onChange={handleChange}
                />
                {errors.username && (
                  <p className="mt-1 text-sm text-red-800">{errors.username}</p>
                )}
            </div>
            
            <div className="mt-8 flex justify-end gap-4">
              <Button 
                variant="cancel" 
                onClick={() => setIsEditing(false)}
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                variant="primary"
                isLoading={isLoading}
                disabled={isLoading || hasErrors}
              >
                Save Changes
              </Button>
            </div>
          </form>
        ) : (
          <div className="space-y-4">
            <ProfileField label="Name" value={userData?.name} />
            <ProfileField label="Username" value={userData?.username} />
            <ProfileField label="Email" value={userData?.email} />
            
            {
              userData?.role !== "admin" && (
                <div className="pt-6 flex justify-end">
                  <Button onClick={() => setIsEditing(true)}>
                    Edit Profile
                  </Button>
                </div>
              )
            }
          </div>
        )}
      </ProfileCard>
    </>
  );
}
