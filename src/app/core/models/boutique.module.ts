import { Produit } from "./produit.module";
export interface Boutique{
    id?: number;
    nom: string;
    addresse: string;
    email:string;
    Telephone:string;
    image: string;
    produits?: Produit[]; // optional to avoid lazy loading issues unless you're loading them
  }