import {Component, OnInit, ViewChild} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Purchase, PurchaseItem} from '../../../../../core/models/purchase';
import {Food} from '../../../../../core/models/food';
import {environment} from 'src/environments/environment';
import {BarecodeScannerLivestreamComponent} from "ngx-barcode-scanner";
import {UpcSearch, UpcSearchResult} from '../../../../../core/models/upc.search'

@Component({
  selector: 'app-checkout-page',
  templateUrl: './checkout-page.component.html',
  styleUrls: ['./checkout-page.component.css']
})

export class CheckoutPageComponent implements OnInit {
  @ViewChild("barcodeSlide", {static: true}) ref: any;

  barcodeEnabled: boolean = false;

  @ViewChild(BarecodeScannerLivestreamComponent, {static: false})
  barecodeScanner: BarecodeScannerLivestreamComponent;

  barcodeGuesses = [];

  barcodeValue = "";

  foodName = [];

  placeholder: string = "Enter the name of an item";

  purchaseNames: PurchaseItem[];
  foodNames: any;
  invalidSubmissionAttempted: boolean;

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

  onSubmit(names: any[], quantity: string) {
    this.success = false;

    let quantityNum = parseInt(quantity);
    let request: Purchase = {
      id: undefined, items: [
        {foodName: names[0].value, quantity: quantityNum}
      ]
    };
    this.http.post("http://" + environment.server + "/stock/purchase", request, this.httpOptions).subscribe(r => {
      this.success = true;
      this.foodName = [];
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
      // Ready to perform the search
      let search: UpcSearch = {
        upc: confidentValue
      }
      this.http.post("http://" + environment.server + "/food/search/upc", search, this.httpOptions).subscribe((result: UpcSearchResult) => {
        if (result.productName != undefined) {
          this.foodName = [{display: result.productName, value: result.productName}];
        }
      });
    } else {
      this.barcodeGuesses.push(result);
    }
  }
}
