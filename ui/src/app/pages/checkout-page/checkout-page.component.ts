import { Component, OnInit } from '@angular/core';


@Component({
  selector: 'app-checkout-page',
  templateUrl: './checkout-page.component.html',
  styleUrls: ['./checkout-page.component.css']
})

export class CheckoutPageComponent implements OnInit {

   contestForm ={
    value: {
        name: "Apple",
        category: "Fruit"
    }
};
  constructor() { }

  ngOnInit() {
  }

}
