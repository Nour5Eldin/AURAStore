import { createReducer, on } from "@ngrx/store";
import { CartState, initialCartState } from "./cart.state";
import * as CartActions from "./cart.actions";

export const cartReducer = createReducer(
    initialCartState,

    on(CartActions.loadCart, state => ({ ...state, loading: true })),

    on(CartActions.loadCartSuccess, (state, { cart }) => ({
        ...state,
        activeItems: cart.activeItems,
        priceChangedItems: cart.priceChangedItems,
        subtotal: cart.subtotal,
        totalItems: cart.totalItems,
        loading: false,
        error: null,
    })),

    on(CartActions.loadCartFailure, (state, { error }) => ({
        ...state,
        loading: false,
        error,
    })),

    on(CartActions.addToCart, state => ({ ...state, loading: true })),

    on(CartActions.addToCartSuccess, (state, { item }) => {
        const exists = state.activeItems.findIndex(i => i._id === item._id);
        const activeItems = exists >= 0
            ? state.activeItems.map(i => i._id === item._id ? item : i)
            : [...state.activeItems, item];

        const subtotal = activeItems.reduce((s, i) => s + i.totalPrice, 0);
        const totalItems = activeItems.length;

        return { ...state, activeItems, subtotal, totalItems, loading: false };
    }),

    on(CartActions.addToCartFailure, (state, { error }) => ({
        ...state,
        loading: false,
        error,
    })),

    on(CartActions.updateCartItemSuccess, (state, { item }) => {
        const activeItems = state.activeItems.map(i => i._id === item._id ? item : i);
        const subtotal = activeItems.reduce((s, i) => s + i.totalPrice, 0);
        return { ...state, activeItems, subtotal };
    }),

    on(CartActions.removeCartItemSuccess, (state, { itemId }) => {
        const activeItems = state.activeItems.filter(i => i._id !== itemId);
        const priceChangedItems = state.priceChangedItems.filter(i => i._id !== itemId);
        const subtotal = activeItems.reduce((s, i) => s + i.totalPrice, 0);
        const totalItems = activeItems.length;
        return { ...state, activeItems, priceChangedItems, subtotal, totalItems };
    }),

    on(CartActions.reAddItemSuccess, (state, { cart }) => ({
        ...state,
        activeItems: cart.activeItems,
        priceChangedItems: cart.priceChangedItems,
        subtotal: cart.subtotal,
        totalItems: cart.totalItems,
    })),
    on(CartActions.clearCart, () => ({ ...initialCartState })),
);