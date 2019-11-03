import {Component, OnInit, ViewChild} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {environment} from '../../../environments/environment';
import {Food} from '../../../../../core/models/food';
import {TagModel} from "ngx-chips/core/accessor";
import {Donation} from '../../../../../core/models/donation';
import {UpcSearch} from '../../..'
import {BarecodeScannerLivestreamComponent} from "ngx-barcode-scanner";

@Component({
  selector: 'app-add-donation-page',
  templateUrl: './add-donation-page.component.html',
  styleUrls: ['./add-donation-page.component.css']
})
export class AddDonationPageComponent implements OnInit {

  barcodeEnabled: boolean = false;

  @ViewChild(BarecodeScannerLivestreamComponent, {static: false})
  barecodeScanner: BarecodeScannerLivestreamComponent;

  barcodeGuesses = [];

  barcodeValue = "";

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
    if (this.barcodeGuesses.length > 10) {
      this.barcodeGuesses.push(result);
      this.barcodeGuesses.shift();
    } else {
      this.barcodeGuesses.push(result);
    }

    let guesses = new Map<string, number>();
    this.barcodeGuesses.forEach(guess => {
      if (guesses.has(guess.codeResult.code)) {
        guesses.set(guess.codeResult.code, guesses.get(guess.codeResult.code) + 1);
      } else {
        guesses.set(guess.codeResult.code, 1);
      }
    });

    console.log(guesses);

    let mostCommonGuess;
    let mostCommonGuessCount;
    guesses.forEach((count, guess) => {
      if (mostCommonGuess == undefined || mostCommonGuessCount < count) {
        mostCommonGuess = guess;
        mostCommonGuessCount = count;
      }
    });

    this.barcodeValue = mostCommonGuess;
  }
}
