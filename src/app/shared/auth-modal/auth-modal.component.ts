import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; // Import FormsModule
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
import { SupportedOauthProviders } from '../../core/models/auth.model';
import { navButtons } from './nav-buttons';

import { ApiUser } from '../../core/models/api.model';
import { UserService } from '../../core/services/user.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'til-auth-modal',
  standalone: true,
  imports: [CommonModule, FormsModule], // Add FormsModule here
  templateUrl: './auth-modal.component.html',
  styleUrl: './auth-modal.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AuthModalComponent {
  @Output() closeModal = new EventEmitter<void>();
  @ViewChild('authModal')
  authModal: ElementRef<HTMLDialogElement> | undefined;

  readonly buttons = navButtons;
  readonly SupportedOauthProviders = SupportedOauthProviders;

  username: string = ''; // Add these fields for form binding
  password: string = '';

  constructor(private readonly authService: AuthService, private readonly userService: UserService,
    private readonly router: Router,
    private route: ActivatedRoute,
  ) { }

  @Input()
  set show(value: boolean | undefined) {
    if (this.authModal?.nativeElement && value) {
      this.authModal.nativeElement.showModal();
    }
  }

  onClose(): void {
    this.authModal?.nativeElement.close();
    this.closeModal.emit();
  }

  onAuth(type: SupportedOauthProviders): void {
    switch (type) {
      case SupportedOauthProviders.GOOGLE:
        this.authService.signInWithGoogle();
        break;
      case SupportedOauthProviders.LINKEDIN:
        this.authService.signInWithLinkedin();
        break;
      default:
        break;
    }
  }

  onLogin(): void {
    if (this.username && this.password) {

      const loginPayload = {
        emailId: this.username,
        password: this.password
      };

      this.authService.login(loginPayload).subscribe({
        next: (response) => {
          const loginResponse = response.data as ApiUser;
          localStorage.setItem('isLoggedIn', '1');
          this.userService.isLogin(loginResponse)
          console.log("loginResponse: ", loginResponse)
          this.userService.setUser(loginResponse);
          this.router.navigate(['/']);
          this.onClose(); // Close modal after successful login
        },
        error: (error) => {
          localStorage.removeItem('isLoggedIn');
          if (!error?.code) {
            this.router.navigate(['/']);
          } else {
            this.router.navigate(['/'], {
              queryParams: error?.data?.provider
                ? { error: error.code, wantedProvider: error.data.provider }
                : { error: error.code },
            });
          }
          console.error('Login failed', error);
        },
      });
    }
  }
}


// import { CommonModule } from '@angular/common';
// import {
//   ChangeDetectionStrategy,
//   Component,
//   ElementRef,
//   EventEmitter,
//   Input,
//   Output,
//   ViewChild,
// } from '@angular/core';
// import { SupportedOauthProviders } from '../../core/models/auth.model';
// import { AuthService } from '../../core/services/auth.service';
// import { navButtons } from './nav-buttons';

// @Component({
//   selector: 'til-auth-modal',
//   standalone: true,
//   imports: [CommonModule],
//   templateUrl: './auth-modal.component.html',
//   styleUrl: './auth-modal.component.scss',
//   changeDetection: ChangeDetectionStrategy.OnPush,
// })
// export class AuthModalComponent {
//   @Output() closeModal = new EventEmitter<void>();
//   @ViewChild('authModal')
//   authModal: ElementRef<HTMLDialogElement> | undefined;

//   readonly buttons = navButtons;
//   readonly SupportedOauthProviders = SupportedOauthProviders;

//   constructor(private readonly authService: AuthService) {}

//   @Input()
//   set show(value: boolean | undefined) {
//     if (this.authModal?.nativeElement && value) {
//       this.authModal.nativeElement.showModal();
//     }
//   }

//   onClose(): void {
//     this.authModal?.nativeElement.close();
//     this.closeModal.emit();
//   }

//   onAuth(type: SupportedOauthProviders): void {
//     switch (type) {
//       case SupportedOauthProviders.GOOGLE:
//         this.authService.signInWithGoogle();
//         break;
//       case SupportedOauthProviders.GITHUB:
//         this.authService.signInWithGithub();
//         break;
//       case SupportedOauthProviders.LINKEDIN:
//         this.authService.signInWithLinkedin();
//         break;
//       default:
//         break;
//     }
//   }
// }
