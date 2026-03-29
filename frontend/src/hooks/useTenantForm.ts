import { useState } from 'react';
import type { ChangeEvent } from 'react';

export interface TenantFormData {
  email: string;
  password: string;
  confirmPassword: string;
  firstName: string;
  lastName: string;
  phone: string;
  aadharNo: string;
  aadharImageUrl: string;
  gender: string;
  maritalStatus: string;
  workStatus: string;
  employeeName: string;
  collegeName: string;
  streetName: string;
  city: string;
  district: string;
  state: string;
  pinCode: string;
  checkInDate: string;
  staySchedule: string;
  stayDuration: number;
}

const defaultValues: TenantFormData = {
  email: '',
  password: '',
  confirmPassword: '',
  firstName: '',
  lastName: '',
  phone: '',
  aadharNo: '',
  aadharImageUrl: '',
  gender: '',
  maritalStatus: '',
  workStatus: '',
  employeeName: '',
  collegeName: '',
  streetName: '',
  city: '',
  district: '',
  state: '',
  pinCode: '',
  checkInDate: '',
  staySchedule: '',
  stayDuration: 1,
};

export function useTenantForm(initialValues?: Partial<TenantFormData>) {
  const [formData, setFormData] = useState<TenantFormData>({ ...defaultValues, ...initialValues });

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleAadharImageChange = (base64: string) => {
    setFormData(prev => ({ ...prev, aadharImageUrl: base64 }));
  };

  const handleStayScheduleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, staySchedule: e.target.value, stayDuration: 1 }));
  };

  const handleIncrementDuration = () => {
    setFormData(prev => {
      const max = prev.staySchedule === 'DAY' ? 30 : 12;
      return prev.stayDuration < max ? { ...prev, stayDuration: prev.stayDuration + 1 } : prev;
    });
  };

  const handleDecrementDuration = () => {
    setFormData(prev =>
      prev.stayDuration > 1 ? { ...prev, stayDuration: prev.stayDuration - 1 } : prev
    );
  };

  const validate = (): string | null => {
    if (!formData.firstName) return 'First name is required';
    if (!formData.lastName) return 'Last name is required';
    if (!formData.email) return 'Email is required';
    if (!formData.phone) return 'Phone number is required';
    if (!/^\d{10}$/.test(formData.phone)) return 'Phone number must be 10 digits';
    if (formData.password) {
      if (formData.password.length < 6) return 'Password must be at least 6 characters';
      if (formData.password !== formData.confirmPassword) return 'Passwords do not match';
    }
    if (!formData.aadharNo) return 'Aadhar number is required';
    if (!/^\d{12}$/.test(formData.aadharNo)) return 'Aadhar number must be 12 digits';
    if (!formData.gender) return 'Gender is required';
    if (!formData.maritalStatus) return 'Marital status is required';
    if (!formData.workStatus) return 'Work status is required';
    if (formData.workStatus === 'EMPLOYEE' && !formData.employeeName) return 'Company name is required';
    if (formData.workStatus === 'STUDENT' && !formData.collegeName) return 'College name is required';
    if (!formData.streetName || !formData.city || !formData.district || !formData.state || !formData.pinCode) {
      return 'All address fields are required';
    }
    if (!/^\d{6}$/.test(formData.pinCode)) return 'PIN code must be 6 digits';
    if (!formData.checkInDate) return 'Check-in date is required';
    if (!formData.staySchedule) return 'Stay schedule is required';
    if (formData.stayDuration < 1) return 'Stay duration must be at least 1';
    return null;
  };

  return {
    formData,
    handleChange,
    handleAadharImageChange,
    handleStayScheduleChange,
    handleIncrementDuration,
    handleDecrementDuration,
    validate,
  };
}
