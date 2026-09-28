import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { API } from "../../../core/config/api.config";
import { ApiResponse, Testimonial } from "../../../core/models/api-response.model";

@Injectable({ providedIn: "root" })
export class HomeTestimonialService {

  constructor(private http: HttpClient) { }

  getApproved(limit = 10): Observable<ApiResponse<Testimonial[]>> {
    return this.http.get<ApiResponse<Testimonial[]>>(
      API.TESTIMONIALS.BASE, { params: { limit } }
    );
  }

  submitTestimonial(data: {
    stars: number;
    comment: string;
  }): Observable<ApiResponse<Testimonial>> {
    return this.http.post<ApiResponse<Testimonial>>(
      API.TESTIMONIALS.BASE, data
    );
  }
}