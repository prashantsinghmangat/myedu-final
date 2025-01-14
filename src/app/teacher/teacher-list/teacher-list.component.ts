import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { PostsService } from '../../core/services/posts.service';
import { ChangeDetectorRef } from '@angular/core';
import { catchError, of, tap } from 'rxjs';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { Router } from '@angular/router';

@Component({
  selector: 'about-us',
  standalone: true,
  imports: [CommonModule, HttpClientModule],
  templateUrl: './teacher-list.component.html',
  styleUrls: ['./teacher-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TeacherListComponent implements OnInit {
  courseslist: any[] = [];

  constructor(private cdr: ChangeDetectorRef,
    private readonly postsService: PostsService,
    private sanitizer: DomSanitizer, private router: Router,
  ) { }

  ngOnInit(): void {
    this.getCourses();
  }

  getSafeImageUrl(url: string): SafeUrl {
    return this.sanitizer.bypassSecurityTrustUrl(url);
  }

  getCourses(): void {
    this.postsService.getAllCourseList().pipe(
      tap((response: any) => {
        console.log("Fetched Courses:", response);
        this.courseslist = response?.data || [];
        this.cdr.markForCheck(); // Only check once for updated data
      }),
      catchError((error: any) => {
        console.error("Error fetching courses:", error);
        return of([]);
      })
    ).subscribe();
  }

  searchTutors(): void {
    // Placeholder function to handle tutor search
    console.log("Search button clicked - implement search functionality here");
  }

  goToCoursePage(cousedata: any) {
    console.log(cousedata);
    // sessionStorage.setItem('courseTeacherId', cousedata?.teacherId);
    this.router.navigate(['/course_full_page', cousedata._id]);

    // this.router.navigateByUrl('/course_full_page' + cousedata?.teacherId);
  }
}