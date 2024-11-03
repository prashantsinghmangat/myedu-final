import { Component,ViewChild } from '@angular/core';
import {  CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';  // NgForm added to handle form reference
import { PostsService } from '../../core/services/posts.service';
import { take, map, catchError, finalize, of } from 'rxjs';  // Imported RxJS operators
import { ApiError } from '../../core/models/api.model'; // Assuming you have an ApiError class

@Component({
  standalone: true,
  selector: 'tutorprofile-edit',
  templateUrl: './tutorprofile-edit.component.html',
  styleUrls: ['./tutorprofile-edit.component.scss'],
  imports: [FormsModule, CommonModule]  // Include FormsModule and CommonModule here
})
export class TutorProfileEditComponent {
  profileImage: string | ArrayBuffer | null = null; // Initialize the property

  // Method to handle file input changes
  onFileChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const reader = new FileReader();
      reader.onload = (e: ProgressEvent<FileReader>) => {
        this.profileImage = e.target?.result as string | ArrayBuffer; // Type assertion
      };
      reader.readAsDataURL(input.files[0]);
    }
  }

  onSubmitprofile(workExpForm: NgForm) {
    if (workExpForm.valid) {
      console.log('Work Experience Submitted!', workExpForm.value);
      
      // Handle data submission logic, such as saving to a database or API call
      // Example: this.workExpService.saveExperience(workExpForm.value);
      
      workExpForm.reset();
    }
  }


}