import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { TransportService } from '../../../../core/services/transport.service';
import { Transport } from '../../../../core/models/transport.model';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-add-transport',
  templateUrl: './add-transport.component.html',
  styleUrls: ['./add-transport.component.scss']
})
export class AddTransportComponent {
  transport: Transport = {
    type: '',
    capacity: 0,
    pricePerKm: 0,
    available: true,
    imgUrl: '',
    description: ''
  };

  selectedImageFile: File | null = null;
  imagePreview: string | ArrayBuffer | null = null;
  isSubmitting = false;
  formSubmitted = false; // Add this line


  constructor(
    private transportService: TransportService,
    private router: Router,
    private toastr: ToastrService
  ) {}

  onImageSelected(event: Event): void {
    const fileInput = event.target as HTMLInputElement;
    if (fileInput.files && fileInput.files.length > 0) {
      this.selectedImageFile = fileInput.files[0];
      
      // Create image preview
      const reader = new FileReader();
      reader.onload = () => {
        this.imagePreview = reader.result;
      };
      reader.readAsDataURL(this.selectedImageFile);
    }
  }

  onSubmit(): void {
    this.formSubmitted = true; // Add this line
    
    if (!this.selectedImageFile) {
      this.toastr.error('Please select an image!', 'Error');
      return;
    }

    this.isSubmitting = true;

    const formData = new FormData();
    const transportBlob = new Blob(
      [JSON.stringify(this.transport)],
      { type: 'application/json' }
    );

    formData.append('transport', transportBlob);
    formData.append('image', this.selectedImageFile);

    this.transportService.addTransportWithImage(formData).subscribe({
      next: () => {
        this.toastr.success('Transport added successfully!', 'Success');
        this.router.navigate(['/admin/transport']);
      },
      error: (err) => {
        console.error('Error adding transport:', err);
        this.toastr.error('Failed to add transport. Please try again.', 'Error');
        this.isSubmitting = false;
      }
    });
  }

  cancel(): void {
    this.router.navigate(['/admin/transport']);
  }
}