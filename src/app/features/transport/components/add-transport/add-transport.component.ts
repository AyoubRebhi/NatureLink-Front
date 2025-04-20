import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { TransportService } from '../../../../core/services/transport.service';
import { Transport } from '../../../../core/models/transport.model';

@Component({
  selector: 'app-add-transport',
  templateUrl: './add-transport.component.html',
  styleUrls: ['./add-transport.component.scss']
})
export class AddTransportComponent {
cancel() {
throw new Error('Method not implemented.');
}
  transport: Transport = {
    type: '',
    capacity: 0,
    pricePerKm: 0,
    available: true,
    imgUrl: ''
  };

  selectedImageFile!: File;

  constructor(private transportService: TransportService, private router: Router) {}

  onImageSelected(event: Event): void {
    const fileInput = event.target as HTMLInputElement;
    if (fileInput.files && fileInput.files.length > 0) {
      this.selectedImageFile = fileInput.files[0];
    }
  }

  onSubmit(): void {
    if (!this.selectedImageFile) {
      alert('Please select an image!');
      return;
    }
  
    const formData = new FormData();
  
    // send as JSON blob under the key "transport"
    const transportBlob = new Blob(
      [JSON.stringify(this.transport)],
      { type: 'application/json' }
    );
  
    formData.append('transport', transportBlob); // 👈 matches @RequestPart("transport")
    formData.append('image', this.selectedImageFile); // 👈 matches @RequestPart("image")
  
    this.transportService.addTransportWithImage(formData).subscribe({
      next: () => {
        alert('Transport added successfully!');
        this.router.navigate(['/admin/transport']);
      },
      error: (err) => {
        console.error('Error adding transport:', err);
        alert('Failed to add transport.');
      }
    });
  }
  
}
