import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'about-us',
  standalone: true,
  imports: [],
  templateUrl: './about-us.component.html',
  styleUrl: './about-us.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AboutUsComponent {}
