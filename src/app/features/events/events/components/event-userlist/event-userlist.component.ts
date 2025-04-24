import { Component } from '@angular/core';

@Component({
  selector: 'app-event-userlist',
  templateUrl: './event-userlist.component.html',
  styleUrls: ['./event-userlist.component.scss']
})
export class EventUserlistComponent {
  stats = [
    { label: 'Attending', value: 589, color: 'text-green-600' },
    { label: 'Maybe Attending', value: 267, color: 'text-yellow-500' },
    { label: 'Not Attending', value: 37, color: 'text-red-600' },
    { label: 'Gross Sales', value: '$16,786', color: 'text-purple-600' }
  ];

  attendees = [
    { firstName: 'Marcus', lastName: 'Stanton', status: '✔ Attending' },
    { firstName: 'Abram', lastName: 'Culhane', status: '✔ Attending' },
    { firstName: 'Giana', lastName: 'Culhane', status: '✔ Attending' }
  ];

  sources = [
    { platform: 'Facebook', value: 152, color: 'text-blue-600' },
    { platform: 'Instagram', value: 229, color: 'text-purple-600' },
    { platform: 'Email Newsletter', value: 107, color: 'text-yellow-600' },
    { platform: 'Other', value: 103, color: 'text-gray-600' }
  ];
}
