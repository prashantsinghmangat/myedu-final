import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms'; // Correct import for ReactiveFormsModule

import { PostsService } from '../../core/services/posts.service';
import { Router } from '@angular/router';

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

  constructor(private fb: FormBuilder) {
    this.enquiryForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      class: ['', [Validators.required]],
      countryCode: ['+91', [Validators.required, Validators.pattern(/^\+\d{1,3}$/)]],
      phone: ['', [Validators.required, Validators.pattern(/^[0-9]{10}$/)]],
      email: ['', [Validators.required, Validators.email]],
    });
  }

  onSubmit(): void {
    try {
      if (this.enquiryForm.valid) {
        console.log('Form Submitted', this.enquiryForm.value);
        alert('Thank you for your enquiry!');
        this.enquiryForm.reset({ countryCode: '+91' });
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
