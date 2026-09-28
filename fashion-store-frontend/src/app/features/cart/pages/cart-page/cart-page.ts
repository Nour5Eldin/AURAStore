import { Component, OnInit, OnDestroy } from "@angular/core";
import { Router } from "@angular/router";
import { Store } from "@ngrx/store";
import { Observable, Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";
import { AppState } from "../../../../store/app.state";
import {
  selectActiveItems, selectPriceChangedItems, selectCartSubtotal,
  selectCartLoading,
} from "../../../../store/cart/cart.selectors";
import { selectIsLoggedIn } from "../../../../store/auth/auth.selectors";
import {
  loadCart, removeCartItem, updateCartItem, reAddItem,
  syncGuestCart,
} from "../../../../store/cart/cart.actions";
import { CartItem } from "../../../../core/models/api-response.model";
import { LocalCartService } from "../../services/local-cart.service";
import { GuestCartItem } from "../../../../core/services/guest-cart.service";

@Component({
  selector: "app-cart-page",
  standalone: false,
  templateUrl: "./cart-page.html",
  styleUrls: ["./cart-page.scss"],
})
export class CartPage implements OnInit, OnDestroy {

  activeItems$: Observable<CartItem[]>;
  priceChangedItems$: Observable<CartItem[]>;
  subtotal$: Observable<number>;
  loading$: Observable<boolean>;
  isLoggedIn$: Observable<boolean>;

  guestItems: GuestCartItem[] = [];

  private destroy$ = new Subject<void>();

  constructor(
    private store: Store<AppState>,
    private router: Router,
    private localCart: LocalCartService,
  ) {
    this.activeItems$ = this.store.select(selectActiveItems);
    this.priceChangedItems$ = this.store.select(selectPriceChangedItems);
    this.subtotal$ = this.store.select(selectCartSubtotal);
    this.loading$ = this.store.select(selectCartLoading);
    this.isLoggedIn$ = this.store.select(selectIsLoggedIn);
  }

  ngOnInit(): void {
    this.isLoggedIn$
      .pipe(takeUntil(this.destroy$))
      .subscribe(loggedIn => {
        if (loggedIn) {
          const guestItems = this.localCart.getSyncPayload();
          if (guestItems.length > 0) {
            this.store.dispatch(syncGuestCart({ items: guestItems }));
            this.localCart.clear();
          }
          this.store.dispatch(loadCart());
        } else {
          this.guestItems = this.localCart.getItems();
        }
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  onUpdateQuantity(itemId: string, quantity: number): void {
    this.store.dispatch(updateCartItem({ itemId, quantity }));
  }

  onRemoveItem(itemId: string): void {
    this.store.dispatch(removeCartItem({ itemId }));
  }

  onReAdd(itemId: string): void {
    this.store.dispatch(reAddItem({ itemId }));
  }

  onGuestUpdate(productId: string, quantity: number): void {
    this.localCart.updateQuantity(productId, quantity);
    this.guestItems = this.localCart.getItems();
  }

  onGuestRemove(productId: string): void {
    this.localCart.removeItem(productId);
    this.guestItems = this.localCart.getItems();
  }

  get guestSubtotal(): number {
    return this.localCart.getSubtotal();
  }

  onCheckout(): void {
    this.router.navigate(["/checkout"]);
  }
}