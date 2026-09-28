import { Component, Input, Output, EventEmitter } from "@angular/core";

@Component({
  selector: "app-cart-summary",
  standalone: false,
  templateUrl: "./cart-summary.html",
  styleUrls: ["./cart-summary.scss"],
})
export class CartSummary {
  @Input() subtotal = 0;
  @Input() itemCount = 0;
  @Input() hasPriceChangedItems = false;
  @Output() checkout = new EventEmitter<void>();
}
