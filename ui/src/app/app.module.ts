import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AddDonationPageComponent } from './pages/add-donation-page/add-donation-page.component';
import { CheckoutPageComponent } from './pages/checkout-page/checkout-page.component';
import { SummaryPageComponent } from './pages/summary-page/summary-page.component';
import { DonationTypeComponent } from './pages/donation-type-page/donation-type-page.component';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    AppComponent,
    AddDonationPageComponent,
    CheckoutPageComponent,
    SummaryPageComponent,
    DonationTypeComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }