import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom, Observable, tap } from 'rxjs';
import { LocalUserService } from './local-user-service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private baseUrl = 'https://localhost:7244/api/Auth';

  constructor(private http: HttpClient, private localUser: LocalUserService) { }

  registerUser(userData: any) {
    return this.http.post(`${this.baseUrl}/register-user`, userData);
  }

  login(credentials: { email: string; password: string }) {
    return this.http.post(`${this.baseUrl}/login-user`, credentials)
      .pipe(
        tap((user: any) => {
          this.localUser.setUser(user); // this merges guest likes etc.
        })
      );
  }

  logout(){
    this.localUser.logoutUser()
  }

  verifyEmail(email: string, code: string): Promise<any> {
    return firstValueFrom(this.http.post(`${this.baseUrl}/verify-email`, { email, code }));
  }
  resendVerificationCode(email: string): Observable<any> {
    // Since backend doesn’t have a separate resend, we can just call register again or implement a separate endpoint
    return this.http.post(`${this.baseUrl}/register-user`, { email });
  }
}
