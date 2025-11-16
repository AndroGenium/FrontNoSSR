import { Component, OnInit, OnDestroy, ViewChildren, QueryList, ElementRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../Services/auth-service';
import { LocalUserService } from '../../Services/local-user-service';

@Component({
  selector: 'app-verify-email-page',
  standalone: false,
  templateUrl: './verify-email-page.html',
  styleUrl: './verify-email-page.scss',
})
export class VerifyEmailPage implements OnInit, OnDestroy {
  @ViewChildren('codeInput') codeInputs!: QueryList<ElementRef<HTMLInputElement>>;

  userEmail: string = '';
  errorMessage: string = '';
  successMessage: string = '';
  showError: boolean = false;
  showSuccess: boolean = false;
  isVerifying: boolean = false;
  
  resendTimer: number = 60;
  resendDisabled: boolean = true;
  timerDisplay: string = '';
  private timerInterval: any;

  codeValues: string[] = ['', '', '', '', '', ''];

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private authService: AuthService,
    private localUserService: LocalUserService
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const email = params.get('email');
      if (email) {
        this.userEmail = email;
        console.log('📧 Loaded verify page for:', this.userEmail);
      }
    });

    this.startResendTimer();

    setTimeout(() => {
      const inputs = this.codeInputs?.toArray();
      if (inputs && inputs.length > 0) {
        inputs[0].nativeElement.focus();
      }
    }, 100);
  }

  ngOnDestroy(): void {
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
    }
  }

  onInput(event: Event, index: number): void {
    const input = event.target as HTMLInputElement;
    const value = input.value;

    if (!/^\d$/.test(value)) {
      input.value = '';
      this.codeValues[index] = '';
      return;
    }

    this.codeValues[index] = value;
    this.showError = false;

    // Just move to next input, no auto-submit
    if (value && index < 5) {
      const inputs = this.codeInputs.toArray();
      inputs[index + 1].nativeElement.focus();
    }
  }

  onKeyDown(event: KeyboardEvent, index: number): void {
    const input = event.target as HTMLInputElement;

    if (event.key === 'Backspace' && !input.value && index > 0) {
      const inputs = this.codeInputs.toArray();
      inputs[index - 1].nativeElement.focus();
      this.codeValues[index - 1] = '';
      inputs[index - 1].nativeElement.value = '';
    }
  }

  onPaste(event: ClipboardEvent, index: number): void {
    event.preventDefault();
    const pastedData = event.clipboardData?.getData('text').slice(0, 6) || '';
    const digits = pastedData.match(/\d/g);

    if (digits) {
      const inputs = this.codeInputs.toArray();
      digits.forEach((digit, idx) => {
        if (inputs[idx]) {
          this.codeValues[idx] = digit;
          inputs[idx].nativeElement.value = digit;
        }
      });

      if (digits.length === 6) {
        inputs[5].nativeElement.focus();
        // No auto-submit, just fill the inputs
      }
    }
  }

  // Only verify when button is clicked
  async onVerify(): Promise<void> {
    const code = this.codeValues.join('');

    if (code.length !== 6) {
      this.showError = true;
      this.errorMessage = 'Please enter all 6 digits';
      return;
    }

    if (this.isVerifying) {
      return;
    }

    this.isVerifying = true;
    this.showError = false;
    this.showSuccess = false;

    try {
      console.log('🔍 Verifying:', this.userEmail, code);

      const response = await this.authService.verifyEmailCode(this.userEmail, code);

      console.log('✅ Verify response:', response);

      this.showSuccess = true;
      this.successMessage = '✓ Email verified!';

      if (response.token) {
        localStorage.setItem('token', response.token);
        console.log('🔑 Token saved');
      }

      this.localUserService.refreshUser();

      setTimeout(() => {
        this.router.navigate(['/home']);
      }, 1500);

    } catch (error: any) {
      console.error('❌ Verification failed:', error);
      this.showError = true;
      this.errorMessage = error?.error?.message || error?.error?.Message || 'Invalid code. Please try again.';
      this.clearInputs();
    } finally {
      this.isVerifying = false;
    }
  }

  async onResend(): Promise<void> {
    if (this.resendDisabled) {
      return;
    }

    try {
      await this.authService.resendVerificationCode(this.userEmail);

      this.startResendTimer();

      this.showSuccess = true;
      this.successMessage = 'Code resent! Check your email.';
      
      setTimeout(() => {
        this.showSuccess = false;
      }, 3000);

    } catch (error: any) {
      console.error('❌ Resend failed:', error);
      this.showError = true;
      this.errorMessage = 'Failed to resend code. Please try again.';
    }
  }

  private startResendTimer(): void {
    this.resendDisabled = true;
    this.resendTimer = 60;

    if (this.timerInterval) {
      clearInterval(this.timerInterval);
    }

    this.timerInterval = setInterval(() => {
      this.resendTimer--;
      this.timerDisplay = `Resend in ${this.resendTimer}s`;

      if (this.resendTimer <= 0) {
        clearInterval(this.timerInterval);
        this.resendDisabled = false;
        this.timerDisplay = '';
      }
    }, 1000);
  }

  private clearInputs(): void {
    this.codeValues = ['', '', '', '', '', ''];
    const inputs = this.codeInputs.toArray();
    inputs.forEach(input => {
      input.nativeElement.value = '';
    });
    if (inputs.length > 0) {
      inputs[0].nativeElement.focus();
    }
  }

  hasValue(index: number): boolean {
    return this.codeValues[index] !== '';
  }

  goBack(): void {
    this.router.navigate(['/']);
  }
}