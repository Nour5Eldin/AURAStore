import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { API } from "../../../core/config/api.config";
import { ApiResponse } from "../../../core/models/api-response.model";

export interface SalesReport {
  totalRevenue: number;
  totalOrders: number;
  totalUnits: number;
  averageOrderValue: number;
  topProducts: {
    _id: string;
    name: string;
    totalSold: number;
    price: number;
  }[];
}

@Injectable({ providedIn: "root" })
export class AdminReportsService {

  constructor(private http: HttpClient) { }

  getSalesReport(
    startDate: string,
    endDate: string
  ): Observable<ApiResponse<SalesReport>> {
    return this.http.get<ApiResponse<SalesReport>>(
      API.ADMIN.REPORTS,
      { params: { startDate, endDate } }
    );
  }
}