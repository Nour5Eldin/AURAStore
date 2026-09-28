import { createAction, props } from "@ngrx/store";
import { CartItem, CartResponse } from "../../core/models/api-response.model";

const PREFIX = "[Cart]";

export const loadCart = createAction(`${PREFIX} Load Cart`);
export const loadCartSuccess = createAction(`${PREFIX} Load Cart Success`, props<{ cart: CartResponse }>());
export const loadCartFailure = createAction(`${PREFIX} Load Cart Failure`, props<{ error: string }>());

export const addToCart = createAction(
    `${PREFIX} Add To Cart`,
    props<{ productId: string; quantity: number }>()
);
export const addToCartSuccess = createAction(
    `${PREFIX} Add To Cart Success`,
    props<{ item: CartItem }>()
);
export const addToCartFailure = createAction(
    `${PREFIX} Add To Cart Failure`,
    props<{ error: string }>()
);

export const updateCartItem = createAction(
    `${PREFIX} Update Item`,
    props<{ itemId: string; quantity: number }>()
);
export const updateCartItemSuccess = createAction(
    `${PREFIX} Update Item Success`,
    props<{ item: CartItem }>()
);

export const removeCartItem = createAction(
    `${PREFIX} Remove Item`,
    props<{ itemId: string }>()
);
export const removeCartItemSuccess = createAction(
    `${PREFIX} Remove Item Success`,
    props<{ itemId: string }>()
);

export const reAddItem = createAction(`${PREFIX} Re-Add Item`, props<{ itemId: string }>());
export const reAddItemSuccess = createAction(`${PREFIX} Re-Add Item Success`, props<{ cart: CartResponse }>());

export const clearCart = createAction(`${PREFIX} Clear Cart`);

export const syncGuestCart = createAction(
    `${PREFIX} Sync Guest Cart`,
    props<{ items: any[] }>()
);