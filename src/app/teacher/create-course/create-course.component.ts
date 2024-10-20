import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser, CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  standalone: true,
  selector: 'create-course',
  templateUrl: './create-course.component.html',
  styleUrls: ['./create-course.component.scss'],
  imports: [FormsModule, CommonModule]  // Include CommonModule here to use ngFor
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

  // Method to handle form submission
  onSubmit() {
    if (this.isFormValid()) {
      console.log("Course created successfully:", this.course);
      // Add logic to handle course creation (e.g., send data to the server or save locally)
      alert("Course created successfully!");
      this.clearForm();  // Clear the form after submission if necessary
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