import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Purchase, PurchaseItem } from '../../../../../core/models/purchase';
import { Food } from '../../../../../core/models/food';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-checkout-page',
  templateUrl: './checkout-page.component.html',
  styleUrls: ['./checkout-page.component.css']
})

export class CheckoutPageComponent implements OnInit {

  purchaseNames: PurchaseItem[];
  foodNames: any;
  invalidSubmissionAttempted : boolean;
  
  httpOptions = {
    withCredentials: true
  };
  success: boolean;

  constructor(private http: HttpClient) {
    this.success = false;
  }

  getFoods(): void {
    this.http.get<Food[]>("http://" + environment.server + "/food/list")
      .subscribe((foods) => {
        this.foodNames = foods.map(food => food.name);
        console.log(this.foodNames);
      });
  }
  ngOnInit() {
    this.getFoods();
  }

  onSubmit(names: any[], quantity: string) {
    let quantityNum = parseInt(quantity);
    let request: Purchase = {id: undefined,items: [
          {foodName: names[0].value, quantity: quantityNum}
        ]};
    this.http.post("http://" + environment.server + "/stock/purchase", request, this.httpOptions).subscribe(r => {
    this.success = true
  });
}
    
}
