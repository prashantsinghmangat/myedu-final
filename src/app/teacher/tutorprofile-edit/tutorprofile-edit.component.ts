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

  @ViewChild('form') form!: NgForm; // Accessing the form reference using ViewChild

  profile = {
    name: '',
    phone: '',
    designation: '',
    location: '',
    shortBio: '',
    aboutMe: '',
    skills: ''
  };

  education = [
    {
      instituteName: '',
      courseName: '',
      fieldOfStudy: '',
      startTime: '',
      endTime: '',
      grade: '',
      credentialUrl: ''
    }
  ];

  workExperience = [
    {
      organisationName: '',
      designation: '',
      type: 'Full-Time', // Default value set to 'Full-Time'
      startTime: '',
      endTime: ''
    }
  ];

  imageUrl: string | ArrayBuffer | null = null;
  loadingSig = false;  // To track loading state
  formSuccessSig = false;  // To track form submission success
  errorSig: any = null;  // To track any errors

  constructor(private readonly postsService: PostsService) { }

  // Function to handle image input
  handleImageChange(event: any): void {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.imageUrl = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  }

  addExperience() {
    this.workExperience.push({
      organisationName: '',
      designation: '',
      type: 'Full-Time',
      startTime: '',
      endTime: ''
    });
  }

  removeExperience(index: number) {
    this.workExperience.splice(index, 1);
  }

  addEducation() {
    this.education.push({
      instituteName: '',
      courseName: '',
      fieldOfStudy: '',
      startTime: '',
      endTime: '',
      grade: '',
      credentialUrl: ''
    });
  }

  removeEducation(index: number) {
    this.education.splice(index, 1);
  }

  // Submit function to gather form data and submit to the server
  submitProfile(): void {
    // const profileData = {
    //   profile: this.profile,
    //   workExperience: this.workExperience,
    //   education: this.education,
    //   profilePicUrl: this.imageUrl
    // };

    const basicDetails = {
      currentDesignation: this.profile?.designation,
      shortBio: this.profile?.shortBio,
      aboutMe: this.profile?.aboutMe,
      skills: this.profile?.skills
    };

    console.log('Form Submitted:', basicDetails);
    console.log('Form Submitted:', this.education);

    this.loadingSig = true;

    this.postsService.addTutorBasicDetails(basicDetails).subscribe((res: any) => {
      console.log("res: ", res?.data);
      this.form.reset();
      this.postsService.addTutorEducationDetails(this.education).subscribe((res: any) => {
        console.log("res: ", res?.data);
      });
    });

    // this.postsService.addTutorBasicDetails(basicDetails)
    //   .pipe(
    //     take(1),
    //     map(() => {
    //       this.form.reset();  // Reset the form upon successful submission
    //       this.formSuccessSig = true;
    //     }),
    //     catchError((e: ApiError) => {
    //       this.errorSig = e;  // Capture the error
    //       this.formSuccessSig = false;
    //       return of();  // Return an observable so that the stream does not break
    //     }),
    //     finalize(() => this.loadingSig = false)  // Set loading to false when done
    //   )
    //   .subscribe();


    // this.postsService.addTutorEducationDetails(this.education)
    //   .pipe(
    //     take(1),
    //     map(() => {
    //       this.formSuccessSig = true;
    //     }),
    //     catchError((e: ApiError) => {
    //       this.errorSig = e;  // Capture the error
    //       this.formSuccessSig = false;
    //       return of();  // Return an observable so that the stream does not break
    //     }),
    //     finalize(() => this.loadingSig = false)  // Set loading to false when done
    //   )
    //   .subscribe();

  }
}