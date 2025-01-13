import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { Router, ActivatedRoute } from '@angular/router'; // Import Router and ActivatedRoute
import { HttpClient } from '@angular/common/http'; // Import HttpClient
import { PostsService } from '../../core/services/posts.service';
import { catchError, of, tap } from 'rxjs';

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
export class CourseFullPageComponent implements OnInit {
  reviews = [
    { text: 'The course content was excellent and well-structured.', author: 'Alice' },
    { text: 'The tutor was very engaging and provided practical examples.', author: 'Bob' },
  ];

  students = [
    { name: 'Tom', class: '12th Grade', country: 'USA' },
    { name: 'Emma', class: '11th Grade', country: 'Canada' },
  ];

  showReviewPopup = false;
  courseId: string | null = null; // To store the course ID
  courseDetails: any = null; // To store the fetched course details

  constructor(private readonly postsService: PostsService,
    private router: Router,
    private activatedRoute: ActivatedRoute, // Inject ActivatedRoute
    private http: HttpClient // Inject HttpClient for API calls
  ) { }

  ngOnInit(): void {
    // Extract the ID from the URL
    const url = this.router.url;
    const idMatch = url.match(/course_full_page\/([a-zA-Z0-9]+)/);
    this.courseId = idMatch ? idMatch[1] : null;

    if (this.courseId) {
      this.fetchCourseDetails(this.courseId);
    } else {
      console.error('Course ID not found in URL');
    }
  }

  coursesDetails: any;
  // Fetch course details from API
  fetchCourseDetails(courseId: string): void {
    this.postsService.getCourseDetails(courseId).pipe(
      tap((response: any) => {
        console.log("Fetched Courses:", response);
        this.coursesDetails = response?.data || [];
      }),
      catchError((error: any) => {
        console.error("Error fetching courses:", error);
        return of([]);
      })
    ).subscribe();

    // const apiUrl = `http://api.myedusync.com/courseDetails/${courseId}`;
    // this.http.get(apiUrl).subscribe(
    //   (response) => {
    //     this.courseDetails = response;
    //     console.log('Course details fetched:', response);
    //   },
    //   (error) => {
    //     console.error('Error fetching course details:', error);
    //   }
    // );
  }

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