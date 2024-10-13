import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit, signal } from '@angular/core';
import { catchError, of, tap } from 'rxjs';
import {
  ApiError,
  ApiPreviewPost,
  ApiPreviewPosts
} from '../../core/models/api.model';
import { PostsService } from '../../core/services/posts.service';
import { UserService } from '../../core/services/user.service';
import { FeedItemComponent } from './components/feed-item/feed-item.component';
import { FeedMenuComponent } from './components/feed-menu/feed-menu.component';
import { RouterModule, Router } from '@angular/router';
import { ChangeDetectorRef } from '@angular/core';
import { FormsModule } from '@angular/forms';

type Board = 'SelectBoard' | 'CBSE' | 'ICSE' | 'UPBoard';

interface DataStructure {
  classes: number[];
  subjects: {
    [key: number]: string[];
  };
}

@Component({
  selector: 'til-feed',
  standalone: true,
  imports: [CommonModule, FeedItemComponent, FeedMenuComponent, RouterModule, FormsModule],
  templateUrl: './feed.component.html',
  styleUrls: ['./feed.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FeedComponent implements OnInit {
  postList: any;
  readonly postsSig = signal<ApiPreviewPost[]>([]);
  readonly loadingPostsSig = signal(false);
  private hasMore = true;
  private readonly limit = 10;

  data: Record<Board, DataStructure> = {
    SelectBoard: this.createDataStructure(),
    CBSE: this.createDataStructure(),
    ICSE: this.createDataStructure(),
    UPBoard: this.createDataStructure(),
  };

  boards: Board[] = Object.keys(this.data) as Board[];
  classes: number[] = [];
  subjects: string[] = [];
  postData: any;
  selectedBoard: Board | null = null;
  selectedClass: number | null = null;
  selectedSubject: string | null = null;

  constructor(
    private readonly postsService: PostsService, private router: Router,
    private readonly userService: UserService, private cdr: ChangeDetectorRef
  ) { }

  // ngOnInit lifecycle hook
  ngOnInit(): void {
    this.loadPosts();
  }

  loadPosts() {
    if (!this.hasMore) return;
    this.loadingPostsSig.set(true);

    this.postsService.getPosts(this.limit).pipe(
      tap((posts: any) => {
        const postsResponse = posts.data as ApiPreviewPosts;
        this.postList = postsResponse;
        this.loadingPostsSig.set(false);
        this.cdr.detectChanges();
      }),
      catchError((e: ApiError) => {
        return of(e);
      }),
    ).subscribe();
  }

  error = false;
  getAllNotes(): void {
    this.error = false;
    this.loadingPostsSig.set(true);
    this.postsService.getAllNotes(this.selectedBoard, this.selectedClass, this.selectedSubject).pipe(
      tap((posts: any) => {
        this.postData = posts?.data;
        this.postList = posts?.data;
        this.loadingPostsSig.set(false);
        this.cdr.detectChanges();
      }),
      catchError((error: ApiError) => {
        this.error = true;
        console.error("Error fetching posts: ", error.data);
        return of(error);
      }),
    ).subscribe();
    this.cdr.detectChanges();// Trigger change detection manually
  }

  openNoteDetails(note: any): void {
    sessionStorage.removeItem('postData');
    this.postsService.setPostRoute(note); // Store the entire post object in the service
    this.router.navigate(['/post', note._id]); // Navigate to the target route
    // Implement navigation logic using Angular Router or another method
  }

  onBoardChange(event: Event): void {
    const board = (event.target as HTMLSelectElement).value as Board;
    this.selectedBoard = board;
    this.classes = this.data[board]?.classes || [];
    this.selectedClass = null;
    this.subjects = [];
    // this.getAllNotes();
  }

  onClassChange(event: Event): void {
    const selectedClass = +(event.target as HTMLSelectElement).value;
    this.selectedClass = selectedClass;
    if (this.selectedBoard) {
      this.subjects = this.data[this.selectedBoard]?.subjects[selectedClass] || [];
      // this.getAllNotes();
    }
  }

  onSubjectChange(event: Event): void {
    const subject = (event.target as HTMLSelectElement).value;
    this.selectedSubject = subject;
    // this.getAllNotes();
  }


  private createDataStructure(): DataStructure {
    return {
      classes: [8, 9, 10, 11, 12],
      subjects: {
        8: ['Hindi', 'English', 'Maths', 'Science'],
        9: ['Hindi', 'English', 'Maths', 'Science'],
        10: ['Hindi', 'English', 'Maths', 'Science'],
        11: ['Physics', 'Chemistry', 'Maths', 'Biology', 'Science'],
        12: ['Physics', 'Chemistry', 'Maths', 'Biology'],
      },
    };
  }

}