import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent implements OnInit {
  currentYear: number = new Date().getFullYear(); // Direct initialization

  constructor() { }

  ngOnInit(): void {
    // Initialization moved to property declaration
  }

  scrollToFooter() {
    // Your scroll implementation
  }
}