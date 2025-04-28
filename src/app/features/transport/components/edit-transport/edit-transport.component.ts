import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TransportService } from '../../../../core/services/transport.service';
import { Transport } from '../../../../core/models/transport.model';
import { ToastrService } from 'ngx-toastr';
import { TransportType } from 'src/app/core/enums/transport-type.enum';
import { AuthService } from 'src/app/core/services/auth.service';

@Component({
  selector: 'app-edit-transport',
  templateUrl: './edit-transport.component.html',
  styleUrls: ['./edit-transport.component.scss']
})
export class EditTransportComponent implements OnInit {
  transportTypes = Object.values(TransportType); // Add this line for dropdown options
  
  transport: Transport = {
    type: TransportType.VOITURE, // Set default value
    capacity: 0,
    pricePerKm: 0,
    available: true,
    imgUrl: '',
    description: '',
    agenceId: this.authService.currentUserValue?.id ||0 // Use actual user ID instead of hardcoded 4
  };

  selectedImageFile: File | null = null;
  imagePreview: string | ArrayBuffer | null = null;
  isSubmitting = false;
  id!: number;

  constructor(
    private transportService: TransportService,
    private route: ActivatedRoute,
    private router: Router,
    private toastr: ToastrService,
    private authService: AuthService // Add this to constructor
  ) {}

  ngOnInit(): void {
    const rawParam = this.route.snapshot.paramMap.get('id');
    this.id = Number(rawParam ?? -1);
  
    if (isNaN(this.id) || this.id <= 0) {
      this.toastr.error('Invalid transport ID');
      this.router.navigate(['/admin/transport']);
      return;
    }
  
    this.transportService.getTransportById(this.id).subscribe({
      next: (data) => {
        this.transport = data;
      },
      error: (err) => {
        console.error('Failed to load transport details:', err);
        this.toastr.error('Failed to load transport details');
        this.router.navigate(['/admin/transport']);
      }
    });
  }

  onImageSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedImageFile = input.files[0];
      
      // Create preview
      const reader = new FileReader();
      reader.onload = () => {
        this.imagePreview = reader.result;
      };
      reader.readAsDataURL(this.selectedImageFile);
    }
  }

  onSubmit(): void {
    if (!this.transport) {
      this.toastr.error('Transport data is invalid');
      return;
    }
  
    this.isSubmitting = true;
    const formData = new FormData();
  
    formData.append('transport', new Blob(
      [JSON.stringify(this.transport)],
      { type: 'application/json' }
    ));
  
    if (this.selectedImageFile) {
      formData.append('image', this.selectedImageFile);
    }
  
    this.transportService.updateTransportWithImage(this.id, formData).subscribe({
      next: () => {
        this.toastr.success('Transport updated successfully!');
        this.router.navigate(['/admin/transport']);
      },
      error: (err) => {
        console.error('Error updating transport:', err);
        this.toastr.error('Failed to update transport');
        this.isSubmitting = false;
      },
      complete: () => {
        this.isSubmitting = false;
      }
    });
  }

  cancel(): void {
    this.router.navigate(['/admin/transport']);
  }
}