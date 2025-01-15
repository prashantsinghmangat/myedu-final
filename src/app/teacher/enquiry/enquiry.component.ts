import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms'; // Correct import for ReactiveFormsModule
import { ActivatedRoute } from '@angular/router';
import { PostsService } from '../../core/services/posts.service';
import { Router } from '@angular/router';
import { catchError, of, tap } from 'rxjs';

@Component({
  standalone: true,
  selector: 'enquiry',
  templateUrl: './enquiry.component.html',
  styleUrls: ['./enquiry.component.scss'],
  imports: [ReactiveFormsModule, CommonModule] // Import ReactiveFormsModule instead of FormsModule
})
export class enquiryComponent {

  enquiryForm: FormGroup;
  classOptions: string[] = ['6th Grade', '7th Grade', '8th Grade', '9th Grade', '10th Grade'];

  constructor(private fb: FormBuilder, private readonly postsService: PostsService, private activatedRoute: ActivatedRoute,) {
  

    this.enquiryForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      class: ['', [Validators.required]],
      countryCode: ['+91', [Validators.required, Validators.pattern(/^\+\d{1,3}$/)]],
      phone: ['', [Validators.required, Validators.pattern(/^[0-9]{10}$/)]],
      email: ['', [Validators.required, Validators.email]]
    });
  }

  onSubmit(): void {
    try {
      const courseId = this.activatedRoute.snapshot.paramMap.get('courseId');
      const teacherId = this.activatedRoute.snapshot.paramMap.get('teacherId');
      if (this.enquiryForm.valid) {

        const payload = {
          courseId: courseId,
          teacherId: teacherId,
          studentName: this.enquiryForm.value.name,
          studentClass: this.enquiryForm.value.class,
          studentCountryCode: this.enquiryForm.value.countryCode,
          studentPhoneNumber: this.enquiryForm.value.phone,
          studentAddress: this.enquiryForm.value.email
        }
        console.log('Form Submitted', this.enquiryForm.value);

        this.postsService.studentQuery(payload).pipe(
          tap((response: any) => {
            console.log("Fetched Courses:", response);
            alert('Thank you for your enquiry!');
            this.enquiryForm.reset({ countryCode: '+91' });
            // this.coursesDetails = response?.data || [];
          }),
          catchError((error: any) => {
            console.error("Error fetching courses:", error);
            return of([]);
          })
        ).subscribe();


      } else {
        alert('Please fill out the form correctly before submitting.');
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      alert('Something went wrong. Please try again.');
    }
  }

  getErrorMessage(field: string): string {
    if (this.enquiryForm.get(field)?.hasError('required')) {
      return `${field} is required.`;
    }
    if (this.enquiryForm.get(field)?.hasError('minlength')) {
      return `${field} must be at least 3 characters long.`;
    }
    if (this.enquiryForm.get(field)?.hasError('pattern')) {
      return `Invalid ${field}.`;
    }
    if (this.enquiryForm.get(field)?.hasError('email')) {
      return 'Invalid email address.';
    }
    return '';
  }
}
