import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, catchError, map, tap } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ApiUser, ApiUserStatistics } from '../models/api.model';
import { ErrorHandlerService } from './error-handler.service';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  readonly user$: BehaviorSubject<ApiUser | null> =
    new BehaviorSubject<ApiUser | null>(null);

  readonly isLoggedIn$ = this.user$.pipe(map((user) => !!user));

  constructor(
    private http: HttpClient,
    private errorHandlingService: ErrorHandlerService,
  ) { }

  setUser(user: ApiUser | null): void {
    // this.isLogin(user);
    this.user$.next(user);
  }

  // getUserData(): any {
  //   if (typeof window !== 'undefined') {
  //     const user = localStorage.getItem('user');
  //     this.setUser(user)
  //     return user ? JSON.parse(user) : null;
  //   }
  //   return null;
  // }

  getUserData(): any {
    if (typeof window !== 'undefined') { // Ensure the window object is available (for SSR)
      const user = localStorage.getItem('user'); // Retrieve the user data from localStorage
      if (user) {
        this.setUser(JSON.parse(user)); // Parse the user data and set it
        return JSON.parse(user); // Return the parsed user data
      }
    }
    return null; // Return null if no user data is found
  }

  isLogin(userData: any): boolean {
    if (typeof window !== 'undefined') {
      localStorage.setItem('user', JSON.stringify(userData));
      return true;
    }
    return false;
  }

  getUser() {
    return this.http.get<ApiUser>(`${environment.baseUrl}/api/user/me`).pipe(
      tap((user) => this.setUser(user)),
      catchError((e) => this.errorHandlingService.handleError(e)),
    );
  }

  getUserStatistics() {
    return this.http
      .get<ApiUserStatistics>(`${environment.baseUrl}/api/user/statistics`)
      .pipe(catchError((e) => this.errorHandlingService.handleError(e)));
  }

  clearUser(): void {
    this.setUser(null);
  }
}
