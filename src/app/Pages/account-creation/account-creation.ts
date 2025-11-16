import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { User, UserRole } from '../../Interfaces/inter';
import { AuthService } from '../../Services/auth-service';
import { LocalUserService } from '../../Services/local-user-service';
import { Router } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-account-creation',
  standalone: false,
  templateUrl: './account-creation.html',
  styleUrl: './account-creation.scss',
})
export class AccountCreation implements OnInit {
  registerForm!: FormGroup;
  submitting = false;
  errorMsg: string = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private localUserService: LocalUserService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.registerForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      dob: [''],
      password: ['', Validators.required],
      terms: [false, Validators.requiredTrue]
    });
  }

  async submit() {
    if (this.registerForm.invalid) return;

    this.submitting = true;
    this.errorMsg = '';

    const formData = this.registerForm.value;

    try {
      const response: any = await this.authService.registerUser({
        FirstName: formData.firstName,
        LastName: formData.lastName,
        Email: formData.email,
        BirthDate: formData.dob,
        password: formData.password,
      });

      console.log('✅ Register response:', response);
      console.log('📧 Navigating to verify-email for:', formData.email);

      this.router.navigate(['/Verify', formData.email]);

    } catch (err: any) {
      console.error('❌ Registration failed:', err);
      this.errorMsg = err?.error?.Message || err?.error?.message || 'Something went wrong. Please try again.';
    } finally {
      this.submitting = false;
    }
  }
}