import { Component } from '@angular/core';
import { FormBuilder,FormGroup, Validators } from '@angular/forms';
import { Boutique } from 'src/app/core/models/boutique.module';
import { Produit } from 'src/app/core/models/produit.module';
import { BoutiqueService } from 'src/app/services/boutique.service';
import { ActivatedRoute, Router } from '@angular/router';
@Component({
  selector: 'app-boutique-update',
  templateUrl: './boutique-update.component.html',
  styleUrls: ['./boutique-update.component.scss']
})
export class BoutiqueUpdateComponent {
BoutiqueForm !:FormGroup;
  selectedImage: File | null = null;
    base64Image: string = '';
    newBoutique:Boutique = {
      nom:'',
      adresse: '',
      email: '',
      telephone: '',
      image:'',
    };
    boutiqueId!: number;

    constructor(private router:Router,private route:ActivatedRoute,private fb:FormBuilder,private boutiqueservice:BoutiqueService ){}
    ngOnInit(): void {
      this.initializeForm();
      this.route.params.subscribe(params => {
        this.boutiqueId = +params['id'];});
        this.boutiqueservice.getBoutiqueById(this.boutiqueId).subscribe((boutiqueData:any)=>{
          this.BoutiqueForm.patchValue({
            nom:boutiqueData.nom,
            addresse:boutiqueData.adresse,
            email:boutiqueData.email,
            telephone:boutiqueData.telephone
          })
        })

    }
    initializeForm(): void {
      this.BoutiqueForm = this.fb.group({
        nom: ['', Validators.required],
        addresse: ['', Validators.required],
        email: ['', Validators.required],
        telephone:['',Validators.required]
      });
  }
  onSubmit(): void {
    if (this.BoutiqueForm.invalid) return;

    const formValues = this.BoutiqueForm.value;

    const updatedBoutique:any={
      id:this.boutiqueId,
      nom:formValues.nom,
      adresse:formValues.addresse,
      email:formValues.email,
      telephone:formValues.telephone
    };
    updatedBoutique.image=this.base64Image;
    this.boutiqueservice.updateBoutique(this.boutiqueId,updatedBoutique).subscribe(()=>{
      this.router.navigate(['/boutiques/list-boutiques'])
    })
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
