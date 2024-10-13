import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  standalone: true,
  selector: 'app-whiteboard',
  templateUrl: './whiteboard.component.html',
  styleUrls: ['./whiteboard.component.scss'],
  imports: [FormsModule]
})
export class WhiteboardComponent implements OnInit {

  private canvas!: HTMLCanvasElement;
  private ctx!: CanvasRenderingContext2D;
  private drawing = false;
  private prevX = 0;
  private prevY = 0;
  public penColor: string = '#000000';
  public currentTool: string = 'pen';
  private points: { x: number; y: number }[] = [];
  private undoStack: ImageData[] = [];
  private redoStack: ImageData[] = [];
  public currentFrame: number = 1;
  public totalFrames: number = 1;
  private frames: ImageData[] = [];

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.initializeCanvas();
    }
  }

  initializeCanvas() {
    this.canvas = document.getElementById('whiteboard') as HTMLCanvasElement;
    const context = this.canvas.getContext('2d');
    if (!context) {
      console.error("Failed to get 2D context");
      return;
    }
    this.ctx = context;
    this.ctx.lineWidth = 2;
    this.ctx.strokeStyle = this.penColor;
    this.canvas.addEventListener('mousedown', this.startDrawing.bind(this));
    this.canvas.addEventListener('mousemove', this.draw.bind(this));
    this.canvas.addEventListener('pointermove', this.draw.bind(this));
    this.canvas.addEventListener('mouseup', this.stopDrawing.bind(this));
    this.canvas.addEventListener('mouseleave', this.stopDrawing.bind(this));


    this.loadWork();  // Load any previously saved work
    this.setupAutoSave();  // Set up automatic saving
  }

  // Clears the current frame (whiteboard) by resetting the canvas
  clearFrame(): void {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    localStorage.removeItem('whiteboardData');

  }

  // Moves to the previous frame
  previousFrame(): void {
    if (this.currentFrame > 1) {
      this.saveFrame();
      this.currentFrame--;
      this.loadFrame(this.currentFrame);
    }
  }

  // Moves to the next frame
  nextFrame(): void {
    if (this.currentFrame < this.totalFrames) {
      this.saveFrame();
      this.currentFrame++;
      this.loadFrame(this.currentFrame);
    } else {
      this.createNewFrame();
    }
  }

  // Saves the current frame's content to the frames array
  saveFrame(): void {
    const imageData = this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height);
    this.frames[this.currentFrame - 1] = imageData;
  }

  // Loads a specific frame onto the canvas
  loadFrame(frameNumber: number): void {
    const imageData = this.frames[frameNumber - 1];
    if (imageData) {
      this.ctx.putImageData(imageData, 0, 0);
    } else {
      this.clearFrame();
    }
  }

  // Creates a new blank frame and moves to it
  createNewFrame(): void {
    this.saveFrame();
    this.clearFrame();
    this.currentFrame++;
    this.totalFrames++;
  }

  // Existing drawing and tool methods...
  
  startDrawing(event: PointerEvent | MouseEvent): void {
    this.drawing = true;
    this.saveState();

    const rect = this.canvas.getBoundingClientRect();  // Get the position of the canvas relative to the viewport
    const scaleX = this.canvas.width / rect.width;    // Handle canvas scaling on X-axis
    const scaleY = this.canvas.height / rect.height;  // Handle canvas scaling on Y-axis

    this.prevX = (event.clientX - rect.left) * scaleX;  // Adjust for scale and canvas position
    this.prevY = (event.clientY - rect.top) * scaleY;

    this.points.push({ x: this.prevX, y: this.prevY });

    const pressure = event instanceof PointerEvent ? event.pressure || 1 : 1;
    this.ctx.lineWidth = pressure * 5;

    if (this.currentTool === 'eraser') {
      this.ctx.strokeStyle = '#FFFFFF';
    } else {
      this.ctx.strokeStyle = this.penColor;
    }
  }

draw(event: PointerEvent | MouseEvent): void {
    if (!this.drawing) return;

    const rect = this.canvas.getBoundingClientRect();  // Get the position of the canvas relative to the viewport
    const scaleX = this.canvas.width / rect.width;    // Handle canvas scaling on X-axis
    const scaleY = this.canvas.height / rect.height;  // Handle canvas scaling on Y-axis

    const currX = (event.clientX - rect.left) * scaleX;  // Adjust for scale and canvas position
    const currY = (event.clientY - rect.top) * scaleY;

    this.points.push({ x: currX, y: currY });

    if (this.points.length >= 3) {
      const lastIndex = this.points.length - 1;
      const ctrlPointX = (this.points[lastIndex].x + this.points[lastIndex - 1].x) / 2;
      const ctrlPointY = (this.points[lastIndex].y + this.points[lastIndex - 1].y) / 2;
      this.ctx.beginPath();
      this.ctx.moveTo(this.points[lastIndex - 2].x, this.points[lastIndex - 2].y);
      this.ctx.quadraticCurveTo(this.points[lastIndex - 1].x, this.points[lastIndex - 1].y, ctrlPointX, ctrlPointY);
      this.ctx.stroke();
    }

    this.prevX = currX;
    this.prevY = currY;

    this.saveWork();
  }


  stopDrawing(): void {
    this.drawing = false;
    this.points = [];
  }

  setTool(tool: string): void {
    this.currentTool = tool;
    if (tool === 'highlighter') {
      this.ctx.strokeStyle = 'rgba(255, 255, 0, 0.5)';
      this.ctx.lineWidth = 10;
    } else {
      this.ctx.lineWidth = 2;
    }
  }

  saveState(): void {
    const imageData = this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height);
    this.undoStack.push(imageData);
    this.redoStack = [];
  }

  undo(): void {
    if (this.undoStack.length > 0) {
      const currentState = this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height);
      this.redoStack.push(currentState);
      const prevState = this.undoStack.pop();
      if (prevState) {
        this.ctx.putImageData(prevState, 0, 0);
      }
    }
  }

  redo(): void {
    if (this.redoStack.length > 0) {
      const currentState = this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height);
      this.undoStack.push(currentState);
      const nextState = this.redoStack.pop();
      if (nextState) {
        this.ctx.putImageData(nextState, 0, 0);
      }
    }
  }

  uploadImage(event: Event): void {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file && this.ctx) {
      const reader = new FileReader();
      reader.onload = (e: ProgressEvent<FileReader>) => {
        const img = new Image();
        img.onload = () => {
          this.ctx.drawImage(img, 0, 0, this.canvas.width, this.canvas.height);
        };
        img.src = e.target!.result as string;
      };
      reader.readAsDataURL(file);
    }
  }

  share(): void {
    const dataUrl = this.canvas.toDataURL('image/png');
    const link = document.createElement('a');
    link.download = 'my-whiteboard.png';
    link.href = dataUrl;
    link.click();
  }

  startGoogleMeet(): void {
    const googleMeetURL = 'https://meet.google.com/new';  // New meeting link for Google Meet
    window.open(googleMeetURL, '_blank');  // Opens Google Meet in a new tab
  }

  setupAutoSave(): void {
    setInterval(() => this.saveWork(), 300000);  // Save every 5 minutes
  }

  saveWork(): void {
    const canvasData = this.canvas.toDataURL();
    localStorage.setItem('whiteboardData', canvasData);
  }

  loadWork(): void {
    const savedCanvasData = localStorage.getItem('whiteboardData');
    if (savedCanvasData) {
      const img = new Image();
      img.src = savedCanvasData;
      img.onload = () => {
        this.ctx.drawImage(img, 0, 0);
      };
    }
  }

  
}