import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filterb'
})
export class FilterbPipe implements PipeTransform {

  transform(boutiques: any[], search: string): any[] {
    if(!boutiques) return [];
    if(!search) return boutiques;
    search=search.toLocaleLowerCase();
    return boutiques.filter(boutique => 
      boutique.nom.toLocaleLowerCase().includes(search)
    );
    
  }

}
