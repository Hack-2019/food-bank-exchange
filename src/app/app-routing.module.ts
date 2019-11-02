import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SummaryPageComponent } from './summary-page/summary-page.component';
import { AddDonationPageComponent } from './add-donation-page/add-donation-page.component';
import { CheckoutPageComponent } from './checkout-page/checkout-page.component';


const routes: Routes = [
  { path: '', component: SummaryPageComponent },
  { path: 'add-donation', component: AddDonationPageComponent },
  { path: 'checkout', component: CheckoutPageComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
