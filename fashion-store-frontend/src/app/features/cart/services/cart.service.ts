import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { Store } from "@ngrx/store";
import { API } from "../../../core/config/api.config";
import { ApiResponse, CartResponse, CartItem } from "../../../core/models/api-response.model";
import { AppState } from "../../../store/app.state";
import * as CartActions from "../../../store/cart/cart.actions";

@Injectable({ providedIn: "root" })
export class CartService {

  constructor(
    private http: HttpClient,
    private store: Store<AppState>,
  ) { }

  loadCart(): void {
    this.store.dispatch(CartActions.loadCart());
  }

  addToCart(productId: string, quantity: number): void {
    this.store.dispatch(CartActions.addToCart({ productId, quantity }));
  }

  updateQuantity(itemId: string, quantity: number): void {
    this.store.dispatch(CartActions.updateCartItem({ itemId, quantity }));
  }

  removeItem(itemId: string): void {
    this.store.dispatch(CartActions.removeCartItem({ itemId }));
  }

  reAddItem(itemId: string): void {
    this.store.dispatch(CartActions.reAddItem({ itemId }));
  }

  clearCart(): void {
    this.store.dispatch(CartActions.clearCart());
  }

  getCartHttp(): Observable<ApiResponse<CartResponse>> {
    return this.http.get<ApiResponse<CartResponse>>(API.CART.BASE);
  }

  getCartCount(): Observable<ApiResponse<{ count: number }>> {
    return this.http.get<ApiResponse<{ count: number }>>(API.CART.COUNT);
  }
}