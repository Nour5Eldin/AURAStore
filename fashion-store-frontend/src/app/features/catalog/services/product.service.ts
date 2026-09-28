import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { map, Observable } from "rxjs";
import { ApiResponse, PaginatedResponse, Product, RatingSummary, Review } from "../../../core/models/api-response.model";
import { API } from "../../../core/config/api.config";

export interface ProductFilters {
    categoryId?: string;
    subCategoryId?: String;
    minPrice?: number;
    maxPrice?: number;
    search?: string;
    page?: number;
    limit?: number;
    sortBy?: "newest" | "price_asc" | "price_desc" | "best_sellers";
    [key: string]: any;
}
export interface ReviewRequest {
    stars: number;
    comment: string;
    images?: File[];
}

@Injectable({ providedIn: "root" })
export class ProductService {
    constructor(private http: HttpClient) { }
    getProducts(
        filters: ProductFilters = {}
    ): Observable<ApiResponse<PaginatedResponse<Product>>> {
        return this.http.get<ApiResponse<PaginatedResponse<Product>>>(
            API.PRODUCTS.BASE,
            { params: this.buildParams(filters) }
        );
    }

    getNewArrivals(limit = 8): Observable<ApiResponse<Product[]>> {
        return this.http.get<ApiResponse<Product[]>>(
            API.PRODUCTS.NEW_ARRIVALS,
            { params: { limit } }
        );
    }
    getBestSellers(limit = 8): Observable<ApiResponse<Product[]>> {
        return this.http.get<ApiResponse<Product[]>>(
            API.PRODUCTS.BEST_SELLERS,
            { params: { limit } }
        );
    }

    getProductBySlug(slug: string): Observable<ApiResponse<Product>> {
        return this.http.get<ApiResponse<Product>>(API.PRODUCTS.BY_SLUG(slug));
    }

    getRelatedProducts(slug: string): Observable<ApiResponse<Product[]>> {
        return this.http.get<ApiResponse<Product[]>>(API.PRODUCTS.RELATED(slug));
    }
    getProductReviews(
        productId: string,
        page = 1,
        limit = 10,
        stars?: number
    ): Observable<ApiResponse<{
        reviews: PaginatedResponse<Review>;
        summary: RatingSummary;
    }>> {
        const params: Record<string, string | number | boolean> = { page, limit };
        if (stars) params["stars"] = stars;

        return this.http.get<ApiResponse<any>>(
            API.PRODUCTS.REVIEWS(productId),
            { params }
        );
    }

    createReview(
        productId: string,
        data: ReviewRequest
    ): Observable<ApiResponse<Review>> {
        const formData = new FormData();
        formData.append("stars", String(data.stars));
        formData.append("comment", data.comment);

        data.images?.forEach(img => formData.append("images", img));

        return this.http.post<ApiResponse<Review>>(
            API.PRODUCTS.REVIEWS(productId),
            formData
        );
    }

    deleteReview(reviewId: string): Observable<ApiResponse<null>> {
        return this.http.delete<ApiResponse<null>>(
            `${API.BASE}/reviews/${reviewId}`
        );
    }

    getAdminProducts(filters: {
        categoryId?: string;
        subCategoryId?: string;
        isActive?: boolean;
        isDeleted?: boolean;
        page?: number;
        limit?: number;
    } = {}): Observable<ApiResponse<PaginatedResponse<Product>>> {
        return this.http.get<ApiResponse<PaginatedResponse<Product>>>(
            API.ADMIN.PRODUCTS,
            { params: this.buildParams(filters) }
        );
    }

    createProduct(data: FormData): Observable<ApiResponse<Product>> {
        return this.http.post<ApiResponse<Product>>(API.ADMIN.PRODUCTS, data);
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

    toggleProductActive(
        id: string,
        isActive: boolean
    ): Observable<ApiResponse<Product>> {
        return this.http.patch<ApiResponse<Product>>(
            API.ADMIN.PRODUCT_TOGGLE(id),
            { isActive }
        );
    }

    getLowStockProducts(): Observable<ApiResponse<Product[]>> {
        return this.http.get<ApiResponse<Product[]>>(
            `${API.ADMIN.PRODUCTS}/low-stock`
        );
    }
    private buildParams(
        obj: Record<string, unknown>
    ): Record<string, string> {
        const params: Record<string, string> = {};
        Object.entries(obj).forEach(([key, val]) => {
            if (val !== undefined && val !== null && val !== "") {
                params[key] = String(val);
            }
        });
        return params;
    }
    getMaxPrice(): Observable<number> {
  return this.getProducts({ sortBy: "price_desc", limit: 1 }).pipe(
    map(res => res.data.data[0]?.price || 50000)
  );
}
}
