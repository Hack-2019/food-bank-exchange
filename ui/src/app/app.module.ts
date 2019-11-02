import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AddDonationPageComponent } from './pages/add-donation-page/add-donation-page.component';
import { CheckoutPageComponent } from './pages/checkout-page/checkout-page.component';
import { SummaryPageComponent } from './pages/summary-page/summary-page.component';
import { DonationTypeComponent } from './pages/donation-type-page/donation-type-page.component';
import { FormsModule } from '@angular/forms';

import { TagInputModule } from 'ngx-chips';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'; // this is needed!
import { ReactiveFormsModule } from '@angular/forms';
import { LoginPageComponent } from './pages/login-page/login-page.component';
import { HttpClientModule } from '@angular/common/http';

@NgModule({
  declarations: [
    AppComponent,
    AddDonationPageComponent,
    CheckoutPageComponent,
    SummaryPageComponent,
    DonationTypeComponent,
    LoginPageComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,

    TagInputModule,
    BrowserAnimationsModule,
    ReactiveFormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
