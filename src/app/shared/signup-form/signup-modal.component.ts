import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  Output,
  ViewChild,
} from '@angular/core';
import { AuthService } from '../../core/services/auth.service';

import { ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'til-signup-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './signup-modal.component.html',
  styleUrls: ['./signup-modal.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SignupModalComponent {
  @Output() closeModal = new EventEmitter<void>();
  @ViewChild('signupModal')
  signupModal: ElementRef<HTMLDialogElement> | undefined;

  role: string = '';
  emailId: string = '';
  phoneNumber: string = '';
  password: string = '';
  name: string = '';
  location: string = '';
  otpField: string = '';

  otpDisplay = false; // This would be controlled based on logic to display the OTP form

  constructor(private readonly authService: AuthService, private cdr: ChangeDetectorRef) { }

  @Input()
  set show(value: boolean | undefined) {
    if (this.signupModal?.nativeElement && value) {
      this.signupModal.nativeElement.showModal();
    }
  }

  onClose(): void {
    this.signupModal?.nativeElement.close();
    this.closeModal.emit();
  }

  // Other variables...
  // errorMessage: string | null = null; // Ensure this is a string or null for no message
  private _errorMessage: string | null = null;

  get errorMessage(): string | null {
    return this._errorMessage;
  }

  set errorMessage(value: string | null) {
    this._errorMessage = value;
  }
  onSignup(): void {
    if (!this.role || !this.emailId || !this.phoneNumber || !this.password || !this.name || !this.location) {
      return;
    }

    const signupPayload = {
      role: this.role,
      emailId: this.emailId,
      phoneNumber: this.phoneNumber,
      password: this.password,
      name: this.name,
      location: this.location,
    };
    this.authService.signup(signupPayload).subscribe({
      next: (response) => {
        if (response.isSuccess === true) {
          this.otpDisplay = true;
          this.errorMessage = null; // Clear any previous error messages
        } else {
          this.errorMessage = 'Signup was not successful. Please try again.';
          this.otpDisplay = false;
        }
        this.cdr.detectChanges();
      },
      error: (error) => {
        this.errorMessage = error.error?.data || 'Signup failed. Please try again.';
        console.error('Signup failed', error);
        this.cdr.detectChanges(); // Trigger change detection
      },
    });
  }

  onOtpSignup() {
    if (this.otpField.length === 6) {
      const otpRequest = {
        emailId: this.emailId,
        otp: this.otpField
      }
      this.authService.verifyOtp(otpRequest).subscribe({
        next: (response) => {
          if (response.isSuccess === true) {
            this.errorMessage = null; // Clear any previous error messages
            this.onClose();
          } else {
            this.errorMessage = 'Signup was not successful. Please try again.';
          }
          this.cdr.detectChanges();
        },
        error: (error) => {
          this.errorMessage = error.error?.data || 'OTP verify failed. Please try again.';
          console.error('Signup failed', error);
          this.cdr.detectChanges(); // Trigger change detection
        },
      });
      // Perform OTP validation and sign-up logic here
    } else {
      console.log("Invalid OTP length");
    }
  }

}