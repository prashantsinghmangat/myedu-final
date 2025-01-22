import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { PostsService } from '../../../../core/services/posts.service';
import { ChangeDetectorRef } from '@angular/core';
import { catchError, of } from 'rxjs';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

interface Teacher {
  _id: string;
  teacherId: string;
  profilePic: string;
  name: string;
  currentDesignation: string;
  location: string;
  aboutMe: string;
  subject: string;
  currency: string;
  costPerSessions: string;
}

@Component({
  selector: 'til-about',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './about.component.html',
  styleUrl: './about.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AboutComponent implements OnInit {
  teacherList: Teacher[] = [];

  constructor(
    private cdr: ChangeDetectorRef,
    private postsService: PostsService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.getTeachersList();
  }

  getTeachersList(): void {
    this.postsService.getTopTutorProfileWithLatestCourse().pipe(
      catchError((error: any) => {
        console.error("Error fetching teachers: ", error);
        return of({ isSuccess: false, data: [] });
      })
    ).subscribe((response: any) => {
      if (response.isSuccess) {
        this.teacherList = response.data;
        console.log("teacher loist data: ", this.teacherList);
        this.cdr.markForCheck();
      }
    });
  }

  goToCoursePage(teacherId: string): void {
    this.router.navigate(['/course_full_page', teacherId]);
  }
}