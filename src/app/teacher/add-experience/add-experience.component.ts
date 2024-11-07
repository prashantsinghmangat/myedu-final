import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { PostsService } from '../../core/services/posts.service';
import { Router } from '@angular/router';

@Component({
  standalone: true,
  selector: 'add-experience',
  templateUrl: './add-experience.component.html',
  styleUrls: ['./add-experience.component.scss'],
  imports: [FormsModule, CommonModule]
})
export class AddWorkExperienceComponent {

  constructor(private readonly postsService: PostsService, private router: Router,) { }

  onSubmit(workExpForm: NgForm) {
    if (workExpForm.valid) {
      console.log('Work Experience Submitted!', workExpForm.value);

      // Extract form values
      const workExperience = {
        organisationName: workExpForm.value.organisationName,
        designation: workExpForm.value.designation,
        type: workExpForm.value.type || 'Full-Time', // Set to 'Full-Time' if not provided
        startTime: workExpForm.value.startTime,
        endTime: workExpForm.value.endTime,
        credentialUrl: workExpForm.value.joiningLetterLink
      };

      // Submit form data using PostsService
      this.postsService.addTutorsExperienceDetails(workExperience).subscribe(
        (res: any) => {
          console.log("Response from server:", res?.data);
          if (res?.isSuccess === true) {
            this.router.navigate(['/profile']);
            // Reset the form after successful submission
            workExpForm.reset();
          }


        },
        (error: any) => {
          console.error("Error submitting work experience:", error);
        }
      );
    }
  }
}