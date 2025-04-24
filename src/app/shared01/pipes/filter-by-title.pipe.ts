import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filterByTitle'
})
export class FilterByTitlePipe implements PipeTransform {

  transform(events: any[], searchQuery: string): any[] {
    if (!events) return [];
    if (!searchQuery) return events;

    searchQuery = searchQuery.toLowerCase();
    return events.filter(event => 
      event.title.toLowerCase().includes(searchQuery)
    );
  }

}
