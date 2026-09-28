import { CartItem } from "../../core/models/api-response.model";

export interface CartState {
    activeItems: CartItem[];
    priceChangedItems: CartItem[];
    subtotal: number;
    totalItems: number;
    loading: boolean;
    error: string | null;
}

export const initialCartState: CartState = {
    activeItems: [],
    priceChangedItems: [],
    subtotal: 0,
    totalItems: 0,
    loading: false,
    error: null,
};