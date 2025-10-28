import { Injectable } from '@angular/core';
import { UserRole } from '../Interfaces/inter'; 
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {
   private userTypeSubject = new BehaviorSubject<UserRole>(UserRole.Guest);
  userRole$ = this.userTypeSubject.asObservable();

  get userRole(): UserRole {
    return this.userTypeSubject.value;
  }

  setUserRole(type: UserRole) {
    this.userTypeSubject.next(type);
    localStorage.setItem('userRole', UserRole[type]);
  }

  loadUserRole() {
    const saved = localStorage.getItem('userRole');
    if (saved) {
      const role = (UserRole as any)[saved];
      if (role) this.userTypeSubject.next(role);
    }
  }

   logout() {
    localStorage.removeItem('userRole');
    this.userTypeSubject.next(UserRole.Guest);
  }

  isGuest(): boolean {
    return this.userTypeSubject.value === UserRole.Guest;
  }
}
