import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import {
  FormControl,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { UserService } from '../../core/services/user.service';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { PostsService } from '../../core/services/posts.service';
import { ChangeDetectorRef } from '@angular/core';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';

import { catchError, of, tap } from 'rxjs';

@Component({
  selector: 'til-profile',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProfileComponent implements OnInit {
  readonly usernameControl: FormControl;
  readonly user$ = this.userService.user$;

  constructor(
    private readonly userService: UserService,
    private router: Router, private cdr: ChangeDetectorRef, private readonly postsService: PostsService,
    private http: HttpClient ,// Inject HttpClient for making HTTP requests
    private sanitizer: DomSanitizer // Inject the DomSanitizer service
  ) 
  
  
  
  
  {
    this.usernameControl = new FormControl('', {
      validators: [Validators.minLength(3), Validators.maxLength(30)],
    });

    // Subscribe to user$ to log user details
    this.user$.subscribe(user => {
      console.log("User details from profile:", user);
    });
  }

  getSafeImageUrl(url: string): SafeUrl {
    return this.sanitizer.bypassSecurityTrustUrl(url);
  }

  ngOnInit(): void {
    this.getEductaionDetails();
    this.getTutorProfile(); // Call the API when the component initializes
    this.getExperianceDetails();
    this.getCourcesList();
  }

  coursedata: any
  getCourcesList(): void {
    console.log("api called")
    this.postsService.allCourseList().pipe(
      tap((coursedata: any) => {
        console.log("coursedata profile : ", coursedata);
        this.coursedata = coursedata?.data;
        this.cdr.detectChanges();
      }),
      catchError((error: any) => {
        console.error("Error fetching posts: ", error.data);
        return of(error);
      }),
    ).subscribe();
    this.cdr.detectChanges(); // Trigger change detection manually
  }

  educationdata: any
  getEductaionDetails(): void {
    this.postsService.allTutorEducationList().pipe(
      tap((educationdata: any) => {
        console.log("educationdata profile : ", educationdata);
        this.educationdata = educationdata?.data;
        this.cdr.detectChanges();
      }),
      catchError((error: any) => {
        console.error("Error fetching posts: ", error.data);
        return of(error);
      }),
    ).subscribe();
    this.cdr.detectChanges(); // Trigger change detection manually
  }

  experiencedata: any
  getExperianceDetails(): void {
    this.postsService.allTutorExperienceList().pipe(
      tap((experiencedata: any) => {
        console.log("experiencedata profile : ", experiencedata);
        this.experiencedata = experiencedata?.data;
        this.cdr.detectChanges();
      }),
      catchError((error: any) => {
        console.error("Error fetching posts: ", error.data);
        return of(error);
      }),
    ).subscribe();
    this.cdr.detectChanges(); // Trigger change detection manually
  }

  profiledata: any;
  getTutorProfile(): void {
    this.postsService.getProfileTutor().pipe(
      tap((profiledata: any) => {
        console.log("data profile : ", profiledata);
        this.profiledata = profiledata?.data;
        this.cdr.detectChanges();
      }),
      catchError((error: any) => {
        console.error("Error fetching posts: ", error.data);
        return of(error);
      }),
    ).subscribe();
    this.cdr.detectChanges(); // Trigger change detection manually
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

  UpdateDP() {
    this.showPopup = true;
  }
  showPopup: boolean = false; // Controls the popup visibility
  imageUrl: string = ''; // Stores the image URL entered by the user

  closePopup() {
    this.showPopup = false;
    this.imageUrl = ''; // Clear input field
  }

  // Function to handle submission of image URL
  submitImageUrl() {
    if (this.imageUrl) {
      // Logic to update the profile image
      alert(`Image URL Updated: ${this.imageUrl}`);
      // Optionally update the profile image dynamically
      // this.profiledata.imageUrl = this.imageUrl;
      this.closePopup();
    } else {
      alert('Please enter a valid image URL.');
    }
  }
}

// import { CommonModule } from '@angular/common';
// import { ChangeDetectionStrategy, Component } from '@angular/core';
// import {
//   FormControl,
//   FormsModule,
//   ReactiveFormsModule,
//   Validators,
// } from '@angular/forms';
// import { UserService } from '../../core/services/user.service';
// import { Router } from '@angular/router';

// @Component({
//   selector: 'til-profile',
//   standalone: true,
//   imports: [CommonModule, FormsModule, ReactiveFormsModule],
//   templateUrl: './profile.component.html',
//   styleUrls: ['./profile.component.scss'],
//   changeDetection: ChangeDetectionStrategy.OnPush,
// })
// export class ProfileComponent {
//   readonly usernameControl: FormControl;
//   readonly user$ = this.userService.user$;

//   constructor(private readonly userService: UserService, private router: Router) {
//     this.usernameControl = new FormControl('', {
//       validators: [Validators.minLength(3), Validators.maxLength(30)],
//     });

//     // Subscribe to user$ to log user details
//     this.user$.subscribe(user => {
//       console.log("User details from profile:", user);
//     });
//   }

//   // Change username function with form validation
//   changeUsername() {
//     if (this.usernameControl.valid) {
//       const newUsername = this.usernameControl.value;
//       console.log('Changing username to:', newUsername);
//       // Additional logic to update the username
//     }
//   }

//   // Navigation methods
//   goToEditProfile() {
//     this.router.navigateByUrl('/tutorprofile-edit');
//   }

//   goToCreateCourse() {
//     this.router.navigateByUrl('/create-course');
//   }

//   goToAddEducation() {
//     this.router.navigateByUrl('/add-education');
//   }

//   goToAddWork() {
//     this.router.navigateByUrl('/add-experience');
//   }
// }
