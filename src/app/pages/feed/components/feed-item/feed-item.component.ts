import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { RouterModule, Router } from '@angular/router';
import { ApiPreviewPost } from '../../../../core/models/api.model';
import { PostsService } from '../../../../core/services/posts.service';

@Component({
  selector: 'til-feed-item',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './feed-item.component.html',
  styleUrls: ['./feed-item.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FeedItemComponent implements OnInit {
  @Input({ required: true }) post!: ApiPreviewPost;
  @Output() loaded = new EventEmitter<number>();

  constructor(private router: Router, private postService: PostsService) { }

  ngOnInit() {
    this.loaded.emit(this.post._id);
  }

  selectedPost(post: any) {
    this.postService.setPostRoute(post);
    this.router.navigate(['/post', post._id]);
  }

  getPlainText(content: string): string {
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = content;
    return tempDiv.textContent || tempDiv.innerText || '';
  }
}
