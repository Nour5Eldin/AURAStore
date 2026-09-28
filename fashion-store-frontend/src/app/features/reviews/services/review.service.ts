import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { API } from "../../../core/config/api.config";
import { ApiResponse, PaginatedResponse, Review, RatingSummary, } from "../../../core/models/api-response.model";

@Injectable({ providedIn: "root" })
export class ReviewService {

  constructor(private http: HttpClient) { }

  getProductReviews(
    productId: string,
    options: { page?: number; limit?: number; stars?: number } = {}
  ): Observable<ApiResponse<{
    reviews: PaginatedResponse<Review>;
    summary: RatingSummary;
  }>> {
    const params: Record<string, string> = {};
    if (options.page) params["page"] = String(options.page);
    if (options.limit) params["limit"] = String(options.limit);
    if (options.stars) params["stars"] = String(options.stars);

    return this.http.get<ApiResponse<any>>(
      API.PRODUCTS.REVIEWS(productId), { params }
    );
  }

  getMyReviews(
    options: { page?: number; limit?: number } = {}
  ): Observable<ApiResponse<PaginatedResponse<Review & { productName?: string; productImage?: string }>>> {
    const params: Record<string, string> = {};
    if (options.page) params["page"] = String(options.page);
    if (options.limit) params["limit"] = String(options.limit);

    return this.http.get<ApiResponse<any>>(
      `${API.BASE}/reviews/my-reviews`, { params }
    );
  }

  createReview(
    productId: string,
    data: { stars: number; comment: string; images?: File[] }
  ): Observable<ApiResponse<Review>> {
    const formData = new FormData();
    formData.append("stars", String(data.stars));
    formData.append("comment", data.comment);
    data.images?.forEach(img => formData.append("images", img));

    return this.http.post<ApiResponse<Review>>(
      API.PRODUCTS.REVIEWS(productId), formData
    );
  }

  updateReview(
    reviewId: string,
    data: { stars?: number; comment?: string; images?: File[] }
  ): Observable<ApiResponse<Review>> {
    const formData = new FormData();
    if (data.stars) formData.append("stars", String(data.stars));
    if (data.comment) formData.append("comment", data.comment);
    data.images?.forEach(img => formData.append("images", img));

    return this.http.patch<ApiResponse<Review>>(
      `${API.BASE}/reviews/${reviewId}`, formData
    );
  }

  deleteReview(reviewId: string): Observable<ApiResponse<null>> {
    return this.http.delete<ApiResponse<null>>(
      `${API.BASE}/reviews/${reviewId}`
    );
  }
}