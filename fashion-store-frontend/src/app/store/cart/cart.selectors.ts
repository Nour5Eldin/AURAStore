import { createFeatureSelector, createSelector } from "@ngrx/store";
import { CartState } from "./cart.state";

export const selectCartState = createFeatureSelector<CartState>("cart");

export const selectActiveItems = createSelector(selectCartState, s => s.activeItems);
export const selectPriceChangedItems = createSelector(selectCartState, s => s.priceChangedItems);
export const selectCartSubtotal = createSelector(selectCartState, s => s.subtotal);
export const selectCartTotalItems = createSelector(selectCartState, s => s.totalItems);
export const selectCartLoading = createSelector(selectCartState, s => s.loading);
export const selectCartError = createSelector(selectCartState, s => s.error);

export const selectHasItems = createSelector(
    selectActiveItems,
    items => items.length > 0
);

export const selectHasPriceChanges = createSelector(
    selectPriceChangedItems,
    items => items.length > 0
);

export const selectCanCheckout = createSelector(
    selectActiveItems,
    selectPriceChangedItems,
    (active, changed) => active.length > 0
);