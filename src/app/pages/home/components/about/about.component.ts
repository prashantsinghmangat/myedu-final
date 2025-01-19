import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { PostsService } from '../../../../core/services/posts.service';
import { ChangeDetectorRef } from '@angular/core';
import { catchError, of, tap } from 'rxjs';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'til-about',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './about.component.html',
  styleUrl: './about.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AboutComponent {

  constructor(private cdr: ChangeDetectorRef, private readonly postsService: PostsService, private router: Router) {
  }
  coursedata: any

  ngOnInit(): void {
    this.getCourcesList();
  }

  teacherList: any[] = [];
  getCourcesList(): void {
    console.log("api called")
    this.postsService.getTopTutorProfileWithLatestCourse().pipe(
      tap((teacherdata: any) => {
        console.log("teacherdata profile : ", teacherdata);
        this.teacherList = teacherdata?.data;
        this.cdr.detectChanges();
      }),
      catchError((error: any) => {
        console.error("Error fetching posts: ", error.data);
        return of(error);
      }),
    ).subscribe();
    this.cdr.detectChanges(); // Trigger change detection manually
  }

}
