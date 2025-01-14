import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { PostsService } from '../../core/services/posts.service';
import { catchError, Observable, of } from 'rxjs';
import { tap } from 'rxjs/operators';

@Component({
  standalone: true,
  selector: 'app-course-full-page',
  templateUrl: './course_full_page.component.html',
  styleUrls: ['./course_full_page.component.scss'],
  imports: [CommonModule]
})
export class CourseFullPageComponent implements OnInit {
  courseDetails$!: Observable<any>; // Using non-null assertion

  constructor(private postsService: PostsService,
              private router: Router,
              private activatedRoute: ActivatedRoute,
              private http: HttpClient) { }

  ngOnInit(): void {
    const courseId = this.activatedRoute.snapshot.paramMap.get('id');
    if (courseId) {
      this.courseDetails$ = this.fetchCourseDetails(courseId);
    } else {
      console.error('Course ID not found in URL');
    }
  }

  fetchCourseDetails(courseId: string): Observable<any> {
    return this.postsService.getCourseDetails(courseId).pipe(
      tap(response => console.log("Fetched Courses:", response)),
      catchError(error => {
        console.error("Error fetching courses:", error);
        return of(null); // Provide a fallback value or an error indicator
      })
    );
  }

  navigateToEnquiry(): void {
    this.router.navigate(['/enquiry']);
  }
}
