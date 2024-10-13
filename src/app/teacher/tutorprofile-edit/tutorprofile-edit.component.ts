import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms'; // <-- Import FormsModule here

@Component({
  selector: 'tutorprofile-edit',
  templateUrl: './tutorprofile-edit.component.html',
  styleUrls: ['./tutorprofile-edit.component.scss'],
  standalone: true,
  imports: [FormsModule, CommonModule, RouterModule],
})
export class TutorProfileEditComponent {
  profile = {
    name: '',
    phone: '',
    designation: '',
    location: '',
    shortBio: '',
    aboutMe: '',
    skills: ''
  };

  workExperience = [{
    organisationName: '',
    designation: '',
    type: 'Self',
    startTime: '',
    endTime: ''
  }];

  education = [{
    instituteName: '',
    courseName: ''
  }];

  imageUrl: string | null = null;

  handleImageChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.imageUrl = e.target.result;
      };
      reader.readAsDataURL(input.files[0]);
    }
  }

  addExperience(): void {
    this.workExperience.push({
      organisationName: '',
      designation: '',
      type: 'Self',
      startTime: '',
      endTime: ''
    });
  }

  removeExperience(index: number): void {
    this.workExperience.splice(index, 1);
  }

  addEducation(): void {
    this.education.push({
      instituteName: '',
      courseName: ''
    });
  }

  removeEducation(index: number): void {
    this.education.splice(index, 1);
  }

  onSubmit(form: NgForm): void {
    if (form.valid) {
      const formData = {
        profile: this.profile,
        workExperience: this.workExperience,
        education: this.education
      };
      console.log('Form Data:', formData);
      // Save the data or make an API call
    }
  }
}