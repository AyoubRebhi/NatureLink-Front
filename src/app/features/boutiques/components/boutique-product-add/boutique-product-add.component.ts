import { Component } from '@angular/core';
import { FormBuilder,FormGroup, Validators } from '@angular/forms';
import { Boutique } from 'src/app/core/models/boutique.module';
import { Produit } from 'src/app/core/models/produit.module';
import { BoutiqueService } from 'src/app/core/services/boutique.service';
import { ActivatedRoute } from '@angular/router';
@Component({
  selector: 'app-boutique-product-add',
  templateUrl: './boutique-product-add.component.html',
  styleUrls: ['./boutique-product-add.component.scss']
})
export class BoutiqueProductAddComponent {
  BoutiqueForm !:FormGroup;
  selectedImage: File | null = null;
    base64Image: string = '';
    newBoutique: Produit = {
      nom:'',
      cost: 0,
      offre: 0,
      image:''
    };
    boutiqueId!: number;

    constructor(private route:ActivatedRoute,private fb:FormBuilder,private boutiqueservice:BoutiqueService ){}
    ngOnInit(): void {
      this.initializeForm();
      this.route.params.subscribe(params => {
        this.boutiqueId = +params['id'];});
    }
    initializeForm(): void {
      this.BoutiqueForm = this.fb.group({
        nom: ['', Validators.required],
        cost: ['', Validators.required],
        offre: ['', Validators.required],
      });
  }
  onSubmit(): void {
    if (this.BoutiqueForm.valid) {
      this.newBoutique.nom=this.BoutiqueForm.value.nom;
      this.newBoutique.cost=this.BoutiqueForm.value.email;
      this.newBoutique.offre=this.BoutiqueForm.value.Telephone;
      this.newBoutique.image=this.base64Image;
      console.log('Form submitted:', this.BoutiqueForm.value);
      console.log('Event object:', this.newBoutique);
  
      // Call the service to save the event
      this.boutiqueservice.createProduitById(this.boutiqueId,this.newBoutique,).subscribe(response => {
        console.log('Event added:', response);
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
