import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { API } from "../../../core/config/api.config";
import { ApiResponse, PaginatedResponse, Category, Subcategory } from "../../../core/models/api-response.model";

@Injectable({ providedIn: "root" })
export class AdminCategoryService {

  constructor(private http: HttpClient) { }

  getCategories(
    page = 1
  ): Observable<ApiResponse<PaginatedResponse<Category>>> {
    return this.http.get<ApiResponse<PaginatedResponse<Category>>>(
      API.ADMIN.CATEGORIES, { params: { page } }
    );
  }

  createCategory(data: {
    title: string;
    isActive?: boolean;
  }): Observable<ApiResponse<Category>> {
    return this.http.post<ApiResponse<Category>>(
      API.ADMIN.CATEGORIES, data
    );
  }

  updateCategory(
    id: string,
    data: { title?: string; isActive?: boolean }
  ): Observable<ApiResponse<Category>> {
    return this.http.patch<ApiResponse<Category>>(
      API.ADMIN.CATEGORY(id), data
    );
  }

  deleteCategory(id: string): Observable<ApiResponse<null>> {
    return this.http.delete<ApiResponse<null>>(API.ADMIN.CATEGORY(id));
  }

  toggleCategory(
    id: string,
    isActive: boolean
  ): Observable<ApiResponse<Category>> {
    return this.http.patch<ApiResponse<Category>>(
      API.ADMIN.CATEGORY_TOGGLE(id), { isActive }
    );
  }

  getSubcategories(): Observable<ApiResponse<PaginatedResponse<Subcategory>>> {
    return this.http.get<ApiResponse<PaginatedResponse<Subcategory>>>(
      API.ADMIN.SUBCATEGORIES
    );
  }

  createSubcategory(data: {
    title: string;
    categoryId: string;
    isActive?: boolean;
  }): Observable<ApiResponse<Subcategory>> {
    return this.http.post<ApiResponse<Subcategory>>(
      API.ADMIN.SUBCATEGORIES, data
    );
  }

  updateSubcategory(
    id: string,
    data: { title?: string; isActive?: boolean }
  ): Observable<ApiResponse<Subcategory>> {
    return this.http.patch<ApiResponse<Subcategory>>(
      API.ADMIN.SUBCATEGORY(id), data
    );
  }

  deleteSubcategory(id: string): Observable<ApiResponse<null>> {
    return this.http.delete<ApiResponse<null>>(
      API.ADMIN.SUBCATEGORY(id)
    );
  }
}