import { Injectable } from "@angular/core";

export interface GuestCartItem {
    productId: string;
    quantity: number;
    price: number;
    totalPrice: number;
    isPriceChanged: boolean;
    name: string;
    image: string;
}

@Injectable({ providedIn: "root" })
export class GuestCartService {

    private readonly KEY = "fs_guest_cart";

    getItems(): GuestCartItem[] {
        const data = localStorage.getItem(this.KEY);
        return data ? JSON.parse(data) : [];
    }

    getCount(): number {
        return this.getItems().length;
    }

    getSubtotal(): number {
        return this.getItems()
            .filter(i => !i.isPriceChanged)
            .reduce((sum, i) => sum + i.totalPrice, 0);
    }

    addItem(item: Omit<GuestCartItem, "totalPrice" | "isPriceChanged">): void {
        const items = this.getItems();
        const existing = items.findIndex(i => i.productId === item.productId);

        if (existing >= 0) {
            items[existing].quantity += item.quantity;
            items[existing].totalPrice = items[existing].price * items[existing].quantity;
        } else {
            items.push({
                ...item,
                totalPrice: item.price * item.quantity,
                isPriceChanged: false,
            });
        }

        this.save(items);
    }

    updateQuantity(productId: string, quantity: number): void {
        const items = this.getItems().map(item => {
            if (item.productId === productId) {
                return {
                    ...item,
                    quantity,
                    totalPrice: item.price * quantity,
                };
            }
            return item;
        });
        this.save(items);
    }

    removeItem(productId: string): void {
        const items = this.getItems().filter(i => i.productId !== productId);
        this.save(items);
    }

    clear(): void {
        localStorage.removeItem(this.KEY);
    }

    getSyncPayload(): { productId: string; quantity: number; price: number }[] {
        return this.getItems().map(({ productId, quantity, price }) => ({
            productId,
            quantity,
            price,
        }));
    }

    private save(items: GuestCartItem[]): void {
        localStorage.setItem(this.KEY, JSON.stringify(items));
    }
}