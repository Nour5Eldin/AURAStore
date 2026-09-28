import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { API } from "../../../core/config/api.config";
import { ApiResponse, Order, Address, CartResponse, } from "../../../core/models/api-response.model";

@Injectable({ providedIn: "root" })
export class CheckoutService {

  constructor(private http: HttpClient) { }

  getCart(): Observable<ApiResponse<CartResponse>> {
    return this.http.get<ApiResponse<CartResponse>>(API.CART.BASE);
  }

  getAddresses(): Observable<ApiResponse<Address[]>> {
    return this.http.get<ApiResponse<Address[]>>(API.ADDRESSES.BASE);
  }

  placeOrder(data: {
    addressId: string;
    phoneNumber: string;
  }): Observable<ApiResponse<Order>> {
    return this.http.post<ApiResponse<Order>>(API.ORDERS.BASE, data);
  }

  getOrderDetail(id: string): Observable<ApiResponse<Order>> {
    return this.http.get<ApiResponse<Order>>(API.ORDERS.BY_ID(id));
  }
}