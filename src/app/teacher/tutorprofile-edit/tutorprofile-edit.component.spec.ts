import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TutorProfileEditComponent } from './tutorprofile-edit.component';

describe('AboutUsComponent', () => {
  let component: TutorProfileEditComponent;
  let fixture: ComponentFixture<TutorProfileEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TutorProfileEditComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TutorProfileEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
