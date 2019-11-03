import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {environment} from '../../../environments/environment';
import {Food} from '../../../../../core/models/food';
import {TagModel} from "ngx-chips/core/accessor";
import {Donation} from '../../../../../core/models/donation';
import {UpcSearch, UpcSearchResult} from '../../../../../core/models/upc.search'
import {BarecodeScannerLivestreamComponent} from "ngx-barcode-scanner";

@Component({
  selector: 'app-add-donation-page',
  templateUrl: './add-donation-page.component.html',
  styleUrls: ['./add-donation-page.component.css']
})
export class AddDonationPageComponent implements OnInit {

  @ViewChild("barcodeSlide", {static: true}) ref: any;

  barcodeEnabled: boolean = false;

  @ViewChild(BarecodeScannerLivestreamComponent, {static: false})
  barecodeScanner: BarecodeScannerLivestreamComponent;

  barcodeGuesses = [];

  barcodeValue = "";

  foodName = [];

  foodNames: string[];
  success: boolean;
  placeholder = "Enter the name of an item"
  invalidSubmissionAttempted: boolean;

  httpOptions = {
    withCredentials: true
  };

  constructor(private http: HttpClient) {
    this.invalidSubmissionAttempted = false;
    this.success = false;
  }

  ngOnInit(): void {
    this.getFoods();
  }

  getFoods(): void {
    this.http.get<Food[]>("http://" + environment.server + "/food/list")
      .subscribe((foods) => {
        this.foodNames = foods.map(food => food.name);
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

  onSubmit(names: any[], quantity: string) {
      let quantityNum = parseInt(quantity);
      let request: Donation = {items: [
          {foodName: names[0].value, quantity: quantityNum}
        ]};
      this.http.post("http://" + environment.server + "/stock/donate", request, this.httpOptions).subscribe(r => {
      this.success = true
    });
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
      // Ready to perform the search
      let search: UpcSearch = {
        upc: confidentValue
      }
      this.http.post("http://" + environment.server + "/food/search/upc", search, this.httpOptions).subscribe((result: UpcSearchResult) => {
          if (result.productName != undefined) {
            this.foodName = [result.productName];
          }
      });
    } else {
      this.barcodeGuesses.push(result);
    }
  }
}
