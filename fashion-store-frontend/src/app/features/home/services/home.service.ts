import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { API } from "../../../core/config/api.config";
import { ApiResponse, Product, } from "../../../core/models/api-response.model";

@Injectable({ providedIn: "root" })
export class HomeService {

  constructor(private http: HttpClient) { }

  getNewArrivals(limit = 8): Observable<ApiResponse<Product[]>> {
    return this.http.get<ApiResponse<Product[]>>(
      API.PRODUCTS.NEW_ARRIVALS, { params: { limit } }
    );
  }

  getBestSellers(limit = 8): Observable<ApiResponse<Product[]>> {
    return this.http.get<ApiResponse<Product[]>>(
      API.PRODUCTS.BEST_SELLERS, { params: { limit } }
    );
  }
}