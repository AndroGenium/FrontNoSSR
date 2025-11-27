import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class Inter {
  
}
export interface Product {
  id?: number;
  name?: string;
  views: number;
  description?: string;
  isAvailable? :boolean;
  isDonateable: boolean;
  moneyRaised?: number;
  lenderEmail?:string;
  lenderId?: number;
  lender? : User;
  borrowerEmail?:string;
  borrowerId?: number;
  borrower? : User;
  likedByUsers?: User[];
  likedByUserIds?: number[];
  likedByUserEmails?: string[];
  imageUrls?: string[];
  ratingSum?: number;
  ratingCount?: number;
  avarageRating?: number;
  categories: ProductCategory[];
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
  role?: UserRole;
  balance?: number;
  avarageRating?: number;
  listedProducts?: Product[];
  borrowedProducts?: Product[];
  likedProducts?: Product[];
  isVerified?: boolean;
  isBanned?: boolean;
  lastLogin?: Date;
  dateCreated?: Date;
}
// export interface Review{
//   id?: number;
//   productId?: number;
//   userId?: number;
//   dateCreated?: Date;
//   title?: string;
//   content?: string;
//   rating?: number;
// }

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

export enum ProductCategory
{
    PowerTools,
    HandTools,
    GardeningTools,
    ElectronicTools,
    MeasuringTools,
    AutomotiveTools,
    CleaningTools,   
    PlumbingTools,
    Machinery,
    Other,
}

