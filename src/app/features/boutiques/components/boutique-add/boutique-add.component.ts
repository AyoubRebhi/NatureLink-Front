import { Component, OnInit } from '@angular/core';
import { FormBuilder,FormGroup, Validators } from '@angular/forms';
import { Boutique } from 'src/app/core/models/boutique.module';
import { Produit } from 'src/app/core/models/produit.module';
import { BoutiqueService } from 'src/app/services/boutique.service';
import { Router } from '@angular/router';
@Component({
  selector: 'app-boutique-add',
  templateUrl: './boutique-add.component.html',
  styleUrls: ['./boutique-add.component.scss']
})
export class BoutiqueAddComponent implements OnInit {
  BoutiqueForm !:FormGroup;
  selectedImage: File | null = null;
    base64Image: string = '';
    newBoutique: Boutique = {
      nom:'',
      adresse: '',
      email: '',
      telephone: '',
      image:'',
      produits: [],
    };
    constructor(private fb:FormBuilder,private boutiqueservice:BoutiqueService,private router:Router ){}
    ngOnInit(): void {
      this.initializeForm();
    }
    initializeForm(): void {
      this.BoutiqueForm = this.fb.group({
        nom: ['', Validators.required],
        addresse: ['', Validators.required],
        email: ['', Validators.required, Validators.pattern('^[a-zA-Z0-9._%+-]+@...\\.com$')],
        Telephone: ['', Validators.required, Validators.pattern('^[0-9]{8}$')],
      });
  }
  onSubmit(): void {
    if (this.BoutiqueForm.valid) {
      this.newBoutique.nom=this.BoutiqueForm.value.nom;
      this.newBoutique.email=this.BoutiqueForm.value.email;
      this.newBoutique.telephone=this.BoutiqueForm.value.Telephone;
      this.newBoutique.adresse=this.BoutiqueForm.value.addresse;
      this.newBoutique.image=this.base64Image;
      console.log('Form submitted:', this.BoutiqueForm.value);
      console.log('Event object:', this.newBoutique);
  
      // Call the service to save the event
      this.boutiqueservice.createBoutique(this.newBoutique).subscribe(response => {
        console.log('Event added:', response);
        this.router.navigate(['/admin/boutiques/list_boutiques']);
      });
    } else {
      // Mark all fields as touched to trigger validation
      this.BoutiqueForm.markAllAsTouched();
    }
  }
  handleUpload(event: any) {
    const file = event.target.files[0];
    this.selectedImage = file;
  
    if (file) {
      const reader = new FileReader();
  
      reader.onload = () => {
        this.base64Image = reader.result as string; // Store the base64 string
        console.log("Base64 Image:", this.base64Image);
      };
  
      reader.readAsDataURL(file); // Convert file to base64
    }
  }

}
