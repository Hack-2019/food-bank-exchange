import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

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
  constructor(private httpClient: HttpClient) { }

  ngOnInit() {
  }

}
