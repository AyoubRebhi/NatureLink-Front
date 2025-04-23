import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filter'
})
export class FilterPipe implements PipeTransform {

  transform(events: any[], searchQuery: string): any[] {
    if (!searchQuery) {
      return events; // If searchQuery is empty, return all events
    }
    // Filter events by title
    return events.filter(event =>
      event.title.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }

}
