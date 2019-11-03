import {Component, OnInit, ViewChild, AfterViewInit} from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FoodTag } from "../../../../../core/models/food.tag";
import { Food } from "../../../../../core/models/food";
import {BarecodeScannerLivestreamComponent} from "ngx-barcode-scanner";
import {environment} from "../../../environments/environment";

@Component({
  selector: 'app-donation-type',
  templateUrl: './add-product-page.component.html',
  styleUrls: ['./add-product-page.component.css']
})
export class AddProductComponent implements OnInit {
  @ViewChild("barcodeSlide", {static: true}) ref: any;

  barcodeEnabled: boolean = false;

  @ViewChild(BarecodeScannerLivestreamComponent, {static: false})
  barecodeScanner: BarecodeScannerLivestreamComponent;

  barcodeGuesses = [];

  barcodeValue = "";

  foodTags: string[];
  foodname: string;
  booleanSet: boolean = false;
  onSubmit(somethingElse,somethingElse2)
  {
    this.booleanSet = false;
    this.httpClient.post('http://localhost:8080/food/add',
    <Food>{
      name : somethingElse,
      tags : somethingElse2.map(el=> el.value),
      upc:  this.barcodeValue
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

  barcodeChange(): void {
    this.barcodeEnabled = !this.barcodeEnabled;
    if (this.barcodeEnabled) {
      this.barecodeScanner.start();
    } else {
      this.barecodeScanner.stop();
    }
  }

  onValueChanges(result){
    this.barcodeGuesses.push(result.codeResult.code);

    let barcodeOccurrences = new Map<string, number>();
    let confidentValue: string;
    this.barcodeGuesses.forEach((value) => {
      if (barcodeOccurrences.has(value)) {
        const cur = barcodeOccurrences.get(value) + 1;
        if (cur > 4) {
          confidentValue = value;
          this.barcodeGuesses = [];
          this.ref.checked = false;
          this.barcodeChange();
        }
        barcodeOccurrences.set(value, cur);
      } else {
        barcodeOccurrences.set(value, 1);
      }
    });

    if (confidentValue) {
      this.barcodeValue = confidentValue;
    }
  }
}
