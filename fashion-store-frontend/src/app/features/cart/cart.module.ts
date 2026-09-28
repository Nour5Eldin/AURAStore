import { NgModule }          from "@angular/core";
import { SharedModule }      from "../../shared/shared.module";
import { CartRoutingModule } from "./cart-routing.module";
import { CartPage }           from "./pages/cart-page/cart-page";
import { CartItemComponent }  from "./components/cart-item/cart-item";
import { CartSummary } from "./components/cart-summary/cart-summary";
import { PriceChangedNotice } from "./components/price-changed-notice/price-changed-notice";

@NgModule({
  declarations: [CartPage, CartItemComponent,CartSummary, PriceChangedNotice,],
  imports: [SharedModule, CartRoutingModule],
})
export class CartModule {}