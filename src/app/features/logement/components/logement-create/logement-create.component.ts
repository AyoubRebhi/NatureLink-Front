import { Component, OnInit } from '@angular/core';
import { LogementService } from '../../../../core/services/logement.service';
import { EquipementService } from 'src/app/core/services/equipement.service';
import { UserService } from 'src/app/core/services/user.service';
import { Router } from '@angular/router';
import { Equipement } from 'src/app/core/models/equipement.model';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-logement-create',
  templateUrl: './logement-create.component.html',
  styleUrls: ['./logement-create.component.scss'],
})
export class LogementCreateComponent implements OnInit {
  logement: any = {
    titre: '',
    description: '',
    location: '',
    price: 0,
    images: [],
    phone: '',
    email: '',
    capacity: '',
    socialMedia: '',
    // For equipements
    equipementIds: [],
    newEquipements: [],
    // For type, default is HOUSE
    type: 'HOUSE',
    // New field to store the selected proprietaire id
    proprietarield: ''
  };

  equipements: Equipement[] = [];
  newEquipementName: string = '';
  newEquipementList: string[] = [];
  imageFiles: File[] = []; // For storing selected images
  imagePreviews: string[] = []; // For preview URLs
  users: any[] = []; // To hold the list of users

  constructor(
    private logementService: LogementService,
    private equipementService: EquipementService,
    private userService: UserService,
    private router: Router,
    private http: HttpClient
  ) {}

  ngOnInit() {
    // Load available equipements from the backend
    this.equipementService.getAll().subscribe((data) => {
      this.equipements = data;
    });
  
    // Load all users and filter by role (AGENCE or PROVIDER)
    this.userService.getAllUsers().subscribe((data) => {
      this.users = data.filter((user: any) => 
        user.role === 'AGENCE' || user.role === 'PROVIDER'
      );
      console.log('Filtered users loaded:', this.users); // Debugging line
    });
  }
  

  onImagesSelected(event: any) {
    const files: FileList = event.target.files;
    if (files.length > 0) {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        this.imageFiles.push(file);

        const reader = new FileReader();
        reader.onload = () => {
          this.imagePreviews.push(reader.result as string);
        };
        reader.readAsDataURL(file);
      }
    }
  }

  addNewEquipement() {
    if (this.newEquipementName.trim() !== '') {
      this.newEquipementList.push(this.newEquipementName.trim());
      this.newEquipementName = '';
      this.logement.newEquipements = [...this.newEquipementList];
    }
  }

  removeNewEquipement(index: number) {
    this.newEquipementList.splice(index, 1);
    this.logement.newEquipements = [...this.newEquipementList];
  }

  showRoomFields(): boolean {
    return this.logement.type === 'HOUSE' || this.logement.type === 'MAISON_DHOTE';
  }

  onEquipementChange(equipementId: number, event: Event): void {
    const isChecked = (event.target as HTMLInputElement).checked;
    this.toggleEquipement(equipementId, isChecked);
  }

  toggleEquipement(id: number, checked: boolean) {
    if (checked) {
      if (!this.logement.equipementIds.includes(id)) {
        this.logement.equipementIds.push(id);
      }
    } else {
      this.logement.equipementIds = this.logement.equipementIds.filter((eid: number) => eid !== id);
    }
  }

  removeImage(index: number): void {
    this.imageFiles.splice(index, 1);
    this.imagePreviews.splice(index, 1);
  }
  
  onSubmit() {
    const formData = new FormData();

    // Append all required logement fields
    formData.append('titre', this.logement.titre);
    formData.append('description', this.logement.description);
    formData.append('location', this.logement.location);
    formData.append('price', this.logement.price.toString());
    formData.append('phone', this.logement.phone);
    formData.append('email', this.logement.email);
    formData.append('socialMedia', this.logement.socialMedia);
    formData.append('type', this.logement.type);
    formData.append('capacity', this.logement.capacity.toString());
    
    // Append room fields if present
    if (this.logement.singleRooms !== undefined) {
      formData.append('singleRooms', this.logement.singleRooms.toString());
    }
    if (this.logement.doubleRooms !== undefined) {
      formData.append('doubleRooms', this.logement.doubleRooms.toString());
    }
  
    // Append proprietaireId from the select (converted to string)
    formData.append('proprietaireId', this.logement.proprietarield.toString());

    // Append existing equipement IDs
    this.logement.equipementIds.forEach((id: number) => {
      formData.append('equipementIds', id.toString());
    });
  
    // Append new equipements
    this.newEquipementList.forEach((eq: string) => {
      formData.append('newEquipements', eq);
    });
  
    // Append all selected image files
    this.imageFiles.forEach((file) => {
      formData.append('images', file, file.name);
    });
  
    // Submit the form data to the backend
    this.http.post('http://backend/picloud/logements/upload', formData).subscribe(
      response => {
        console.log('Logement created!', response);
        this.router.navigate(['/admin/logement/list']); // Redirect to list page
      },
      error => {
        console.error('Error creating logement:', error);
      }
    );
  }
}
