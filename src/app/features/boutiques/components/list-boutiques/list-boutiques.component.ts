import { Component,OnInit } from '@angular/core';
import { BoutiqueService } from 'src/app/services/boutique.service';
@Component({
  selector: 'app-list-boutiques',
  templateUrl: './list-boutiques.component.html',
  styleUrls: ['./list-boutiques.component.scss']
})
export class ListBoutiquesComponent implements OnInit {

  boutiques:any[]=[];
  constructor(private boutiqueService:BoutiqueService){};
  ngOnInit() {
    this.getAllBoutiques();
  }
getAllBoutiques(){
  this.boutiqueService.getAllBoutiques().subscribe(
    (res)=>{console.log(res);
      this.boutiques=res;
    }
  )
}
}
