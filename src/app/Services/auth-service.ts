import { Router } from '@angular/router';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom, Observable, tap } from 'rxjs';
import { LocalUserService } from './local-user-service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private baseUrl = 'https://localhost:7244/api/Auth';

  constructor(private http: HttpClient, private localUserService: LocalUserService, private router: Router) { }

  async registerUser(userData: any): Promise<any> {
    return await firstValueFrom(
      this.http.post(`${this.baseUrl}/register-user`, userData)
    );
  }

  async login(email: string, password: string): Promise<any> {
    const response = await firstValueFrom(
      this.http.post<any>(`${this.baseUrl}/login`, { email, password })
    );
    return response;
  }

  async verifyEmailCode(email: string, code: string): Promise<any> {
    const response = await firstValueFrom(
      this.http.post<any>(`${this.baseUrl}/verify-email`, { email, code })
    );
    return response;
  }

  async resendVerificationCode(email: string): Promise<any> {
    return await firstValueFrom(
      this.http.post(`${this.baseUrl}/resend-code`, { email })
    );
  }

  getToken(): string | null {
    return localStorage.getItem('token') || sessionStorage.getItem('token');
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  async logout() {
    localStorage.removeItem('token');
    sessionStorage.removeItem('token');
    this.localUserService.logout();
    await this.router.navigate(['/Login']);
  }

  getUserFromToken(): any {
    const token = this.getToken();
    if (!token) return null;

    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return {
        id: payload.nameid,
        email: payload.email,
        role: payload.role
      };
    } catch {
      return null;
    }
  }
}