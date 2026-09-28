import { Injectable } from "@angular/core";
import { GuestCartService, GuestCartItem } from "../../../core/services/guest-cart.service";

@Injectable({ providedIn: "root" })
export class LocalCartService {

  constructor(private guestCart: GuestCartService) { }

  getItems(): GuestCartItem[] {
    return this.guestCart.getItems();
  }

  getCount(): number {
    return this.guestCart.getCount();
  }

  getSubtotal(): number {
    return this.guestCart.getSubtotal();
  }

  addItem(item: Omit<GuestCartItem, "totalPrice" | "isPriceChanged">): void {
    this.guestCart.addItem(item);
  }

  updateQuantity(productId: string, quantity: number): void {
    this.guestCart.updateQuantity(productId, quantity);
  }

  removeItem(productId: string): void {
    this.guestCart.removeItem(productId);
  }

  clear(): void {
    this.guestCart.clear();
  }

  getSyncPayload(): { productId: string; quantity: number; price: number }[] {
    return this.guestCart.getSyncPayload();
  }
}