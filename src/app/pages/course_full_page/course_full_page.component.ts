import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { Router } from '@angular/router'; // Import Router

@Component({
  selector: 'app-course-full-page',
  templateUrl: './course_full_page.component.html',
  styleUrls: ['./course_full_page.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
  ],
})
export class CourseFullPageComponent {
  // Add Router to the constructor
  constructor(private router: Router) {}

  reviews = [
    { text: "The course content was excellent and well-structured.", author: "Alice" },
    { text: "The tutor was very engaging and provided practical examples.", author: "Bob" }
  ];

  students = [
    { name: 'Tom', class: '12th Grade', country: 'USA' },
    { name: 'Emma', class: '11th Grade', country: 'Canada' }
  ];

  showReviewPopup = false;

  openReviewPopup(): void {
    this.showReviewPopup = true;
  }

  closeReviewPopup(): void {
    this.showReviewPopup = false;
  }

  submitReview(): void {
    console.log('Review submitted');
    this.closeReviewPopup();
  }

  // Method to navigate to the enquiry page
  navigateToEnquiry(): void {
    this.router.navigate(['/enquiry']); // Adjust the route as necessary
  }
}
