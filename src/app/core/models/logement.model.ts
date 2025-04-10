export interface Equipement {
    id: number;
    nom: string;
  }
  
  export interface Disponibility {
    id: number;
    startDate: string;
    endDate: string;
  }
  
  export interface Logement {
    id: number;
    titre: string;
    description: string;
    location: string;
    equipements: Equipement[];
    price: number;
    image: string;
    proprietarield: number;
    phone: string;
    email: string;
    socialMedia: string;
    disponibilities: Disponibility[];
  }
  