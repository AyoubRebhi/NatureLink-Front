import { Component } from '@angular/core';

@Component({
  selector: 'app-guides',
  templateUrl: './guides.component.html',
  styleUrls: ['./guides.component.scss']
})
export class GuidesComponent {
  teamMembers = [
    {
      name: "John Doe",
      designation: "Senior Tour Guide",
      image: "assets/img/team-1.jpg",
      social: {
        facebook: "#",
        twitter: "#",
        instagram: "#"
      }
    },
    {
      name: "Jane Smith",
      designation: "Adventure Specialist",
      image: "assets/img/team-2.jpg",
      social: {
        facebook: "#",
        twitter: "#",
        instagram: "#"
      }
    },
    {
      name: "Robert Brown",
      designation: "Cultural Expert",
      image: "assets/img/team-3.jpg",
      social: {
        facebook: "#",
        twitter: "#",
        instagram: "#"
      }
    },
    {
      name: "Emily Johnson",
      designation: "Wildlife Guide",
      image: "assets/img/team-4.jpg",
      social: {
        facebook: "#",
        twitter: "#",
        instagram: "#"
      }
    }
  ];
}
