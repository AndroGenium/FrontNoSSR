import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../Services/auth-service';
import { LocalUserService } from '../../Services/local-user-service';

@Component({
  selector: 'app-login',
  standalone: false,
  templateUrl: './login.html',
  styleUrl: './login.scss',
})
export class Login {
  loginForm!: FormGroup;
  submitting = false;
  errorMsg: string = '';
  showError = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private localUserService: LocalUserService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
      remember: [false]
    });
  }

  async onSubmit(): Promise<void> {
    if (this.loginForm.invalid) {
      this.showError = true;
      this.errorMsg = 'Please fill in all required fields';
      return;
    }

    this.submitting = true;
    this.showError = false;
    this.errorMsg = '';

    const { email, password, remember } = this.loginForm.value;

    try {
      const response = await this.authService.login(email, password);

      console.log('✅ Login response:', response);

      if (remember) {
        localStorage.setItem('token', response.token);
      } else {
        sessionStorage.setItem('token', response.token);
      }

      this.localUserService.refreshUser();

      await this.router.navigate(['/']);

    } catch (error: any) {
      console.error('❌ Login failed:', error);
      this.showError = true;
      this.errorMsg = error?.error?.message || error?.error?.Message || 'Invalid email or password. Please try again.';
    } finally {
      this.submitting = false;
    }
  }

  navigateToRegister(): void {
    this.router.navigate(['/Signup']);
  }

  navigateToForgotPassword(): void {
    this.router.navigate(['/forgot-password']);
  }

  continueAsGuest(): void {
    this.router.navigate(['/']);
  }

  get email() {
    return this.loginForm.get('email');
  }

  get password() {
    return this.loginForm.get('password');
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.loginForm.get(fieldName);
    return !!(field && field.invalid && (field.dirty || field.touched));
  }

  getErrorMessage(fieldName: string): string {
    const field = this.loginForm.get(fieldName);
    
    if (field?.hasError('required')) {
      return `${fieldName.charAt(0).toUpperCase() + fieldName.slice(1)} is required`;
    }
    
    if (field?.hasError('email')) {
      return 'Please enter a valid email address';
    }
    
    return '';
  }
}