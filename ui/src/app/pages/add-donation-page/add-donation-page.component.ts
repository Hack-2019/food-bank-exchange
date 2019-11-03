import { Component, OnInit } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../../environments/environment';
import {Food} from '../../../../../core/models/food';
import {TagModel} from "ngx-chips/core/accessor";
import {Donation} from '../../../../../core/models/donation';

@Component({
  selector: 'app-add-donation-page',
  templateUrl: './add-donation-page.component.html',
  styleUrls: ['./add-donation-page.component.css']
})
export class AddDonationPageComponent implements OnInit {

  foodNames: string[];

  placeholder = "Enter the name of an item"
  invalidSubmissionAttempted: boolean;

  constructor(private http: HttpClient) {
    this.invalidSubmissionAttempted = false;
  }

  ngOnInit(): void {
    this.getFoods();
  }

  getFoods(): void {
    this.http.get<Food[]>("http://" + environment.server + "/food/list")
      .subscribe((foods) => {
        this.foodNames = foods.map(food => food.name);
        console.log(this.foodNames);
      });
  }

  onSubmit(names: any[], quantity: string) {
      let quantityNum = parseInt(quantity);
      let request: Donation = {items: [
          {foodName: names[0].value, quantity: quantityNum}
        ]};
      this.http.post("http://" + environment.server + "/stock/donate", request).subscribe(response => {

      });
  }

}
