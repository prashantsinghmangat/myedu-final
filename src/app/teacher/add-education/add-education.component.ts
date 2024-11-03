import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  standalone: true,
  selector: 'add-education',
  templateUrl: './add-education.component.html',
  styleUrls: ['./add-education.component.scss'],
  imports: [FormsModule, CommonModule]
})
export class AddEducationComponent {
  submitForm(form: NgForm) {
   
  }
}
