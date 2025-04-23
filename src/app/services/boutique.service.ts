import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Boutique} from '../core/models/boutique.module';
import { Produit } from '../core/models/produit.module';



@Injectable({
  providedIn: 'root'
})
export class BoutiqueService {
  private apiUrl = 'http://localhost:8081/api/boutiques';

  constructor(private http:HttpClient) { }
  getAllBoutiques(): Observable<any[]> {
    return this.http.get<Boutique[]>(this.apiUrl);
  }

  getBoutiqueById(id: number): Observable<Boutique> {
    return this.http.get<Boutique>(`${this.apiUrl}/${id}`);
  }

  getProduitsByBoutiqueId(id: number): Observable<Produit[]> {
    return this.http.get<Produit[]>(`${this.apiUrl}/${id}/produits`);
  }
  createProduitById(id: number, produit: Produit): Observable<Produit> {
    return this.http.post<Produit>(`${this.apiUrl}/${id}/produits`, produit);
  }
  // ➕ CREATE
  createBoutique(boutique: Boutique): Observable<Boutique> {
    return this.http.post<Boutique>(this.apiUrl, boutique);
  }

  // ✏️ UPDATE
  updateBoutique(id: number, boutique: Boutique): Observable<Boutique> {
    return this.http.put<Boutique>(`${this.apiUrl}/update/${id}`, boutique);
  }

  // 🗑 DELETE
  deleteBoutique(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/delete/${id}`);
  }

  deleteProduitByBoutiqueId(boutiqueId: number, productId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${boutiqueId}/produits/${productId}`);
  }

}
