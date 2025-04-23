import { Component,OnInit } from '@angular/core';
import { BoutiqueService } from 'src/app/services/boutique.service';
import { ActivatedRoute } from '@angular/router';
@Component({
  selector: 'app-list-boutiques',
  templateUrl: './list-boutiques.component.html',
  styleUrls: ['./list-boutiques.component.scss']
})
export class ListBoutiquesComponent implements OnInit {

  boutiques:any[]=[];
  search: string = '';
  isAdminView = false;

  constructor(private route: ActivatedRoute,private boutiqueService:BoutiqueService){};
  ngOnInit() {
    this.getAllBoutiques();
    this.route.data.subscribe(data => {
      this.isAdminView = data['adminView'] || false; // Set admin view flag
    });
  }
getAllBoutiques(){
  this.boutiqueService.getAllBoutiques().subscribe(
    (res)=>{console.log(res);
      this.boutiques=res;
    }
  )
}
filteredBoutiques: any[] = [];

updateFilteredEvents() {
  if (!this.search) {
    this.filteredBoutiques = this.boutiques;
  } else {
    const query = this.search.toLowerCase();
    this.filteredBoutiques = this.boutiques.filter(boutique => 
      JSON.stringify(boutique).toLowerCase().includes(query)
    );
  }
}

deleteProduit(bouttique_id: number): void {
  if (confirm('Are you sure you want to delete this shop?')) {
    this.boutiqueService.deleteBoutique(bouttique_id).subscribe(() => {
      this.boutiques = this.boutiques.filter(event => event.id !== bouttique_id);  // Remove deleted event from the list
      alert('Event deleted successfully!');
    }, error => {
      console.error('Delete failed:', error);
      alert('Failed to delete the shop.');
    });
  }
}
}
