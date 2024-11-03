import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  standalone: true,
  selector: 'add-experience',
  templateUrl: './add-experience.component.html',
  styleUrls: ['./add-experience.component.scss'],
  imports: [FormsModule, CommonModule]
})
export class AddWorkExperienceComponent {
  onSubmit(workExpForm: NgForm) {
    if (workExpForm.valid) {
      console.log('Work Experience Submitted!', workExpForm.value);
      
      // Handle data submission logic, such as saving to a database or API call
      // Example: this.workExpService.saveExperience(workExpForm.value);
      
      workExpForm.reset();
    }
  }
}