import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { PostsService } from '../../core/services/posts.service';
import { Router } from '@angular/router';

@Component({
  standalone: true,
  selector: 'create-course',
  templateUrl: './create-course.component.html',
  styleUrls: ['./create-course.component.scss'],
  imports: [FormsModule, CommonModule]  // Include FormsModule here to use ngModel
})
export class CreateCourseComponent {
  // Model to store the course data
  course = {
    subject: '',
    board: '',
    class: '',
    weeklySession: null,
    costPerSession: null,
    currency: '',
    aboutThisCourse: '',
    teacherProfile: '',
    language: '',
    mode: 'Online',  // Default value set to 'Online'
  };

  constructor(private readonly postsService: PostsService, private router: Router) { }

  // Method to handle form submission
  onSubmit() {
    if (this.isFormValid()) {
      console.log("Course created successfully:", this.course);
      const requestPayload = {
        subject: this.course?.subject,
        board: this.course?.board,
        className: this.course?.class,
        weeklySessions: this.course?.weeklySession,
        costPerSessions: this.course?.costPerSession,
        currency: this.course?.currency,
        aboutThisCourse: this.course?.aboutThisCourse,
        language: this.course?.language,
        mode: this.course?.mode,

        courseThumbnail: this.course?.subject,
      }

      this.postsService.createCourse(requestPayload).subscribe((res: any) => {
        if (res.isSuccess === true) {
          console.log("res: ", res?.data);
          alert("Course created successfully!");
          this.router.navigate(['/profile']);
          this.clearForm();  // Clear the form after submission
        }
      });
    } else {
      alert("Please fill out all fields correctly.");
    }
  }

  // Validation logic to ensure required fields are filled out
  isFormValid() {
    // Check for valid inputs in the course fields
    return !!this.course.subject && !!this.course.board && !!this.course.class &&
      !!this.course.weeklySession && !!this.course.costPerSession &&
      !!this.course.currency && !!this.course.aboutThisCourse &&
      !!this.course.teacherProfile && !!this.course.language && !!this.course.mode;
  }

  // Method to clear the form after successful submission
  clearForm() {
    this.course = {
      subject: '',
      board: '',
      class: '',
      weeklySession: null,
      costPerSession: null,
      currency: '',
      aboutThisCourse: '',
      teacherProfile: '',
      language: '',
      mode: 'Online'  // Reset to default value
    };
  }
}