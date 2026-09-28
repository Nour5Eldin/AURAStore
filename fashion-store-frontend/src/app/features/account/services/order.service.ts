import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { API } from "../../../core/config/api.config";
import { ApiResponse, PaginatedResponse, Order, OrderStatus } from "../../../core/models/api-response.model";

@Injectable({ providedIn: "root" })
export class AccountOrderService {

  constructor(private http: HttpClient) { }

  getUserOrders(options: {
    status?: OrderStatus;
    page?: number;
    limit?: number;
  } = {}): Observable<ApiResponse<PaginatedResponse<Order>>> {
    const params: Record<string, string> = {};
    if (options.status) params["status"] = options.status;
    if (options.page) params["page"] = String(options.page);
    if (options.limit) params["limit"] = String(options.limit);

    return this.http.get<ApiResponse<PaginatedResponse<Order>>>(
      API.ORDERS.BASE, { params }
    );
  }

  getOrderDetail(id: string): Observable<ApiResponse<Order>> {
    return this.http.get<ApiResponse<Order>>(API.ORDERS.BY_ID(id));
  }

  cancelOrder(id: string): Observable<ApiResponse<Order>> {
    return this.http.patch<ApiResponse<Order>>(
      API.ORDERS.CANCEL(id), {}
    );
  }

  requestRefund(
    id: string,
    reason: string
  ): Observable<ApiResponse<Order>> {
    return this.http.post<ApiResponse<Order>>(
      API.ORDERS.REFUND(id), { reason }
    );
  }
}