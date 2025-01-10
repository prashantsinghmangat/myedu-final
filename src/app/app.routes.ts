import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  {
    path: '', loadComponent: () => import('./pages/home/home.component').then((m) => m.HomeComponent),
    title: 'Today I Learned — Share what you learned today',
  },
  {
    path: 'auth/oauth/:provider/callback', loadComponent: () => import('./pages/oauth-callback/oauth-callback.component').then((m) => m.OauthCallbackComponent,),
    title: 'Authenticating...',
  },
  {
    path: 'profile', loadComponent: () => import('./teacher/profile/profile.component').then((m) => m.ProfileComponent,), canActivate: [authGuard],
    title: 'Profile',
  },
  {
    path: 'new-post',
    loadComponent: () => import('./pages/new-post/new-post.component').then((m) => m.NewPostComponent,), canActivate: [authGuard],
    title: 'Write a post',
  },
  {
    path: 'feed',
    loadComponent: () => import('./pages/feed/feed.component').then((m) => m.FeedComponent), title: 'Feed',
  },

  {
    path: 'course_full_page',
    loadComponent: () => import('./pages/course_full_page/course_full_page.component').then((m) => m.CourseFullPageComponent), title: 'course_full_page',
  },
  
 


  {
    path: 'post/:id', loadComponent: () => import('./pages/post/post.component').then((m) => m.PostComponent),
  },
  {
    path: 'teacher-list', loadComponent: () => import('./teacher/teacher-list/teacher-list.component').then((m) => m.TeacherListComponent), title: 'Our-Teachers',
  },
  {
    path: 'tutorprofile-edit',
     loadComponent: () => import('./teacher/tutorprofile-edit/tutorprofile-edit.component').then((m) => m.TutorProfileEditComponent), 
     title: 'TutorProfileedit',
  },

  {
    path: 'create-course',
     loadComponent: () => import('./teacher/create-course/create-course.component').then((m) => m.CreateCourseComponent), 
     title: 'create-course',
  },

  {
    path: 'add-education',
     loadComponent: () => import('./teacher/add-education/add-education.component').then((m) => m.AddEducationComponent), 
     title: 'add-education',
  },

  
  {
    path: 'enquiry',
     loadComponent: () => import('./teacher/enquiry/enquiry.component').then((m) => m.enquiryComponent), 
     title: 'enquiry',
  },

 




  {
    path: 'add-experience',
     loadComponent: () => import('./teacher/add-experience/add-experience.component').then((m) => m.AddWorkExperienceComponent), 
     title: 'add-experience',
  },
  {
    path: 'whiteboard', loadComponent: () => import('./teacher/whiteboard/whiteboard.component').then((m) => m.WhiteboardComponent), title: 'AboutUs',
  },
  {
    path: 'about-us', loadComponent: () => import('./pages/about-us/about-us.component').then((m) => m.AboutUsComponent), title: 'AboutUs',
  },
  {
    path: 'legal/terms-of-service', loadComponent: () => import('./pages/terms-of-service/terms-of-service.component').then((m) => m.TermsOfServiceComponent,),
  },
  {
    path: 'legal/privacy-policy', loadComponent: () => import('./pages/privacy-policy/privacy-policy.component').then((m) => m.PrivacyPolicyComponent,),
  },
  { path: '**', redirectTo: '', },

];
