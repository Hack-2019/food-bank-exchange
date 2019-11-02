import { Component, OnInit, NgModule } from '@angular/core';
import { FormsModule }   from '@angular/forms';

@Component({
  selector: 'app-donation-type',
  templateUrl: './add-product-page.component.html',
  styleUrls: ['./add-product-page.component.css']
})
export class AddProductComponent implements OnInit {

  public items = [
  ];
  constructor() { }

  ngOnInit() {
  }

}
