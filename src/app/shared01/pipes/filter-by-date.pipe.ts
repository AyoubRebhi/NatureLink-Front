import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filterByDate'
})
export class FilterByDatePipe implements PipeTransform {

  transform(events: any[], selectedTab: { date: string }): any[] {
    if (!events || !selectedTab) return events;
    
    return events.filter(event => {
      const [startDate, endDate] = event.date.split(' to ');
      const selectedDate = selectedTab.date;
      
      // Check if selected date falls within event's date range
      return selectedDate >= startDate && selectedDate <= endDate;
    });
  }

}
