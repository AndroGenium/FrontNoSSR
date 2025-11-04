import { Product, User } from './../Interfaces/inter';
import { Injectable } from '@angular/core';
import { UserRole } from '../Interfaces/inter';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LocalUserService {
  
  private readonly STORAGE_KEY = "localUser";
  private readonly GUEST_KEY = "guestLikedProducts";
  private readonly PENDING_EMAIL_KEY = "pendingEmail";

  user: User | null = null;
  guestLikedProducts: Product[] = [];
  pendingEmail: string | null = null;

  private userSubject = new BehaviorSubject<User | null>(null);
  user$ = this.userSubject.asObservable();

  constructor() {
    this.loadFromStorage();
    this.userSubject.next(this.user);

    window.addEventListener('beforeunload', () => {
      this.saveToStorage();
    });
  }

  private loadFromStorage() {
    const userData = localStorage.getItem(this.STORAGE_KEY);
    const guestLikes = localStorage.getItem(this.GUEST_KEY);
    const pendingEmail = localStorage.getItem(this.PENDING_EMAIL_KEY);

    if (userData) this.user = JSON.parse(userData);
    if (guestLikes) this.guestLikedProducts = JSON.parse(guestLikes);
    if (pendingEmail) this.pendingEmail = pendingEmail;
  }

  private saveToStorage() {
    if (this.user) {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.user));
      localStorage.removeItem(this.GUEST_KEY);
    } else {
      localStorage.removeItem(this.STORAGE_KEY);
      localStorage.setItem(this.GUEST_KEY, JSON.stringify(this.guestLikedProducts));
    }

    if (this.pendingEmail) {
      localStorage.setItem(this.PENDING_EMAIL_KEY, this.pendingEmail);
    } else {
      localStorage.removeItem(this.PENDING_EMAIL_KEY);
    }
  }

  // Check if current user is guest
  get isGuest(): boolean {
    return !this.user;
  }

  // Get liked products (guest or user)
  get likedProducts(): Product[] {
    return this.user ? this.user.likedProducts || [] : this.guestLikedProducts;
  }

  // Add a liked product
  addLikedProduct(product: Product): void {
    if (this.user) {
      this.user.likedProducts = this.user.likedProducts || [];
      if (!this.user.likedProducts.some(p => p.id === product.id)) {
        this.user.likedProducts.push(product);
      }
    } else {
      if (!this.guestLikedProducts.some(p => p.id === product.id)) {
        this.guestLikedProducts.push(product);
      }
    }

    this.saveToStorage();
    this.userSubject.next(this.user);
  }

  // Set the current user and merge guest likes
  setUser(user: User): void {
    if (this.guestLikedProducts.length > 0) {
      user.likedProducts = [
        ...(user.likedProducts || []),
        ...this.guestLikedProducts.filter(
          g => !user.likedProducts?.some(u => u.id === g.id)
        )
      ];
    }

    this.user = user;
    this.guestLikedProducts = [];
    this.pendingEmail = null;

    this.saveToStorage();
    this.userSubject.next(this.user);
  }

  // Log out current user
  logoutUser(): void {
    this.user = null;
    this.pendingEmail = null;
    this.saveToStorage();
    this.userSubject.next(this.user);
  }

  // Get current user
  getUser(): User | null {
    return this.user;
  }
}