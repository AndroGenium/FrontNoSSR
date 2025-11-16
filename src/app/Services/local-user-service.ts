import { Injectable } from '@angular/core';
import { Product, User, UserRole } from '../Interfaces/inter';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LocalUserService {
  
  private readonly GUEST_KEY = "guestLikedProducts";
  private readonly PENDING_EMAIL_KEY = "pendingEmail";

  guestLikedProducts: Product[] = [];
  pendingEmail: string | null = null;

  // User info from JWT token (not stored separately anymore)
  private userSubject = new BehaviorSubject<User | null>(null);
  user$ = this.userSubject.asObservable();

  constructor() {
    this.loadFromStorage();
    this.loadUserFromToken(); // Load from JWT token
  }

  private loadFromStorage() {
    const guestLikes = localStorage.getItem(this.GUEST_KEY);
    const pendingEmail = localStorage.getItem(this.PENDING_EMAIL_KEY);

    if (guestLikes) this.guestLikedProducts = JSON.parse(guestLikes);
    if (pendingEmail) this.pendingEmail = pendingEmail;
  }

  private saveGuestData() {
    localStorage.setItem(this.GUEST_KEY, JSON.stringify(this.guestLikedProducts));
    
    if (this.pendingEmail) {
      localStorage.setItem(this.PENDING_EMAIL_KEY, this.pendingEmail);
    } else {
      localStorage.removeItem(this.PENDING_EMAIL_KEY);
    }
  }

  // Load user from JWT token
  private loadUserFromToken() {
    const token = this.getToken();
    if (!token) {
      this.userSubject.next(null);
      return;
    }

    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const user: User = {
        id: parseInt(payload.nameid),
        email: payload.email,
        firstName: payload.given_name || '', // Optional: add to JWT claims
        lastName: payload.family_name || '',  // Optional: add to JWT claims
        role: payload.role as UserRole,
        likedProducts: [], // Load from backend when needed
        dateCreated: new Date()
      };
      
      this.userSubject.next(user);
    } catch (error) {
      console.error('Failed to decode token:', error);
      this.userSubject.next(null);
    }
  }

  // Get token from storage
  private getToken(): string | null {
    return localStorage.getItem('token') || sessionStorage.getItem('token');
  }

  // Check if user is logged in
  get isLoggedIn(): boolean {
    return !!this.getToken();
  }

  // Check if current user is guest
  get isGuest(): boolean {
    return !this.isLoggedIn;
  }

  // Get current user
  getUser(): User | null {
    if (!this.isLoggedIn) return null;
    this.loadUserFromToken();
    return this.userSubject.value;
  }

  // Get user role from token
  getUserRole(): UserRole {
    const token = this.getToken();
    if (!token) return UserRole.Guest;

    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.role as UserRole;
    } catch {
      return UserRole.Guest;
    }
  }

  // Get user ID from token
  getUserId(): number | null {
    const token = this.getToken();
    if (!token) return null;

    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return parseInt(payload.nameid);
    } catch {
      return null;
    }
  }

  // Get user email from token
  getUserEmail(): string | null {
    const token = this.getToken();
    if (!token) return null;

    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.email;
    } catch {
      return null;
    }
  }

  // Guest liked products (still useful!)
  get likedProducts(): Product[] {
    return this.guestLikedProducts;
  }

  // Add liked product (guest only - logged in users should use API)
  addLikedProduct(product: Product): void {
    if (this.isGuest) {
      if (!this.guestLikedProducts.some(p => p.id === product.id)) {
        this.guestLikedProducts.push(product);
        this.saveGuestData();
      }
    } else {
      // For logged-in users, call backend API
      console.warn('Use API to save liked products for logged-in users');
      // this.http.post('/api/liked-products', { productId: product.id })
    }
  }

  // Remove liked product (guest only)
  removeLikedProduct(productId: number): void {
    if (this.isGuest) {
      this.guestLikedProducts = this.guestLikedProducts.filter(p => p.id !== productId);
      this.saveGuestData();
    }
  }

  // Get guest liked products to sync with backend after login
  getGuestLikedProducts(): Product[] {
    return [...this.guestLikedProducts];
  }

  // Clear guest data after syncing with backend
  clearGuestData(): void {
    this.guestLikedProducts = [];
    localStorage.removeItem(this.GUEST_KEY);
  }

  // Refresh user from token (call after login/verify)
  refreshUser(): void {
    this.loadUserFromToken();
  }

  // Set pending email (for registration flow)
  setPendingEmail(email: string): void {
    this.pendingEmail = email;
    localStorage.setItem(this.PENDING_EMAIL_KEY, email);
  }

  // Clear pending email
  clearPendingEmail(): void {
    this.pendingEmail = null;
    localStorage.removeItem(this.PENDING_EMAIL_KEY);
  }

  // Logout (call this from AuthService.logout())
  logout(): void {
    this.pendingEmail = null;
    localStorage.removeItem(this.PENDING_EMAIL_KEY);
    this.userSubject.next(null);
    // Guest liked products are kept!
  }
}