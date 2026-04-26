import api from './api';
import { Tenant } from '../types';

export interface UpdateTenantData {
  email?: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  aadharNo?: string;
  aadharImageUrl?: string;
  workStatus?: string;
  employeeName?: string;
  collegeName?: string;
  streetName?: string;
  city?: string;
  district?: string;
  state?: string;
  pinCode?: string;
  gender?: string;
  maritalStatus?: string;
  checkInDate?: string;
  checkOutDate?: string;
  staySchedule?: 'DAY' | 'MONTH';
  stayDuration?: number;
  status?: Tenant['status'];
}

export interface ExtendStayData {
  checkOutDate: string;
  staySchedule: 'DAY' | 'MONTH';
  stayDuration: number;
  status: Tenant['status'];
}

export const tenantService = {
  /**
   * Get all tenants
   */
  getAllTenants: () => api.get<Tenant[]>('/tenants'),
  
  /**
   * Get tenant by ID
   */
  getTenantById: (id: number) => api.get<Tenant>(`/tenants/${id}`),
  
  /**
   * Update tenant
   */
  updateTenant: (id: number, data: UpdateTenantData) => api.put<Tenant>(`/tenants/${id}`, data),
  
  /**
   * Delete tenant
   */
  deleteTenant: (id: number) => api.delete(`/tenants/${id}`),
  
  /**
   * Extend tenant stay
   */
  extendStay: (id: number, data: ExtendStayData) => api.put<Tenant>(`/tenants/${id}`, data),
};
