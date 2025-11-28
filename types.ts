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
  orderTime: string;
  pickupTime?: string;
  scheduledTime?: string; // For scheduled orders
  cancellationReason?: string;
  paymentMethod: 'Cash' | 'Card' | 'UPI';
}

export enum MenuItemType {
  VEG = 'Veg',
  NON_VEG = 'Non-Veg',
  VEGAN = 'Vegan',
}

export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  categoryId: string; // Link to Category
  categoryName: string; // For display purposes
  type: MenuItemType;
  imageUrl: string;
  isAvailable: boolean;
  isPopular?: boolean;
}

export interface Category {
  id: string;
  name: string;
  itemCount: number; // Number of items in this category
  isAvailable: boolean;
}

export interface Branch {
  id: string;
  name: string;
  address: string;
  status: 'Active' | 'Disabled';
  manager: string;
  contact: string;
  latitude: string; // Added for geolocation
  longitude: string; // Added for geolocation
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
  'manage orders' | 
  'manage menu' | 
  'manage staff' | 
  'manage branches' | 
  'view reports' | 
  'manage branding' | 
  'manage settings';

export const AllPermissions: Permission[] = [
  'view dashboard',
  'manage orders',
  'manage menu',
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
  password?: string; // For creating new staff, sensitive - not usually stored on frontend
  lastActivity?: Date; // Optional for activity tracking
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
  logoFile?: File; // For upload
  logoPreviewUrl?: string; // For display
  bannerFile?: File; // For upload
  bannerPreviewUrl?: string; // For display
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
  permissions: Permission[]; // Use the Permission type
}