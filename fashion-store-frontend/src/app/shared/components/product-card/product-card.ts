import { Component, Input, Output, EventEmitter } from "@angular/core";
import { Product } from "../../../core/models/api-response.model";
import { Store } from "@ngrx/store";
import { AppState } from "../../../store/app.state";
import { selectIsLoggedIn } from "../../../store/auth/auth.selectors";
import { addToCart } from "../../../store/cart/cart.actions";
import { Observable } from "rxjs";

@Component({
  selector: "app-product-card",
  standalone: false,
  templateUrl: "./product-card.html",
  styleUrls: ["./product-card.scss"],
})
export class ProductCard {

  @Input() product!: Product;
  @Input() showBadge = false;
  @Output() quickAdd = new EventEmitter<Product>();

  isHovered = false;
  isAdding = false;
  isLoggedIn$: Observable<boolean>;


  constructor(private store: Store<AppState>) {
    this.isLoggedIn$ = this.store.select(selectIsLoggedIn);
  }

  onAddToCart(event: Event): void {
    event.preventDefault();
    event.stopPropagation();

    this.isAdding = true;
    this.store.dispatch(addToCart({
      productId: this.product._id,
      quantity: 1,
    }));

    setTimeout(() => this.isAdding = false, 1500);
    this.quickAdd.emit(this.product);
  }

  get isOutOfStock(): boolean {
    return this.product.stock === 0;
  }

  get isLowStock(): boolean {
    return this.product.stock > 0 && this.product.stock <= 3;
  }
}