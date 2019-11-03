import {Component, OnInit, ViewChild, AfterViewInit} from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FoodTag } from "../../../../../core/models/food.tag";
import {BarecodeScannerLivestreamComponent} from "ngx-barcode-scanner";

@Component({
  selector: 'app-donation-type',
  templateUrl: './add-product-page.component.html',
  styleUrls: ['./add-product-page.component.css']
})
export class AddProductComponent implements OnInit {
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

  barcodeChange(): void {
    this.barcodeEnabled = !this.barcodeEnabled;
    if (this.barcodeEnabled) {
      this.barecodeScanner.start();
    } else {
      this.barecodeScanner.stop();
    }
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
