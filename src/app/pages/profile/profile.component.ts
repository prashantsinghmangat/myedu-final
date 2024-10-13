import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import {
  FormControl,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { UserService } from '../../core/services/user.service';

import { Router } from '@angular/router';

@Component({
  selector: 'til-profile',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'], // Fixed: Changed styleUrl to styleUrls
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProfileComponent {
  readonly usernameControl: FormControl;
  readonly user$ = this.userService.user$;

  constructor(private readonly userService: UserService, private router: Router,) {
    this.usernameControl = new FormControl('', {
      validators: [Validators.minLength(3), Validators.maxLength(30)],
    });

    // Subscribe to user$ to log the user details correctly
    this.user$.subscribe(user => {
      console.log("User details from profile:", user);
    });
  }

  changeUsername() {
    // TODO: implement logic to change username
    if (this.usernameControl.valid) {
      const newUsername = this.usernameControl.value;
      console.log('Changing username to:', newUsername);
      // Implement username change logic here
    }
  }

  goToEditProfile() {
    this.router.navigateByUrl('/tutorprofile-edit');
  }

}