import api from './api';
import { Tenant } from '../types';

export const tenantService = {
  /**
   * Get all tenants
   */
  getAllTenants: () => api.get<Tenant[]>('/tenants'),
};
