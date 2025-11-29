
export enum OrderStatus {
  INCOMING = 'Incoming',
  PENDING = 'Pending',
  PREPARING = 'Preparing',
  READY_FOR_PICKUP = 'Ready for Pickup',
  SCHEDULED = 'Scheduled',
  COMPLETED = 'Completed',
  CANCELLED = 'Cancelled',
}

export interface OrderItem {
  id: string;
  name: string;
  quantity: number;
  price: number;
}

export interface Order {
  id: string;
  customerName: string;
  totalAmount: number;
  status: OrderStatus;
  items: OrderItem[];
  date: string; // YYYY-MM-DD format
  orderTime: string;
  pickupTime?: string;
  scheduledTime?: string;
  cancellationReason?: string;
  paymentMethod: 'Cash' | 'Card' | 'UPI';
}

export interface Branch {
  id: string;
  name: string;
  address: string;
  status: 'Active' | 'Disabled';
  manager: string;
  contact: string;
  latitude: string;
  longitude: string;
}

export enum StaffRole {
  ADMIN = 'Admin',
  MANAGER = 'Manager',
  STAFF = 'Staff',
  KITCHEN = 'Kitchen Staff',
  BILLING = 'Billing Staff'
}

export type Permission = 
  'view dashboard' | 
  'manage staff' | 
  'manage branches' | 
  'view reports' | 
  'manage branding' | 
  'manage settings';

export const AllPermissions: Permission[] = [
  'view dashboard',
  'manage staff',
  'manage branches',
  'view reports',
  'manage branding',
  'manage settings',
];

export interface StaffMember {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: StaffRole;
  branchId: string;
  branchName: string;
  isActive: boolean;
  password?: string;
  lastActivity?: Date;
}

export interface SalesDataPoint {
  date: string;
  sales: number;
}

export interface CategorySalesData {
  category: string;
  sales: number;
}

export interface MostSellingItem {
  id: string;
  name: string;
  salesCount: number;
  revenue: number;
}

export interface VendorInfo {
  logoFile?: File;
  logoPreviewUrl?: string;
  bannerFile?: File;
  bannerPreviewUrl?: string;
  themeColorPrimary: string;
  themeColorSecondary: string;
  cafeName: string;
  address: string;
  phone: string;
  about: string;
  timings: {
    day: string;
    isOpen: boolean;
    openTime: string;
    closeTime: string;
  }[];
  socialLinks: {
    facebook?: string;
    instagram?: string;
    twitter?: string;
    website?: string;
  };
}

export enum PayoutMethod {
  BANK = 'Bank Transfer',
  UPI = 'UPI',
}

export interface BankAccount {
  bankName: string;
  accountNumber: string;
  ifscCode: string;
  accountHolderName: string;
}

export interface UPIAccount {
  upiId: string;
  accountHolderName: string;
}

export interface Role {
  id: string;
  name: string;
  description: string;
  permissions: Permission[];
}
