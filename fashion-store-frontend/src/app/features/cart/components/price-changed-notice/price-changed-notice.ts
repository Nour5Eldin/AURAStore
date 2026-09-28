import { Component, Input, Output, EventEmitter } from "@angular/core";
import { CartItem } from "../../../../core/models/api-response.model";

@Component({
  selector: "app-price-changed-notice",
  standalone: false,
  templateUrl: "./price-changed-notice.html",
  styleUrls: ["./price-changed-notice.scss"],
})
export class PriceChangedNotice {
  @Input() items: CartItem[] = [];
  @Output() reAdd = new EventEmitter<string>();
  @Output() remove = new EventEmitter<string>();

  getProduct(item: CartItem): any { return item.productId; }
}
