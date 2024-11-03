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
  styleUrls: ['./profile.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProfileComponent {
  readonly usernameControl: FormControl;
  readonly user$ = this.userService.user$;

  constructor(private readonly userService: UserService, private router: Router) {
    this.usernameControl = new FormControl('', {
      validators: [Validators.minLength(3), Validators.maxLength(30)],
    });

    // Subscribe to user$ to log user details
    this.user$.subscribe(user => {
      console.log("User details from profile:", user);
    });
  }

  // Change username function with form validation
  changeUsername() {
    if (this.usernameControl.valid) {
      const newUsername = this.usernameControl.value;
      console.log('Changing username to:', newUsername);
      // Additional logic to update the username
    }
  }

  // Navigation methods
  goToEditProfile() {
    this.router.navigateByUrl('/tutorprofile-edit');
  }

  goToCreateCourse() {
    this.router.navigateByUrl('/create-course');
  }

  goToAddEducation() {
    this.router.navigateByUrl('/add-education');
  }

  goToAddWork() {
    this.router.navigateByUrl('/add-experience');
  }
}
