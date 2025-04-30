// profile.component.ts
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../core/services/auth.service';
import { ProfileService } from '../../core/services/profile.service';
import { User } from '../../core/models/user.model';
import { Router } from '@angular/router';
import { DomSanitizer } from '@angular/platform-browser';
import { Subject, takeUntil } from 'rxjs';
import * as faceapi from 'face-api.js';
import { ImageService } from '../../core/services/image.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  private destroy$ = new Subject<void>();
  user: User | null = null;
  editForm!: FormGroup;
  isEditing = false;
  errorMessage = '';
  selectedFile: File | null = null;
  previewUrl: any;
  bioText = '';
  suggestions: string[] = [];
  loadingSuggestions = false;
  suggestionsError = '';
  faceDetectionMessage: string = '';
  modelsLoaded = false;

  constructor(
    public authService: AuthService,
    private profileService: ProfileService,
    private fb: FormBuilder,
    private router: Router,
    private sanitizer: DomSanitizer,
    private imageService: ImageService
  ) {}

  async ngOnInit(): Promise<void> {
    await this.loadFaceAPIModels();
    this.initUserSubscription();
  }

  private async loadFaceAPIModels(): Promise<void> {
  try {
    const MODEL_PATH = '/assets/models';
    
    await Promise.all([
      faceapi.nets.ssdMobilenetv1.loadFromUri(MODEL_PATH),
      faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_PATH),
      faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_PATH)
    ]);
    
    console.log('All FaceAPI models loaded');
    this.modelsLoaded = true;
  } catch (err) {
    console.error('Failed to load FaceAPI models:', err);
    this.modelsLoaded = false;
  }
}

  private initUserSubscription(): void {
    this.authService.currentUser$
      .pipe(takeUntil(this.destroy$))
      .subscribe(user => {
        if (!user || typeof user.id !== 'number') {
          console.error('Invalid user state:', user);
          this.authService.logout();
          return;
        }
        this.user = user;
        this.initializeForm();
      });
  }

  private initializeForm(): void {
    this.editForm = this.fb.group({
      username: [this.user?.username || '', Validators.required],
      email: [this.user?.email || '', [Validators.required, Validators.email]],
      password: ['']
    });
  }

  toggleEdit(): void {
    this.isEditing = !this.isEditing;
    if (this.isEditing) this.initializeForm();
  }

  onSubmit(): void {
    if (!this.user || typeof this.user.id !== 'number') {
      this.errorMessage = 'User not properly authenticated';
      this.authService.logout();
      return;
    }

    if (this.editForm.invalid) {
      this.errorMessage = 'Please fill all required fields';
      return;
    }

    const updateData = {
      username: this.editForm.value.username,
      email: this.editForm.value.email,
      ...(this.editForm.value.password && { password: this.editForm.value.password })
    };

    this.authService.updateUser(this.user.id, updateData).subscribe({
      next: (updatedUser) => {
        this.isEditing = false;
        this.errorMessage = '';
      },
      error: (err) => {
        this.errorMessage = 'Update failed. Please try again.';
        console.error('Update error:', err);
      }
    });
  }

  onDelete(): void {
    if (confirm('Are you sure you want to delete your account?') && this.user) {
      this.authService.deleteUser(this.user.id).subscribe({
        next: () => {
          this.authService.logout();
          this.router.navigate(['/login']);
        },
        error: (err) => {
          this.errorMessage = 'Delete failed. Please try again.';
          console.error('Delete error:', err);
        }
      });
    }
  }

  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (!file) return;

    this.selectedFile = file;
    this.preview();
  }

  private preview(): void {
    if (!this.selectedFile) return;
    
    const reader = new FileReader();
    reader.onload = () => {
      this.previewUrl = this.sanitizer.bypassSecurityTrustUrl(reader.result as string);
    };
    reader.readAsDataURL(this.selectedFile);
  }

  async onUpload(): Promise<void> {
    if (!this.selectedFile || !this.user || !this.modelsLoaded) {
      this.errorMessage = 'System not ready for upload';
      return;
    }

    try {
      // Step 1: Basic file validation
      this.faceDetectionMessage = 'Validating image...';
      if (!await this.validateFile()) return;

      // Step 2: Convert to image element
      const img = await faceapi.bufferToImage(this.selectedFile);
      
      // Step 3: Face detection
      this.faceDetectionMessage = 'Detecting faces...';
      const hasFace = await this.analyzeFace(img);
      if (!hasFace) {
        this.faceDetectionMessage = 'No face detected - please upload a photo with a clear face';
        return;
      }

      // Step 4: Image quality check
      this.faceDetectionMessage = 'Checking image quality...';
      const isValidQuality = await this.validateImageQuality(img);
      if (!isValidQuality) return;

      // Step 5: Upload to server
      this.faceDetectionMessage = 'Uploading profile picture...';
      await this.uploadProfilePicture();

      this.faceDetectionMessage = 'Upload successful!';
      setTimeout(() => this.faceDetectionMessage = '', 3000);

    } catch (err) {
      console.error('Upload process error:', err);
      this.faceDetectionMessage = 'Error processing image upload';
      this.errorMessage = err instanceof Error ? err.message : 'Unknown error';
    }
  }

  private async validateFile(): Promise<boolean> {
    if (!this.selectedFile) return false;

    // File size check
    const maxSize = 5 * 1024 * 1024;
    if (this.selectedFile.size > maxSize) {
      this.errorMessage = 'File size exceeds 5MB limit';
      return false;
    }

    // File type check
    if (!this.selectedFile.type.startsWith('image/')) {
      this.errorMessage = 'Only image files are allowed';
      return false;
    }

    return true;
  }

  private async analyzeFace(image: HTMLImageElement): Promise<boolean> {
    if (!this.modelsLoaded) {
      throw new Error('Face detection models not loaded');
    }
  
    try {
      const detections = await faceapi
        .detectAllFaces(image, new faceapi.SsdMobilenetv1Options({ 
            minConfidence: 0.6 
        }))
        .withFaceLandmarks() // Requires faceLandmark68Net
        .withFaceDescriptors(); // Requires faceRecognitionNet
  
      return detections.length > 0;
    } catch (err) {
      console.error('Face detection error:', err);
      throw new Error('Failed to analyze faces');
    }
  }

  private async validateImageQuality(img: HTMLImageElement): Promise<boolean> {
    const canvas = faceapi.createCanvasFromMedia(img);
    const ctx = canvas.getContext('2d');
    
    if (!ctx) {
      this.faceDetectionMessage = 'Error analyzing image quality';
      return false;
    }

    // Check dimensions
    if (img.width < 300 || img.height < 300) {
      this.faceDetectionMessage = 'Image too small - minimum 300x300 pixels';
      return false;
    }

    // Check brightness
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const brightness = this.calculateBrightness(imageData.data);
    
    if (brightness <= 0.2) {
      this.faceDetectionMessage = 'Image too dark';
      return false;
    }
    if (brightness >= 0.8) {
      this.faceDetectionMessage = 'Image too bright';
      return false;
    }

    return true;
  }

  private calculateBrightness(data: Uint8ClampedArray): number {
    let sum = 0;
    for (let i = 0; i < data.length; i += 4) {
      sum += (data[i] + data[i+1] + data[i+2]) / 3;
    }
    return sum / (data.length / 4) / 255;
  }

  private uploadProfilePicture(): Promise<void> {
    return new Promise((resolve, reject) => {
      if (!this.user || !this.selectedFile) {
        reject(new Error('Invalid upload state'));
        return;
      }

      this.authService.uploadProfilePicture(this.user.id, this.selectedFile)
        .subscribe({
          next: (updatedUser) => {
            this.user = updatedUser;
            this.authService.setCurrentUser(updatedUser);
            this.selectedFile = null;
            this.previewUrl = null;
            this.errorMessage = '';
            resolve();
          },
          error: (err) => {
            reject(err);
          }
        });
    });
  }

  getSuggestions(): void {
    if (!this.bioText.trim()) {
      this.suggestionsError = 'Please enter some bio text first';
      return;
    }

    this.loadingSuggestions = true;
    this.suggestionsError = '';
    this.suggestions = [];

    this.profileService.getSuggestions(this.bioText).subscribe({
      next: (suggestions) => {
        this.suggestions = [
          ...suggestions,
          'Use more industry-specific keywords',
          'Include both technical and soft skills',
          'Add a professional summary at the beginning'
        ].filter((v, i, a) => a.indexOf(v) === i);
        
        this.loadingSuggestions = false;
      },
      error: (err) => {
        this.suggestionsError = err.error?.message || 'Failed to get suggestions';
        this.loadingSuggestions = false;
      }
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}