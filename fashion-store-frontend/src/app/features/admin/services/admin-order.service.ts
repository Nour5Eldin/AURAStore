import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { API } from "../../../core/config/api.config";
import { ApiResponse, PaginatedResponse, Order, OrderStatus } from "../../../core/models/api-response.model";

@Injectable({ providedIn: "root" })
export class AdminOrderService {

  constructor(private http: HttpClient) { }

  getOrders(options: {
    status?: OrderStatus;
    startDate?: string;
    endDate?: string;
    search?: string;
    page?: number;
    limit?: number;
  } = {}): Observable<ApiResponse<PaginatedResponse<Order>>> {
    const params: Record<string, string> = {};
    Object.entries(options).forEach(([k, v]) => {
      if (v !== undefined) params[k] = String(v);
    });
    return this.http.get<ApiResponse<PaginatedResponse<Order>>>(
      API.ADMIN.ORDERS, { params }
    );
  }

  getOrderDetail(id: string): Observable<ApiResponse<Order>> {
    return this.http.get<ApiResponse<Order>>(API.ADMIN.ORDER(id));
  }

  updateStatus(
    id: string,
    status: OrderStatus,
    note?: string
  ): Observable<ApiResponse<Order>> {
    return this.http.patch<ApiResponse<Order>>(
      API.ADMIN.ORDER_STATUS(id), { status, note }
    );
  }

  handleRefund(
    id: string,
    decision: "approved" | "refused"
  ): Observable<ApiResponse<Order>> {
    return this.http.patch<ApiResponse<Order>>(
      API.ADMIN.ORDER_REFUND(id), { decision }
    );
  }

  getDashboardKPIs(): Observable<ApiResponse<{
    totalOrders: number;
    pendingOrders: number;
    totalRevenue: number;
    totalUsers: number;
    lowStockCount: number;
    lowStockItems: any[];
  }>> {
    return this.http.get<ApiResponse<any>>(API.ADMIN.DASHBOARD);
  }
}