export interface User {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  role: 'OWNER' | 'TENANT' | 'STAFF' | 'ADMIN';
  status: 'ACTIVE' | 'INACTIVE' | 'SUSPENDED';
}

export interface Property {
  id: number;
  ownerId: number;
  name: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  totalRooms: number;
  propertyType: string;
  amenities?: string[];
  rules?: string[];
}

export interface Room {
  id: number;
  propertyId: number;
  roomNumber: string;
  roomType: string;
  capacity: number;
  currentOccupancy: number;
  rentAmount: number;
  securityDeposit: number;
  status: 'AVAILABLE' | 'OCCUPIED' | 'MAINTENANCE' | 'RESERVED';
  amenities?: string[];
}

export interface Booking {
  id: number;
  roomId: number;
  tenantId: number;
  checkInDate: string;
  checkOutDate?: string;
  monthlyRent: number;
  securityDeposit: number;
  status: 'ACTIVE' | 'COMPLETED' | 'CANCELLED';
  agreementUrl?: string;
}

export interface Payment {
  id: number;
  bookingId: number;
  amount: number;
  paymentType: 'RENT' | 'DEPOSIT' | 'UTILITY' | 'PENALTY' | 'REFUND';
  paymentMethod?: string;
  paymentDate: string;
  dueDate?: string;
  status: 'PENDING' | 'PAID' | 'OVERDUE' | 'CANCELLED';
  transactionId?: string;
  notes?: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}