import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { LogementService } from '../../../../core/services/logement.service';
import { EquipementService } from 'src/app/core/services/equipement.service';

@Component({
  selector: 'app-logement-edit-user',
  templateUrl: './logement-edit-user.component.html',
  styleUrls: ['./logement-edit-user.component.scss']
})
export class LogementEditUserComponent implements OnInit {
  logementForm!: FormGroup;
  logementId!: number;
  allEquipements: any[] = [];
  logement: any;
  imagePreviews: string[] = [];
  newImages: File[] = [];
  removedImages: string[] = [];
  imageFiles: File[] = [];
  newImagePreviews: string[] = []; // Only for new images
  
  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private logementService: LogementService,
    private equipementService: EquipementService
  ) {
    this.logementForm = this.fb.group({
      titre: ['', [Validators.required, Validators.pattern('^[a-zA-Z0-9 ]+$')]],
      description: [''],
      location: [''],
      type: [''],
      price: [0, [Validators.required, Validators.min(1)]],
      image: [''],
      phone: ['', [Validators.required, Validators.pattern('^[0-9]{8}$')]],
      email: ['', [Validators.required, Validators.email]],
      capacity: ['', [Validators.required, Validators.min(1)]],
      socialMedia: [''],
      singleRooms: [0, [Validators.required, Validators.min(0)]],
      doubleRooms: [0, [Validators.required, Validators.min(0)]],
      equipements: [[]],
    });
  }

  ngOnInit(): void {
    this.logementId = +this.route.snapshot.paramMap.get('id')!;

    this.logementService.getLogementById(this.logementId).subscribe((logement) => {
      if (!logement) {
        console.error('Logement not found!');
        return;
      }

      this.logement = logement;
      this.logementForm.patchValue(logement);
      this.logementForm.get('equipements')?.setValue(
        logement.equipements?.map((e: any) => e.id)
      );
    });

    this.equipementService.getAll().subscribe((data) => {
      this.allEquipements = data;
    });
  }

  onEquipementToggle(event: any) {
    const selected = this.logementForm.get('equipements')?.value || [];
    let updated: number[] = [];
    const id = +event.target.value;

    if (event.target.checked) {
      updated = [...selected, id];
    } else {
      updated = selected.filter((val: number) => val !== id);
    }

    this.logementForm.get('equipements')?.setValue(updated);
    this.logementForm.get('equipements')?.markAsDirty();
  }

  onImagesSelected(event: any) {
    const files = event.target.files;
    if (files && files.length > 0) {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        this.newImages.push(file);

        const reader = new FileReader();
        reader.onload = (e: any) => {
          this.newImagePreviews.push(e.target.result);
        };
        reader.readAsDataURL(file);
      }
    }
  }

  removeExistingImage(index: number) {
    const removed = this.logement.images.splice(index, 1)[0];
    this.removedImages.push(removed);  // Add to removed images
  }

  removeNewImage(index: number) {
    this.newImages.splice(index, 1);
    this.newImagePreviews.splice(index, 1);
  }

  removeImage(index: number): void {
    this.imageFiles.splice(index, 1);
    this.imagePreviews.splice(index, 1);
  }

  onSubmit() {
    if (this.logementForm.valid) {
      const formValue = this.logementForm.value;
      const formData = new FormData();

      formData.append('titre', formValue.titre);
      formData.append('description', formValue.description);
      formData.append('location', formValue.location);
      formData.append('type', formValue.type);
      formData.append('price', formValue.price?.toString() || '0');
      formData.append('phone', formValue.phone);
      formData.append('email', formValue.email);
      formData.append('capacity', formValue.capacity?.toString() || '0');
      formData.append('socialMedia', formValue.socialMedia);
      formData.append('singleRooms', formValue.singleRooms?.toString() || '0');
      formData.append('doubleRooms', formValue.doubleRooms?.toString() || '0');

      const proprietaireId = this.logement?.proprietaireId ?? 5;
      formData.append('proprietaireId', proprietaireId.toString());

      // Append new image files
      this.newImages.forEach((file) => {
        formData.append('images', file);
      });

      // ✅ Safely append equipements
      if (Array.isArray(formValue.equipements) && formValue.equipements.length > 0) {
        formValue.equipements.forEach((equipementId: number) => {
          formData.append('equipements', equipementId.toString());
        });
      } else {
        console.warn('No equipements selected or loaded.');
      }

      // Append existing images
      const remainingImages = this.logement.images.filter(
        (img: string) => !this.removedImages.includes(img)
      );
      remainingImages.forEach((imageName: string) => {
        formData.append('existingImages', imageName);
      });

      // Append removed images
      this.removedImages.forEach((imageName: string) => {
        formData.append('removedImages', imageName);
      });

      // Submit
      this.logementService.updateLogementWithImage(this.logementId, formData).subscribe(
        (response) => {
          console.log('Logement updated successfully', response);
          this.router.navigate(['/dashboardUser/list']);
        },
        (error) => {
          console.error('Error updating logement', error);
        }
      );
    }
  }
}
