import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnDestroy, OnInit, signal } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MarkdownComponent } from 'ngx-markdown';
import { Observable, Subject, } from 'rxjs';

import { ApiPost } from '../../core/models/api.model';
import { PostsService } from '../../core/services/posts.service';
import { UserService } from '../../core/services/user.service';

import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { isPlatformBrowser } from '@angular/common';
import { Inject, PLATFORM_ID } from '@angular/core';

@Component({
  selector: 'til-post',
  standalone: true,
  imports: [CommonModule, MarkdownComponent, FormsModule, ReactiveFormsModule],
  templateUrl: './post.component.html',
  styleUrls: ['./post.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PostComponent implements OnInit, OnDestroy {
  postSig = signal<ApiPost | null>(null);
  loadingSig = signal<boolean>(true);
  isLoggedIn$: Observable<boolean> = this.userService.isLoggedIn$;
  user$ = this.userService.user$;
  likeRequest$ = new Subject<string>();
  private readonly onDestroy$ = new Subject<void>();
  safeHtmlContent: SafeHtml | undefined;

  constructor(
    private postsService: PostsService, private userService: UserService, private sanitizer: DomSanitizer,
    @Inject(PLATFORM_ID) private platformId: object
  ) { }

  post: any;
  ngOnInit() {
    // Check if we're running in the browser before accessing sessionStorage
    if (isPlatformBrowser(this.platformId)) {
      const savedPost = sessionStorage.getItem('postData');
      if (savedPost) {
        // If post data exists in sessionStorage, use it
        this.post = JSON.parse(savedPost);
      } else {
        // If no post data in sessionStorage, get post from service and save it
        this.post = this.postsService.getPostRoute(); // Retrieve the post data from the service
        // Save post data in sessionStorage
        sessionStorage.setItem('postData', JSON.stringify(this.post));
      }
      // Convert post body to safe HTML
      this.safeHtmlContent = this.sanitizer.bypassSecurityTrustHtml(this.post?.body);
      // Update the signal with the post data
      this.postSig.set(this.post);
    }
    // Set loading to false after data is loaded
    this.loadingSig.set(false);
  }

  ngOnDestroy() {
    this.onDestroy$.next();
    this.onDestroy$.complete();
  }

  // private updateMetaTags(post: ApiPost) {
  //   const ogUrl = new URL('https://og.learnedtoday.app/api/og');
  //   ogUrl.searchParams.append('title', post.title);
  //   ogUrl.searchParams.append('author', post.name);
  //   ogUrl.searchParams.append(
  //     'published',
  //     new Date(post.postCreatedAt).toDateString(),
  //   );
  //   ogUrl.searchParams.append('image', post.image);

  //   const tags = [
  //     { name: 'og:image', content: ogUrl.toString() },
  //     { name: 'twitter:image', content: ogUrl.toString() },
  //     {
  //       name: 'og:url',
  //       content: `https://learnedtoday.app/post/${post.postId}`,
  //     },
  //     {
  //       name: 'twitter:url',
  //       content: `https://learnedtoday.app/post/${post.postId}`,
  //     },
  //     { name: 'og:title', content: post.title },
  //     { name: 'twitter:title', content: post.title },
  //     { name: 'og:description', content: post.description },
  //     { name: 'twitter:description', content: post.description },
  //     { name: 'og:type', content: 'article' },
  //     { name: 'keywords', content: post.tags.join(', ') },
  //   ];

  //   tags.forEach((tag) => this.meta.updateTag(tag, `property='${tag.name}'`));
  // }
}
