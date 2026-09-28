import { Component, Input, Output, EventEmitter } from "@angular/core";
import { CartItem } from "../../../../core/models/api-response.model";

@Component({
  selector: "app-cart-item",
  standalone: false,
  templateUrl: "./cart-item.html",
  styleUrls: ["./cart-item.scss"],
})
export class CartItemComponent {
  @Input() item!: CartItem;
  @Output() quantityChange = new EventEmitter<number>();
  @Output() remove = new EventEmitter<void>();

  get product(): any { return this.item.productId; }

  decrease(): void {
    if (this.item.quantity > 1) {
      this.quantityChange.emit(this.item.quantity - 1);
    }
  }

  increase(): void {
    this.quantityChange.emit(this.item.quantity + 1);
  }
}