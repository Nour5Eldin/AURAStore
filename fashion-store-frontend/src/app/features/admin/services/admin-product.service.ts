import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { API } from "../../../core/config/api.config";
import { ApiResponse, PaginatedResponse, Product } from "../../../core/models/api-response.model";

@Injectable({ providedIn: "root" })
export class AdminProductService {

  constructor(private http: HttpClient) { }

  getProducts(filters: {
    categoryId?: string;
    subCategoryId?: string;
    isActive?: boolean;
    isDeleted?: boolean;
    page?: number;
    limit?: number;
  } = {}): Observable<ApiResponse<PaginatedResponse<Product>>> {
    const params: Record<string, string> = {};
    Object.entries(filters).forEach(([k, v]) => {
      if (v !== undefined) params[k] = String(v);
    });
    return this.http.get<ApiResponse<PaginatedResponse<Product>>>(
      API.ADMIN.PRODUCTS, { params }
    );
  }

  getLowStock(): Observable<ApiResponse<Product[]>> {
    return this.http.get<ApiResponse<Product[]>>(
      `${API.ADMIN.PRODUCTS}/low-stock`
    );
  }

  createProduct(formData: FormData): Observable<ApiResponse<Product>> {
    return this.http.post<ApiResponse<Product>>(
      API.ADMIN.PRODUCTS, formData
    );
  }

  updateProduct(
    id: string,
    data: FormData | Record<string, unknown>
  ): Observable<ApiResponse<Product>> {
    return this.http.patch<ApiResponse<Product>>(
      API.ADMIN.PRODUCT(id), data
    );
  }

  deleteProduct(id: string): Observable<ApiResponse<null>> {
    return this.http.delete<ApiResponse<null>>(API.ADMIN.PRODUCT(id));
  }

  toggleActive(
    id: string,
    isActive: boolean
  ): Observable<ApiResponse<Product>> {
    return this.http.patch<ApiResponse<Product>>(
      API.ADMIN.PRODUCT_TOGGLE(id), { isActive }
    );
  }
}