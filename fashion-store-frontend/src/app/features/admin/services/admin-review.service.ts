import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { API } from "../../../core/config/api.config";
import { ApiResponse, PaginatedResponse, Review } from "../../../core/models/api-response.model";

@Injectable({ providedIn: "root" })
export class AdminReviewService {

  constructor(private http: HttpClient) { }

  getReviews(options: {
    productId?: string;
    isApproved?: boolean;
    stars?: number;
    page?: number;
    limit?: number;
  } = {}): Observable<ApiResponse<PaginatedResponse<Review>>> {
    const params: Record<string, string> = {};
    Object.entries(options).forEach(([k, v]) => {
      if (v !== undefined) params[k] = String(v);
    });
    return this.http.get<ApiResponse<PaginatedResponse<Review>>>(
      API.ADMIN.REVIEWS, { params }
    );
  }

  toggleApproval(
    id: string,
    isApproved: boolean
  ): Observable<ApiResponse<Review>> {
    return this.http.patch<ApiResponse<Review>>(
      API.ADMIN.REVIEW(id), { isApproved }
    );
  }
}