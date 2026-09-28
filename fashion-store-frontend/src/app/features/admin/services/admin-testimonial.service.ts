import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { API } from "../../../core/config/api.config";
import { ApiResponse, PaginatedResponse, Testimonial } from "../../../core/models/api-response.model";

@Injectable({ providedIn: "root" })
export class AdminTestimonialService {

  constructor(private http: HttpClient) { }

  getTestimonials(options: {
    stars?: number[];
    status?: string;
    startDate?: string;
    endDate?: string;
    page?: number;
    limit?: number;
  } = {}): Observable<ApiResponse<PaginatedResponse<Testimonial>>> {
    const params: Record<string, string> = {};
    if (options.stars?.length) params["stars"] = options.stars.join(",");
    if (options.status) params["status"] = options.status;
    if (options.startDate) params["startDate"] = options.startDate;
    if (options.endDate) params["endDate"] = options.endDate;
    if (options.page) params["page"] = String(options.page);
    if (options.limit) params["limit"] = String(options.limit);

    return this.http.get<ApiResponse<PaginatedResponse<Testimonial>>>(
      API.ADMIN.TESTIMONIALS, { params }
    );
  }

  updateStatus(
    id: string,
    status: "approved" | "refused"
  ): Observable<ApiResponse<Testimonial>> {
    return this.http.patch<ApiResponse<Testimonial>>(
      API.ADMIN.TESTIMONIAL(id), { status }
    );
  }
}