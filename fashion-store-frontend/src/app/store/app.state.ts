import { ActionReducerMap } from "@ngrx/store";
import { authReducer } from "./auth/auth.reducer";
import { cartReducer } from "./cart/cart.reducer";
import { AuthState } from "./auth/auth.state";
import { CartState } from "./cart/cart.state";

export interface AppState {
    auth: AuthState;
    cart: CartState;
}

export const reducers: ActionReducerMap<AppState> = {
    auth: authReducer,
    cart: cartReducer,
};

export * from "./auth/auth.actions";
export * from "./auth/auth.selectors";
export * from "./cart/cart.actions";
export * from "./cart/cart.selectors";

export { loadUser } from "./auth/auth.actions";