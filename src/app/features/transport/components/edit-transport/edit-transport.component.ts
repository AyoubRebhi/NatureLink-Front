import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TransportService } from '../../../../core/services/transport.service';
import { Transport } from '../../../../core/models/transport.model';

@Component({
  selector: 'app-edit-transport',
  templateUrl: './edit-transport.component.html',
  styleUrls: ['./edit-transport.component.scss']
})
export class EditTransportComponent implements OnInit {
  transport: Transport = {
    type: '',
    capacity: 0,
    pricePerKm: 0,
    available: true,
    imgUrl: ''
  };
  selectedImageFile!: File;
  id!: number;

  constructor(
    private transportService: TransportService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    const rawParam = this.route.snapshot.paramMap.get('id');
    console.log('Raw ID param:', rawParam); // 👀 Check this
    this.id = Number(rawParam ?? -1);
  
    if (isNaN(this.id) || this.id <= 0) {
      console.error('Invalid transport ID');
      alert('Invalid transport ID.');
      this.router.navigate(['/admin/transport']);
      return;
    }
  
    this.transportService.getTransportById(this.id).subscribe({
      next: (data) => {
        this.transport = data;
      },
      error: (err) => {
        console.error('Failed to load transport details:', err);
        alert('Transport not found.');
        this.router.navigate(['/admin/transport']);
      }
    });
  }
  

  onImageSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedImageFile = input.files[0];
    }
  }

  onSubmit(): void {
    if (!this.transport) return;
  
    const formData = new FormData();
  
    // Add JSON stringified transport under "transport" key
    formData.append('transport', new Blob(
      [JSON.stringify(this.transport)],
      { type: 'application/json' }
    ));
  
    // Add image if selected
    if (this.selectedImageFile) {
      formData.append('image', this.selectedImageFile);
    }
  
    this.transportService.updateTransportWithImage(this.id!, formData).subscribe({
      next: () => {
        alert('Transport updated successfully!');
        this.router.navigate(['/admin/transport']);
      },
      error: (err) => {
        console.error('Error updating transport:', err);
        alert('Failed to update transport.');
      }
    });
  }
  

  cancel(): void {
    this.router.navigate(['/admin/transport']);
  }
}
