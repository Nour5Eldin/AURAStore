import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CheckoutRoutingModule } from './checkout-routing.module';
import { CheckoutPage } from './pages/checkout-page/checkout-page';
import { OrderConfirmationPage } from './pages/order-confirmation-page/order-confirmation-page';
import { AddressSelector } from './components/address-selector/address-selector';
import { OrderSummaryPanel } from './components/order-summary-panel/order-summary-panel';
import { SharedModule } from "../../shared/shared.module";
import { ReactiveFormsModule } from "@angular/forms";

@NgModule({
  declarations: [CheckoutPage, OrderConfirmationPage, AddressSelector, OrderSummaryPanel],
  imports: [CommonModule, CheckoutRoutingModule, SharedModule, ReactiveFormsModule],
})
export class CheckoutModule {}
