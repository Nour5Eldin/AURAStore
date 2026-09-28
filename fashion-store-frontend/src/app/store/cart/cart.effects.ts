import { inject, Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { HttpClient } from "@angular/common/http";
import { of } from "rxjs";
import { switchMap, map, catchError } from "rxjs/operators";
import * as CartActions from "./cart.actions";
import { NotificationService } from "../../core/services/notification.service";
import { API } from "../../core/config/api.config";
import { ApiResponse, CartItem, CartResponse } from "../../core/models/api-response.model";

@Injectable()
export class CartEffects {
    private actions$ = inject(Actions);
    private http = inject(HttpClient); 
    private notification = inject(NotificationService);

    constructor() {}

    loadCart$ = createEffect(() => {
        return this.actions$.pipe(
            ofType(CartActions.loadCart),
            switchMap(() => 
                this.http.get<ApiResponse<CartResponse>>(API.CART.BASE).pipe(
                    map(res => CartActions.loadCartSuccess({ cart: res.data })),
                    catchError(() => of(CartActions.loadCartFailure({error: "Failed to load cart"})))
                )
            )
        );
    });

    addToCart$ = createEffect(() => {
        return this.actions$.pipe(
            ofType(CartActions.addToCart),
            switchMap(({ productId, quantity }) =>
                this.http.post<ApiResponse<CartItem>>(
                    API.CART.BASE, { productId, quantity }
                ).pipe(
                    map(res => {
                        this.notification.success("Item added to cart!");
                        return CartActions.addToCartSuccess({ item: res.data });
                    }),
                    catchError(err => of(CartActions.addToCartFailure({
                        error: err.error?.message || "Failed to add item."
                    })))
                )
            )
        );
    });

    updateItem$ = createEffect(() => {
        return this.actions$.pipe(
            ofType(CartActions.updateCartItem),
            switchMap(({ itemId, quantity }) =>
                this.http.patch<ApiResponse<CartItem>>(
                    API.CART.ITEM(itemId), { quantity }
                ).pipe(
                    map(res => CartActions.updateCartItemSuccess({ item: res.data })),
                    catchError(() => of(CartActions.loadCart()))
                )
            )
        );
    });

    removeItem$ = createEffect(() => {
        return this.actions$.pipe(
            ofType(CartActions.removeCartItem),
            switchMap(({ itemId }) =>
                this.http.delete<ApiResponse<null>>(API.CART.ITEM(itemId)).pipe(
                    map(() => {
                        this.notification.info("Item removed from cart.");
                        return CartActions.removeCartItemSuccess({ itemId });
                    }),
                    catchError(() => of(CartActions.loadCart()))
                )
            )
        );
    });

    reAddItem$ = createEffect(() => {
        return this.actions$.pipe(
            ofType(CartActions.reAddItem),
            switchMap(({ itemId }) =>
                this.http.post<ApiResponse<CartItem>>(
                    API.CART.RE_ADD(itemId), {}
                ).pipe(
                    switchMap(() =>
                        this.http.get<ApiResponse<CartResponse>>(API.CART.BASE).pipe(
                            map(res => CartActions.reAddItemSuccess({ cart: res.data }))
                        )
                    ),
                    catchError(() => of(CartActions.loadCart()))
                )
            )
        );
    });
}