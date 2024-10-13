import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnDestroy, OnInit, signal, } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators, FormControl } from '@angular/forms';
import { MarkdownComponent } from 'ngx-markdown';
import { Subject, catchError, finalize, map, of, take, takeUntil, tap, } from 'rxjs';
import { ApiError } from '../../core/models/api.model';
import { PostsService } from '../../core/services/posts.service';
import { TagsInputComponent } from '../../shared/tags-input/tags-input.component';


@Component({
  selector: 'til-new-post',
  standalone: true,
  imports: [
    MarkdownComponent,
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    TagsInputComponent,
  ],
  templateUrl: './new-post.component.html',
  styleUrl: './new-post.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NewPostComponent implements OnInit, OnDestroy {
  form: FormGroup;
  loadingSig = signal(false);
  errorSig = signal<null | ApiError>(null);
  formSuccessSig = signal(false);
  private readonly onDestroy$ = new Subject<void>();

  classes = Array.from({ length: 12 }, (_, i) => i + 1); // Classes 1 to 12
  subjects = ['Mathematics', 'Hindi', 'Science', 'Biology']; // Add more subjects as needed
  boards = ['CBSE', 'ICSE', 'IB']; // School Boards

  editorControl = new FormControl(''); // Form control for the editor content

  constructor(
    private readonly formBuilder: FormBuilder,
    private readonly postsService: PostsService,
  ) {
    this.form = this.formBuilder.group({
      title: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(100)]],
      notesClass: ['', Validators.required],
      notesSubject: ['', Validators.required],
      schoolBoard: ['', Validators.required],
      // description: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(250)]],
      // content: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(5000)]],
      tags: [[]] // Add other form controls as necessary

      // title: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(100),],],
      // notesClass: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(100),],],
      // description: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(250),],],
      // content: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(5000),],],
      // tags: [[]],
    });
  }

  content: string = ''; // To store the HTML content from the editor
  onInput(event: Event): void {
    const element = event.target as HTMLElement;
    this.editorControl.setValue(element.innerHTML); // Set the content in the FormControl
  }
  // Handle user input in the contenteditable div
  // onInput(event: Event): void {
  //   const element = event.target as HTMLElement;
  //   this.content = element.innerHTML; // Store the content as HTML
  // }

  // Apply Bold formatting to selected text
  applyBold() {
    document.execCommand('bold'); // Use built-in browser command to apply bold formatting
  }

  // Apply Italic formatting to selected text
  applyItalic() {
    document.execCommand('italic');
  }

  // Apply Underline formatting to selected text
  applyUnderline() {
    document.execCommand('underline');
  }

  ngOnInit(): void {
    this.form.valueChanges.pipe(takeUntil(this.onDestroy$), tap(() => { this.formSuccessSig.set(false); this.errorSig.set(null); }),).subscribe();
  }

  ngOnDestroy() {
    this.onDestroy$.next();
    this.onDestroy$.complete();
  }

  handleTags(tags: string[]) {
    this.form.get('tags')?.setValue(tags);
  }

  submit(): void {
    this.form.markAllAsTouched();
    this.errorSig.set(null);
    this.formSuccessSig.set(false);
    if (!this.form.valid) return;
    this.loadingSig.set(true);
    const requestPayload = {
      title: this.form.value.title,
      notesBoard: this.form.value.schoolBoard,
      notesClass: this.form.value.notesClass,
      notesSubject: this.form.value.notesSubject,
      chapter: '2',
      body: this.editorControl.value,
      tags: this.form.value.tags
    }
    console.log("requestPayload value: ", requestPayload)
    this.postsService.createPost(requestPayload).pipe(take(1), map(() => {
      this.form.reset();
      this.formSuccessSig.set(true);
    }),
      catchError((e: ApiError) => {
        this.errorSig.set(e);
        this.formSuccessSig.set(false);
        return of();
      }), finalize(() => this.loadingSig.set(false)),
    )
      .subscribe();
  }
}
