import api from './api';
import { PricingConfig } from '../types';

export const pricingService = {
  getPricing: (planType: 'DAY' | 'MONTH') =>
    api.get<PricingConfig>(`/pricing/${planType}`),
};
