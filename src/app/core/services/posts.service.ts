import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, catchError } from 'rxjs';
import { environment } from '../../../environments/environment';
import {
  ApiPost,
  ApiPreviewPosts,
  ApiStatistics,
  ApiUser,
} from '../models/api.model';
import { ErrorHandlerService } from './error-handler.service';

@Injectable({
  providedIn: 'root',
})
export class PostsService {
  readonly user$: BehaviorSubject<ApiUser | null> =
    new BehaviorSubject<ApiUser | null>(null);

  constructor(
    private http: HttpClient,
    private errorHandlingService: ErrorHandlerService,
  ) { }

  private selectedPost: any;

  setPostRoute(post: any) {
    this.selectedPost = post;
  }

  getPostRoute() {
    return this.selectedPost;
  }

  // createPost(body: { content: string; title: string }) {
  //   return this.http
  //     .post<void>(`${environment.baseUrl}/api/posts/create`, body)
  //     .pipe(catchError((e) => this.errorHandlingService.handleError(e)));
  // }

  createPost(body: any) {
    return this.http
      .post<void>(`${environment.myEduBaseUrl}/addNotesDetails`, body)
      .pipe(catchError((e) => this.errorHandlingService.handleError(e)));
  }

  addTutorBasicDetails(body: any) {
    let url = `${environment.myEduBaseUrl}/addTutorBasicDetails`
    return this.http.post(url, body)
  }

  // addTutorBasicDetails(body: any) {
  //   return this.http
  //     .post<void>(`${environment.myEduBaseUrl}/addTutorBasicDetails`, body)
  //     .pipe(catchError((e) => this.errorHandlingService.handleError(e)));
  // }


  addTutorEducationDetails(body: any) {
    return this.http
      .post<void>(`${environment.myEduBaseUrl}/addTutorEducationDetails`, body)
      .pipe(catchError((e) => this.errorHandlingService.handleError(e)));
  }


  getPosts(limit: number) {
    return this.http
      .get<ApiPreviewPosts>(
        `${environment.myEduBaseUrl}/getNotesLists??page=0&limit=${limit}&&board=CBSE&class=class_11&subject=mathematics`,
      )
      .pipe(catchError((e) => this.errorHandlingService.handleError(e)));
  }

  getAllNotes(board: any, classdata: any, subject: any) {
    return this.http.get<ApiPreviewPosts>(`${environment.myEduBaseUrl}/getNotesLists?page=0&limit=10&board=${board}&class=${classdata}&subject=${subject}`,)
      .pipe(catchError((e) => this.errorHandlingService.handleError(e)));
  }

  // getPosts(limit: number, offset: number) {
  //   return this.http
  //     .get<ApiPreviewPosts>(
  //       `${environment.baseUrl}/api/posts/preview?limit=${limit}&offset=${offset}`,
  //     )
  //     .pipe(catchError((e) => this.errorHandlingService.handleError(e)));
  // }

  getStatistics() {
    return this.http
      .get<ApiStatistics>(`${environment.baseUrl}/api/posts/statistics`)
      .pipe(catchError((e) => this.errorHandlingService.handleError(e)));
  }

  getPost(id: string) {
    return this.http
      .get<ApiPost>(`${environment.baseUrl}/api/posts/getFull?id=${id}`)
      .pipe(catchError((e) => this.errorHandlingService.handleError(e)));
  }

  likePost(id: string) {
    return this.http
      .post<void>(`${environment.baseUrl}/api/posts/like`, { postId: id })
      .pipe(catchError((e) => this.errorHandlingService.handleError(e)));
  }
}
