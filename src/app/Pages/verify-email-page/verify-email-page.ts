import { Component, OnInit,OnDestroy,ViewChildren, QueryList, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
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
    private authService: AuthService,
    private localUserService: LocalUserService
  ) {}

 ngOnInit(): void {
  const pending = this.localUserService.pendingEmail;
  if (!pending) {
    // No email to verify, send back to signup
    this.router.navigate(['/Signup']);
    return;
  }

  this.userEmail = pending;
  this.startResendTimer();
}

  ngOnDestroy(): void {
    if (this.timerInterval) clearInterval(this.timerInterval);
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

    if (value && index < 5) {
      this.codeInputs.toArray()[index + 1].nativeElement.focus();
    }

    if (this.codeValues.every(val => val !== '')) {
      this.onVerify();
    }
  }

  onKeyDown(event: KeyboardEvent, index: number): void {
    const input = event.target as HTMLInputElement;
    if (event.key === 'Backspace' && !input.value && index > 0) {
      const prev = this.codeInputs.toArray()[index - 1];
      prev.nativeElement.focus();
      prev.nativeElement.value = '';
      this.codeValues[index - 1] = '';
    }
  }

  onPaste(event: ClipboardEvent, index: number): void {
    event.preventDefault();
    const pastedData = event.clipboardData?.getData('text').slice(0, 6) || '';
    const digits = pastedData.match(/\d/g);

    if (digits) {
      digits.forEach((digit, idx) => {
        const input = this.codeInputs.toArray()[idx];
        if (input) {
          input.nativeElement.value = digit;
          this.codeValues[idx] = digit;
        }
      });
      if (digits.length === 6) this.onVerify();
    }
  }

  async onVerify(): Promise<void> {
    const code = this.codeValues.join('');
    if (code.length !== 6) return;

    this.isVerifying = true;
    this.showError = false;
    this.showSuccess = false;

    try {
      const response = await this.authService.verifyEmail(this.userEmail, code);
      this.showSuccess = true;
      this.successMessage = response.Message || 'Email verified successfully!';

      setTimeout(() => this.router.navigate(['/Login']), 1500);
    } catch (err: any) {
      this.showError = true;
      this.errorMessage = err.error || 'Invalid code';
      this.clearInputs();
    } finally {
      this.isVerifying = false;
    }
  }

  async onResend(): Promise<void> {
    if (this.resendDisabled) return;

    try {
      await this.authService.resendVerificationCode(this.userEmail);
      this.startResendTimer();
      alert('New code sent! Check your email.');
    } catch (err) {
      console.error(err);
      alert('Failed to resend code. Try again.');
    }
  }

  private startResendTimer(): void {
    this.resendDisabled = true;
    this.resendTimer = 60;
    this.timerInterval = setInterval(() => {
      this.resendTimer--;
      this.timerDisplay = `Resend available in ${this.resendTimer}s`;
      if (this.resendTimer <= 0) {
        clearInterval(this.timerInterval);
        this.resendDisabled = false;
        this.timerDisplay = '';
      }
    }, 1000);
  }

  private clearInputs(): void {
    this.codeValues = ['', '', '', '', '', ''];
    this.codeInputs.toArray().forEach(input => input.nativeElement.value = '');
    this.codeInputs.first.nativeElement.focus();
  }

  hasValue(index: number): boolean {
    return this.codeValues[index] !== '';
  }
}
