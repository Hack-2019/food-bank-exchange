import { Component, OnInit, NgModule } from '@angular/core';
import { FormsModule }   from '@angular/forms';

@Component({
  selector: 'app-donation-type',
  templateUrl: './donation-type-page.component.html',
  styleUrls: ['./donation-type-page.component.css']
})
export class DonationTypeComponent implements OnInit {

  public items = [
  ];
  constructor() { }

  ngOnInit() {
  }

}
