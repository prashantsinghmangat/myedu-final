import { ChangeDetectionStrategy, Component, Inject, PLATFORM_ID, signal, } from '@angular/core';
import { SignupModalComponent } from '../../shared/signup-form/signup-modal.component';

import { BehaviorSubject } from 'rxjs';

@Component({
  imports: [SignupModalComponent],
  selector: 'tutor-page',
  templateUrl: './tutor-page.component.html',
  styleUrls: ['./tutor-page.component.scss'],
  standalone: true,
  
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TutorPageComponent {
  showSignUpSig = signal(false);

  toggleSignUpModal(): void {
    this.showSignUpSig.update((value) => !value);
  }
}
