import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import RegisterFormWrapper from '../../components/forms/RegisterFormWrapper';
import PersonalInfoFields from '../../components/forms/PersonalInfoFields';
import PasswordFields from '../../components/forms/PasswordFields';
import { useOwnerForm } from '../../hooks/useOwnerForm';
import { useAuth } from '../../contexts/AuthContext';

export default function OwnerRegister() {
  const { formData, handleChange, validate } = useOwnerForm();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [successOpen, setSuccessOpen] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }
    try {
      setLoading(true);
      await register({
        email: formData.email,
        password: formData.password,
        firstName: formData.firstName,
        lastName: formData.lastName,
        phone: formData.phone || undefined,
        role: 'OWNER',
      });
      setSuccessOpen(true);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <RegisterFormWrapper
      title="Register as Property Owner"
      subtitle="Create your owner account to manage properties, rooms and tenants."
      error={error}
      loading={loading}
      onSubmit={handleSubmit}
      onBack={() => navigate('/register')}
      submitLabel="Register as Owner"
      successOpen={successOpen}
      onSuccessLogin={() => navigate('/login')}
    >
      <PasswordFields values={formData} onChange={handleChange} required />
      <PersonalInfoFields values={formData} onChange={handleChange} />
    </RegisterFormWrapper>
  );
}
