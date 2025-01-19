import { tilItems } from './til-items';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { PostsService } from '../../../../core/services/posts.service';
import { ChangeDetectorRef } from '@angular/core';
import { catchError, of, tap } from 'rxjs';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'til-latest-preview',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './latest-preview.component.html',
  styleUrl: './latest-preview.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LatestPreviewComponent {
  readonly tilItems = tilItems;

  gridTemp = Array(10).fill(0);

  notesListArray: any[] = [];

  constructor(private cdr: ChangeDetectorRef, private readonly postsService: PostsService,
    private sanitizer: DomSanitizer, private router: Router) {
  }

  ngOnInit(): void {
    this.getLatestNotesHome();
  }

  getSafeImageUrl(url: string): SafeUrl {
    return this.sanitizer.bypassSecurityTrustUrl(url);
  }

  getPlainText(content: string): string {
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = content;
    return tempDiv.textContent || tempDiv.innerText || '';
  }

  getLatestNotesHome(): void {
    console.log("api called")
    this.postsService.getLatestNotes().pipe(
      tap((notesdata: any) => {
        console.log("notesdata profile : ", notesdata);
        this.notesListArray = notesdata?.data;
        this.cdr.detectChanges();
      }),
      catchError((error: any) => {
        console.error("Error fetching posts: ", error.data);
        return of(error);
      }),
    ).subscribe();
    this.cdr.detectChanges(); // Trigger change detection manually
  }

  expandedNoteId: string | null = null;

  openNoteDetails(note: any): void {
    console.log("notes ID: ", note);
    if (this.expandedNoteId === note._id) {
      // If the clicked note is already expanded, collapse it
      this.expandedNoteId = null;
    } else {
      // Expand the clicked note
      this.expandedNoteId = note._id;
    }
    // Navigate to the note detail page
    const data = JSON.stringify(note)
    sessionStorage.setItem('postData', data);
    this.router.navigate(['/post', note._id]);
  }

}

