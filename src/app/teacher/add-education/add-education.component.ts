import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { PostsService } from '../../core/services/posts.service';
import { Router } from '@angular/router';

@Component({
  standalone: true,
  selector: 'add-education',
  templateUrl: './add-education.component.html',
  styleUrls: ['./add-education.component.scss'],
  imports: [FormsModule, CommonModule]
})
export class AddEducationComponent {

  constructor(private readonly postsService: PostsService, private router: Router,) { }

  submitForm(eduExperience: NgForm) {
    if (eduExperience.valid) {
      console.log('Work Experience Submitted!', eduExperience.value);

      // Extract form values
      const eduexperiance = {
        instituteName: eduExperience.value.instituteName,
        courseName: eduExperience.value.courseName,
        fieldOfStudy: eduExperience.value.fieldOfStudy, // Set to 'Full-Time' if not provided
        startTime: eduExperience.value.startTime,
        endTime: eduExperience.value.endTime,
        grade: eduExperience.value.grade,
        credentialUrl: eduExperience.value.credentialUrl
      };

      // Submit form data using PostsService
      this.postsService.addTutorEducationDetails(eduexperiance).subscribe(
        (res: any) => {
          console.log("Response from server:", res?.data);
          if (res?.isSuccess === true) {
            this.router.navigate(['/profile']);
            // Reset the form after successful submission
            eduExperience.reset();
          }


        },
        (error: any) => {
          console.error("Error submitting work experience:", error);
        }
      );
    }
  }
}
