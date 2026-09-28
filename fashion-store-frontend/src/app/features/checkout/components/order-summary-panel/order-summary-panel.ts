import { Component, Input } from "@angular/core";
import { CartItem } from "../../../../core/models/api-response.model";

@Component({
  selector: "app-order-summary-panel",
  standalone: false,
  templateUrl: "./order-summary-panel.html",
  styleUrls: ["./order-summary-panel.scss"],
})
export class OrderSummaryPanel {
  @Input() items: CartItem[] = [];
  @Input() subtotal = 0;

  getProduct(item: CartItem): any { return item.productId; }
}
