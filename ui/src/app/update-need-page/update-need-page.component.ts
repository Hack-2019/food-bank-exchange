import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { UpdateNeed } from '../../../../core/models/marketplace/update.need'
import { Food } from '../../../../core/models/food';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-update-need-page',
  templateUrl: './update-need-page.component.html',
  styleUrls: ['./update-need-page.component.css']
})
export class UpdateNeedPageComponent implements OnInit {

  invalidSubmissionAttempted: boolean;
  foodNames: any;

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
      });
  }
  ngOnInit() {
    this.getFoods();
  }
  onSubmit(names: any[], newQuantity: string) {
    let numQuanitity = parseInt(newQuantity);
    let request: UpdateNeed = { foodName: names[0].value, newQuantity: numQuanitity };
    this.http.post("http://" + environment.server + "/marketplace/update/need", request, this.httpOptions).subscribe(r => {
      this.success = true
    });
  }
}

