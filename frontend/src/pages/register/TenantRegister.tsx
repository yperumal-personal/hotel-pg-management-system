import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import RegisterFormWrapper from '../../components/forms/RegisterFormWrapper';
import PersonalInfoFields from '../../components/forms/PersonalInfoFields';
import PasswordFields from '../../components/forms/PasswordFields';
import AddressFields from '../../components/forms/AddressFields';
import TenantIdentityFields from '../../components/forms/TenantIdentityFields';
import StayScheduleFields from '../../components/forms/StayScheduleFields';
import { useTenantForm } from '../../hooks/useTenantForm';
import { useAuth } from '../../contexts/AuthContext';
import { pricingService } from '../../services/pricingService';

export default function TenantRegister() {
  const {
    formData,
    handleChange,
    handleAadharImageChange,
    handleStayScheduleChange,
    handleIncrementDuration,
    handleDecrementDuration,
    validate,
  } = useTenantForm();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [successOpen, setSuccessOpen] = useState(false);
  const [pricingRates, setPricingRates] = useState<{ DAY: number | null; MONTH: number | null }>({
    DAY: null,
    MONTH: null,
  });
  const { register } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    Promise.all([pricingService.getPricing('DAY'), pricingService.getPricing('MONTH')])
      .then(([dayRes, monthRes]) => {
        setPricingRates({ DAY: dayRes.data.costPerUnit, MONTH: monthRes.data.costPerUnit });
      })
      .catch(() => setError('Failed to load pricing. Please refresh.'));
  }, []);

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
      const effectivePassword = formData.password || formData.phone;
      await register({
        email: formData.email,
        password: effectivePassword,
        firstName: formData.firstName,
        lastName: formData.lastName,
        phone: formData.phone || undefined,
        aadharNo: formData.aadharNo || undefined,
        aadharImageUrl: formData.aadharImageUrl || undefined,
        workStatus: formData.workStatus || undefined,
        employeeName: formData.employeeName || undefined,
        collegeName: formData.collegeName || undefined,
        streetName: formData.streetName || undefined,
        city: formData.city || undefined,
        district: formData.district || undefined,
        state: formData.state || undefined,
        pinCode: formData.pinCode || undefined,
        gender: formData.gender || undefined,
        maritalStatus: formData.maritalStatus || undefined,
        role: 'TENANT',
        checkInDate: formData.checkInDate || undefined,
        staySchedule: formData.staySchedule || undefined,
        stayDuration: formData.stayDuration,
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
      title="Register as Tenant"
      subtitle="Fill in your details to register as a tenant and book your stay."
      error={error}
      loading={loading}
      onSubmit={handleSubmit}
      onBack={() => navigate('/register')}
      submitLabel="Register as Tenant"
      successOpen={successOpen}
      onSuccessLogin={() => navigate('/login')}
    >
      <PasswordFields
        values={formData}
        onChange={handleChange}
        required={false}
        helperText="Optional — phone number will be used as password if left blank"
      />
      <PersonalInfoFields values={formData} onChange={handleChange} />
      <TenantIdentityFields
        values={formData}
        onChange={handleChange}
        onAadharImageChange={handleAadharImageChange}
        onError={setError}
      />
      <AddressFields values={formData} onChange={handleChange} />
      <StayScheduleFields
        values={formData}
        onChange={handleChange}
        onStayScheduleChange={handleStayScheduleChange}
        onIncrement={handleIncrementDuration}
        onDecrement={handleDecrementDuration}
        pricingRates={pricingRates}
      />
    </RegisterFormWrapper>
  );
}
