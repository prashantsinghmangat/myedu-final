import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'about-us',
  standalone: true,
  imports: [],
  templateUrl: './teacher-list.component.html',
  styleUrl: './teacher-list.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TeacherListComponent {}
