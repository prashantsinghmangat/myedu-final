import { CommonModule, isPlatformBrowser } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  Inject,
  PLATFORM_ID,
  signal,
} from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { take, tap } from 'rxjs';
import { AuthService } from '../../core/services/auth.service';
import { UserService } from '../../core/services/user.service';
import { AuthModalComponent } from '../auth-modal/auth-modal.component';
import { SignupModalComponent } from '../signup-form/signup-modal.component';

@Component({
  selector: 'til-navbar',
  standalone: true,
  imports: [AuthModalComponent, CommonModule, RouterModule, SignupModalComponent],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NavbarComponent {
  showAuthModalSig = signal(false);
  showSignUpSig = signal(false);

  user$ = this.userService.user$;

  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
    private readonly router: Router,
    @Inject(PLATFORM_ID) private readonly platformId: string,
  ) {
    // this.loadUser();
    if (typeof window !== 'undefined') {
      if (localStorage.getItem('isLoggedIn')) {
        this.userService.getUserData()
      }
    }
  }

  logout(): void {
    this.userService.clearUser();
    localStorage.removeItem('user');
    // this.authService.logout().pipe(take(1)).subscribe(() => {
      this.router.navigate(['/']).then(() => {
        // Reload the browser
        window.location.reload();
      });
    // });
  }

  toggleAuthModal(): void {
    this.showAuthModalSig.update((value) => !value);
  }

  // toggleSignUpModal(): void {
  //   this.showSignUpSig.update((value) => !value);
  // }

  toggleSignUpModal() {
    this.router.navigate(['/tutor-page']);
  }
  
  closeMenu() {
    (document.activeElement as any)?.blur();
  }

  // private loadUser() {
  //   this.userService
  //     .getUser()
  //     .pipe(
  //       take(1),
  //       tap(() => {
  //         if (isPlatformBrowser(this.platformId)) {
  //           localStorage.setItem('isLoggedIn', '1');
  //         }
  //       }),
  //     )
  //     .subscribe();
  // }
}
