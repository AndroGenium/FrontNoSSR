import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class Inter {
  
}
export interface Product {
  id?: number;
  name?: string;
  category?: string;
  views: number;
  description?: string;
  isAvailable? :boolean;
  isDonateable: boolean;
  moneyRaised?: number;
  lenderId?: number;
  lender? : User;
  borrowerId?: number;
  borrower? : User;
  likedByUsers?: User[];
  imageUrls?: string[];
  reviews?: Review[];
}
export interface User{
  id?: number;
  password?: string;
  firstName?: string;
  lastName?: string;
  phoneNumber?: string;
  email?: string;
  dateOfBirth?: Date;
  age?: number;
  profilePictureUrl?: string;
  bio?: string;
  location?: string;
  permisions?: UserRole;
  balance?: number;
  avarageRating?: number;
  listedProducts?: Product[];
  borrowedProducts?: Product[];
  likedProducts?: Product[];
  reviews?: Review[];
  isVerified?: boolean;
  isBanned?: boolean;
  lastLogin?: Date;
  dateCreated?: Date;
}
export interface Review{
  id?: number;
  productId?: number;
  userId?: number;
  dateCreated?: Date;
  title?: string;
  content?: string;
  rating?: number;
}

export interface ApiResponse{
  code: number;
  message: string;
  data?: any;
}


export enum UserRole
{
  Guest,
  User,
  Admin
}

