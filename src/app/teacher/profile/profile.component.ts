import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit, OnDestroy } from '@angular/core';
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
import { catchError, of, tap, Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'til-profile',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProfileComponent implements OnInit, OnDestroy {
  readonly usernameControl: FormControl;
  readonly user$ = this.userService.user$;

  coursedata: any;
  educationdata: any;
  experiencedata: any;
  profiledata: any;
  showPopup = false;
  imageUrl = '';

  private destroy$ = new Subject<void>();

  constructor(
    private readonly userService: UserService,
    private router: Router,
    private cdr: ChangeDetectorRef,
    private readonly postsService: PostsService,
    private http: HttpClient,
    private sanitizer: DomSanitizer
  ) {
    this.usernameControl = new FormControl('', {
      validators: [Validators.required, Validators.minLength(3), Validators.maxLength(30)],
    });

    this.user$.pipe(takeUntil(this.destroy$)).subscribe(user => {
      console.log("User details from profile:", user);
    });
  }

  ngOnInit(): void {
    this.getEducationDetails();
    this.getTutorProfile();
    this.getExperienceDetails();
    this.getCoursesList();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  getSafeImageUrl(url: string): SafeUrl {
    return this.sanitizer.bypassSecurityTrustUrl(url);
  }

  getCoursesList(): void {
    this.postsService.allCourseList().pipe(
      tap((coursedata: any) => {
        this.coursedata = coursedata?.data;
        this.cdr.markForCheck();
      }),
      catchError(this.handleError),
      takeUntil(this.destroy$)
    ).subscribe();
  }

  getEducationDetails(): void {
    this.postsService.allTutorEducationList().pipe(
      tap((educationdata: any) => {
        this.educationdata = educationdata?.data;
        this.cdr.markForCheck();
      }),
      catchError(this.handleError),
      takeUntil(this.destroy$)
    ).subscribe();
  }

  getExperienceDetails(): void {
    this.postsService.allTutorExperienceList().pipe(
      tap((experiencedata: any) => {
        this.experiencedata = experiencedata?.data;
        this.cdr.markForCheck();
      }),
      catchError(this.handleError),
      takeUntil(this.destroy$)
    ).subscribe();
  }

  getTutorProfile(): void {
    this.postsService.getProfileTutor().pipe(
      tap((profiledata: any) => {
        this.profiledata = profiledata?.data;
        this.cdr.markForCheck();
      }),
      catchError(this.handleError),
      takeUntil(this.destroy$)
    ).subscribe();
  }

  changeUsername(): void {
    if (this.usernameControl.valid) {
      const newUsername = this.usernameControl.value;
      console.log('Changing username to:', newUsername);
      // Additional logic to update the username
    }
  }

  goToEditProfile(): void {
    this.router.navigateByUrl('/tutorprofile-edit');
  }

  goToCreateCourse(): void {
    this.router.navigateByUrl('/create-course');
  }

  goToAddEducation(): void {
    this.router.navigateByUrl('/add-education');
  }

  goToAddWork(): void {
    this.router.navigateByUrl('/add-experience');
  }

  UpdateDP(): void {
    this.showPopup = true;
  }

  closePopup(): void {
    this.showPopup = false;
    this.imageUrl = '';
  }

  submitImageUrl(): void {
    if (this.imageUrl) {
      const payload = { profilePic: this.imageUrl };

      this.http.post('http://api.myedusync.com/uploadTutorProfilePic', payload)
        .pipe(
          tap((response: any) => {
            if (response.success) {
              this.showPopup = false;
              console.log('Success message:', response.message);
              this.closePopup()
            } else {
              console.error('Error:', response.error);
            }
          }),
          catchError(this.handleError),
          takeUntil(this.destroy$)
        )
        .subscribe();
    } else {
      alert('Please enter a valid image URL.');
    }
  }

  private handleError = (error: any) => {
    console.error("Error:", error);
    return of(null);
  }
}