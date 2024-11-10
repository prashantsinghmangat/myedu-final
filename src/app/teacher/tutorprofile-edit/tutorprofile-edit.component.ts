import { Component, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { PostsService } from '../../core/services/posts.service';
import { Router } from '@angular/router';

@Component({
  standalone: true,
  selector: 'tutorprofile-edit',
  templateUrl: './tutorprofile-edit.component.html',
  styleUrls: ['./tutorprofile-edit.component.scss'],
  imports: [FormsModule, CommonModule]  // Include FormsModule and CommonModule here
})
export class TutorProfileEditComponent {

  profileImage: string | ArrayBuffer | null = null;

  constructor(private readonly postsService: PostsService, private router: Router) { }

  onFileChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const reader = new FileReader();
      reader.onload = (e: ProgressEvent<FileReader>) => {
        this.profileImage = e.target?.result as string | ArrayBuffer;
        console.log("this.profile: ", this.profileImage)
      };
      reader.readAsDataURL(input.files[0]);
    }
  }

  onSubmitprofile(profileForm: NgForm) {
    if (profileForm.valid) {
      const requestPayload = {
        currentDesignation: profileForm.value.currentDesignation,
        shortBio: profileForm.value.shortBio,
        aboutMe: profileForm.value.aboutMe,
        skills: profileForm.value.skills,
        WhatsAppNumber: profileForm.value.whatsappNumber,
        FullAdddress: profileForm.value.address,
      };

      this.postsService.addTutorBasicDetails(requestPayload).subscribe({
        next: (res: any) => {
          if (res.isSuccess) {
            alert("Basic Details successfully submitted!");
            profileForm.reset();
            this.router.navigate(['/profile']);
          }
        },
        error: (err) => {
          console.error("Error submitting profile:", err);
          alert("There was an error submitting your profile.");
        }
      });
    }
  }
}