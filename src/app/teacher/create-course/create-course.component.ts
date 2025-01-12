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
  imports: [FormsModule, CommonModule], // Include FormsModule here to use ngModel
})
export class CreateCourseComponent {
  // Model to store the course data
  course: {
    subject: string;
    board: string;
    class: string;
    weeklySession: number | null;
    costPerSession: number | null;
    currency: string;
    aboutThisCourse: string;
    courseThumbnail: string;
    language: string;
    mode: string;
    // teacherImage: File | null; // Define teacherImage as File or null
  } = {
      subject: '',
      board: '',
      class: '',
      weeklySession: null,
      costPerSession: null,
      currency: '',
      aboutThisCourse: '',
      courseThumbnail: '',
      language: '',
      mode: 'Online', // Default value set to 'Online'
      //  teacherImage: null, // Default value for teacherImage
    };

  classOptions: number[] = [5, 6, 7, 8, 9, 10, 11, 12];
  // teacherImagePreview: string | null = null; // To store the preview URL

  constructor(private readonly postsService: PostsService, private router: Router) { }

  // Method to handle form submission
  onSubmit() {
    if (this.isFormValid()) {
      console.log('Course created successfully:', this.course);

      // Create FormData for file upload
      const formData = new FormData();
      formData.append('subject', this.course.subject);
      formData.append('board', this.course.board);
      formData.append('className', this.course.class);
      formData.append('weeklySessions', String(this.course.weeklySession));
      formData.append('costPerSessions', String(this.course.costPerSession));
      formData.append('currency', this.course.currency);
      formData.append('aboutThisCourse', this.course.aboutThisCourse);
      formData.append('courseThumbnail', this.course.courseThumbnail);

      formData.append('language', this.course.language);
      formData.append('mode', this.course.mode);

      console.log("data from request: ", formData);


      /*  if (this.course.teacherImage) {
          formData.append('teacherImage', this.course.teacherImage); // Append image file
        } */

      this.postsService.createCourse(formData).subscribe((res: any) => {
        if (res.isSuccess === true) {
          console.log('res:', res?.data);
          alert('Course created successfully!');
          this.router.navigate(['/profile']);
          this.clearForm(); // Clear the form after submission
        }
      });
    } else {
      alert('Please fill out all fields correctly.');
    }
  }

  // Validation logic to ensure required fields are filled out
  isFormValid() {
    return (
      !!this.course.subject &&
      !!this.course.board &&
      !!this.course.class &&
      !!this.course.weeklySession &&
      !!this.course.costPerSession &&
      !!this.course.currency &&
      !!this.course.aboutThisCourse &&
      !!this.course.courseThumbnail &&
      !!this.course.language &&
      !!this.course.mode
    );
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
      courseThumbnail: '',
      language: '',
      mode: 'Online', // Reset to default value
      //  teacherImage: null, // Reset teacherImage
    };
    // this.teacherImagePreview = null; // Reset image preview
  }

  // Method to handle teacher image upload and preview
  /* onTeacherImageUpload(event: Event): void {
     const input = event.target as HTMLInputElement;
     if (input.files && input.files.length > 0) {
       const file = input.files[0];
 
       // Validation for file type (optional)
       if (!file.type.startsWith('image/')) {
         alert('Selected file is not an image.');
         return;
       }
 
       // Validation for file size (optional, e.g., 2 MB limit)
       if (file.size > 2 * 1024 * 1024) {
         alert('File size exceeds 2 MB.');
         return;
       }
 
       // Generate a preview URL
       const reader = new FileReader();
       reader.onload = () => {
         this.teacherImagePreview = reader.result as string; // Update preview
       };
       reader.readAsDataURL(file);
 
       // Save the image file to the course object
       this.course.teacherImage = file;
     }
   } */

  // list of subjects

  subjects: string[] = [
    'Mathematics',
    'English',
    'Science',
    'History',
    'Geography',
    'Physics',
    'Chemistry',
    'Biology',
    'Computer Science',
    'Economics',
    'Hindi',
    'Accounting'
  ];

  // School boards
  schoolBoardsShortform: string[] = [
    "IB",
    "IGCSE",
    "Edexcel",
    "OxfordAQA",
    "US Common Core",
    "College Board",
    "TDSB",
    "VSB",
    "CBE",
    "EPS",
    "AQA",
    "OCR",
    "WJEC",
    "CCEA",
    "BAC",
    "Abitur",
    "Maturità",
    "CITO",
    "Skolverket",
    "CBSE",
    "ICSE",
    "State Boards",
    "NIOS",
    "Gaokao",
    "MEXT",
    "GCE O-Level",
    "GCE A-Level",
    "NSC",
    "NESA",
    "VCAA",
    "ACARA",
    "NZQA"
  ];


}
