export interface ApiResponse<T> {
    success: boolean;
    message: string;
    data: T;
}

export interface PaginatedResponse<T> {
    data: T[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
}

export interface User {
    _id: string;
    name: string;
    username?: string;
    mobile?: string;
    email?: string;
    gender?: "male" | "female";
    role: "user" | "admin";
    avatar?: string;
    authProvider?: "local" | "auth0" | "google" | "apple";
    auth0Id?: string;
    emailConsent: boolean;
    isActive: boolean;
    createdAt: string;
}

export interface AuthTokens {
    accessToken: string;
    refreshToken: string;
}

export interface AuthResult {
    user: User;
    tokens?: AuthTokens;
}

export interface Product {
    _id: string;
    name: string;
    slug: string;
    description: string;
    price: number;
    images: string[];
    mainImage: string;
    stock: number;
    categoryId: string | Category;
    subCategoryId: string | Subcategory;
    isActive: boolean;
    isDeleted: boolean;
    totalSold: number;
    isOutOfStock: boolean;
    isLowStock: boolean;
    createdAt: string;
}

export interface Category {
    _id: string;
    title: string;
    slug: string;
    isActive: boolean;
    isDeleted: boolean;
}

export interface Subcategory {
    _id: string;
    title: string;
    slug: string;
    categoryId: string;
    isActive: boolean;
    isDeleted: boolean;
}

export interface CartItem {
    _id: string;
    productId: string | Product;
    quantity: number;
    price: number;
    totalPrice: number;
    isPriceChanged: boolean;
}

export interface CartResponse {
    activeItems: CartItem[];
    priceChangedItems: CartItem[];
    subtotal: number;
    totalItems: number;
}

export interface Order {
    _id: string;
    userId: string;
    address: string;
    phoneNumber: string;
    totalPrice: number;
    status: OrderStatus;
    products: OrderProduct[];
    refundRequested: boolean;
    refundStatus?: "pending" | "approved" | "refused";
    statusLog: StatusLog[];
    createdAt: string;
}

export type OrderStatus =
    | "pending"
    | "preparing"
    | "shipped"
    | "cancelledByUser"
    | "cancelledByAdmin"
    | "refused"
    | "received";

export interface OrderProduct {
    productId: string;
    name: string;
    price: number;
    quantity: number;
    image: string;
}

export interface StatusLog {
    status: OrderStatus;
    changedAt: string;
    changedBy: string;
}

export interface Address {
    _id: string;
    label: "home" | "work" | "other";
    addressText: string;
    isDefault: boolean;
}

export interface Testimonial {
    _id: string;
    userId: string | User;
    comment: string;
    stars: number;
    status: "pending" | "approved" | "refused";
    isApproved: boolean;
    createdAt: string;
}

export interface Review {
    _id: string;
    productId: string;
    userId: string | User;
    stars: number;
    comment: string;
    images: string[];
    isVerified: boolean;
    isApproved: boolean;
    createdAt: string;
}

export interface RatingSummary {
    average: number;
    total: number;
    breakdown: Record<number, number>;
}

export interface HomeSlide {
    _id?: string;
    image: string;
    label: string;
    title: string;
    description: string;
    cta: string;
    link: string;
    order: number;
    isActive: boolean;
}

export interface SiteConfig {
    _id?: string;
    campaignTag: string;
    campaignTitle: string;
    campaignDescription: string;
    campaignBtnText: string;
    campaignBtnLink: string;
}
export interface NavSubcategory {
  _id:      string;
  title:    string;
  slug:     string;
  isActive: boolean;
}
export interface NavCategory {
  _id:           string;
  title:         string;
  slug:          string;
  isActive:      boolean;
  subcategories: NavSubcategory[];
}
