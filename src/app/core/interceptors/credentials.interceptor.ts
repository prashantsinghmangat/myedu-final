import { isPlatformBrowser } from '@angular/common';
import { HttpEvent, HttpHandlerFn, HttpRequest } from '@angular/common/http';
import { PLATFORM_ID, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { CookieService } from '../services/cookie.service';
import { UserService } from '../../core/services/user.service';

export function credentialsInterceptor(
  req: HttpRequest<unknown>,
  next: HttpHandlerFn,
): Observable<HttpEvent<unknown>> {

  // Inject necessary services
  const platformId = inject(PLATFORM_ID);
  const cookieService = inject(CookieService);
  const userService = inject(UserService);

  const isBrowser = isPlatformBrowser(platformId);
  let modifiedReq: HttpRequest<unknown>;

  // Retrieve the auth token from the UserService
  const userData = userService.getUserData();
  const authToken = userData?.accessToken || '';  // Get the accessToken or set it to an empty string

  if (isBrowser) {
    // For browser requests, clone and set withCredentials and authorization header
    modifiedReq = req.clone({
      withCredentials: true,
      setHeaders: {
        Authorization: `Bearer ${authToken}`
      }
    });
  } else {
    // For non-browser platforms, fetch cookies and set session cookie in headers
    const cookies = cookieService.get();
    const sessionCookie = cookies
      ?.split(';')
      ?.find((cookie) => cookie.trim().startsWith('session='));

    modifiedReq = req.clone({
      withCredentials: true,
      setHeaders: {
        cookie: sessionCookie ?? '',
        Authorization: `Bearer ${authToken}` // Add the auth token here as well
      }
    });
  }

  // Pass the modified request to the next handler
  return next(modifiedReq);
}

// import { isPlatformBrowser } from '@angular/common';
// import { HttpEvent, HttpHandlerFn, HttpRequest } from '@angular/common/http';
// import { PLATFORM_ID, inject } from '@angular/core';
// import { Observable } from 'rxjs';
// import { CookieService } from '../services/cookie.service';

// import { UserService } from '../../core/services/user.service';

// export function credentialsInterceptor(
//   req: HttpRequest<unknown>,
//   next: HttpHandlerFn,
// ): Observable<HttpEvent<unknown>> {

//   const user$ = this.userService.user$;

//   const platformId = inject(PLATFORM_ID);
//   const cookieService = inject(CookieService);
//   const isBrowser = isPlatformBrowser(platformId);
//   let modifiedReq: HttpRequest<unknown>;
//   if (isBrowser) {
//     modifiedReq = req.clone({
//       withCredentials: true,
//     });
//   } else {
//     const cookies = cookieService.get();

//     // Parse session cookie and set it to the request
//     const sessionCookie = cookies
//       ?.split(';')
//       ?.find((cookie) => cookie.startsWith('session='));

//     modifiedReq = req.clone({
//       withCredentials: true,
//       setHeaders: {
//         cookie: sessionCookie ?? '',
//       },
//     });
//   }
//   return next(modifiedReq);
// }
