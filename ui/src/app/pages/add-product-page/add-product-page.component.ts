import { Component, OnInit, NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { FoodTag } from "../../../../../core/models/food.tag";

@Component({
  selector: 'app-donation-type',
  templateUrl: './add-product-page.component.html',
  styleUrls: ['./add-product-page.component.css']
})
export class AddProductComponent implements OnInit {
  foodTags: string[];
  foodname: string;
  booleanSet: boolean = false;
  onSubmit(somethingElse,somethingElse2)
  {
    this.booleanSet = false;
    this.httpClient.post('http://localhost:8080/food/add',
    {
      name : somethingElse,
      tags : somethingElse2.map(el=> el.value)
    }).subscribe(results => {
      this.booleanSet = true;
    });
  }
  constructor(private httpClient: HttpClient) { }

  ngOnInit() {
    this.httpClient.get<FoodTag[]>('http://localhost:8080/tags/list')
    .subscribe(results => {
      this.foodTags = results.map(result => result.name);
    });
  }

}
