import { Component, OnInit } from '@angular/core';
import { BoutiqueService } from 'src/app/services/boutique.service';
import { Produit } from 'src/app/core/models/produit.module';
import { ActivatedRoute } from '@angular/router';
// If you want to show a message after deletion
@Component({
  selector: 'app-boutique-info',
  templateUrl: './boutique-info.component.html',
  styleUrls: ['./boutique-info.component.scss']
})
export class BoutiqueInfoComponent implements OnInit {
  
  
  
  
  currentIndex: number = 0;
  visibleItems: number = 2;
  boutiqueId!: number;
  products: Produit[] = [];
  boutiqueDetails: any;
  isLoading = true;
  isAdminView = false;


constructor(private boutiqueservice:BoutiqueService,private route:ActivatedRoute){}

ngOnInit(): void {
  this.route.params.subscribe(params => {
    this.boutiqueId = +params['id'];
    this.loadBoutiqueDetails();
    this.loadProduits();
    
  });
  this.route.data.subscribe((data) => {
    this.isAdminView = data['adminView'] || false;
  });
}

loadBoutiqueDetails(): void {
  this.boutiqueservice.getBoutiqueById(this.boutiqueId).subscribe({
    next: (boutique) => {
      this.boutiqueDetails = boutique;
      console.log(this.boutiqueDetails);
    },
    error: (err) => {
      console.error('Error loading boutique details:', err);
    }
  });
}
loadProduits(): void {
  this.boutiqueservice.getProduitsByBoutiqueId(this.boutiqueId).subscribe({
    next: (produits) => {
      this.products = produits;
      this.isLoading = false;
    },
    error: (err) => {
      console.error('Error loading products:', err);
      this.isLoading = false;
    }
  });
}

  

deleteProduit(productId: number): void {
  if (confirm('Are you sure you want to delete this product?')) {
    this.boutiqueservice.deleteProduitByBoutiqueId(this.boutiqueId,productId).subscribe(() => {
      this.products = this.products.filter(event => event.id !== productId);  // Remove deleted event from the list
      alert('Product deleted successfully!');
    }, error => {
      console.error('Delete failed:', error);
      alert('Failed to delete the product.');
    });
  }
}

  
  
}
