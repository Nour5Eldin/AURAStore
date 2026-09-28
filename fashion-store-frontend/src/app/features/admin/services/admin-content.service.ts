import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { API } from "../../../core/config/api.config";
import { ApiResponse, HomeSlide, SiteConfig } from "../../../core/models/api-response.model";

@Injectable({ providedIn: "root" })
export class AdminContentService {

  constructor(private http: HttpClient) { }

  // ─── Public APIs ──────────────────────────────────────────────────────────

  getPublicSlides(): Observable<ApiResponse<HomeSlide[]>> {
    return this.http.get<ApiResponse<HomeSlide[]>>(API.CONTENT.SLIDES);
  }

  getPublicCampaign(): Observable<ApiResponse<SiteConfig>> {
    return this.http.get<ApiResponse<SiteConfig>>(API.CONTENT.CAMPAIGN);
  }

  // ─── Admin Slides APIs ─────────────────────────────────────────────────────

  getAdminSlides(): Observable<ApiResponse<HomeSlide[]>> {
    return this.http.get<ApiResponse<HomeSlide[]>>(API.ADMIN.CONTENT_SLIDES);
  }

  createSlide(data: FormData | any): Observable<ApiResponse<HomeSlide>> {
    return this.http.post<ApiResponse<HomeSlide>>(API.ADMIN.CONTENT_SLIDES, data);
  }

  updateSlide(id: string, data: FormData | any): Observable<ApiResponse<HomeSlide>> {
    return this.http.patch<ApiResponse<HomeSlide>>(API.ADMIN.CONTENT_SLIDE(id), data);
  }

  deleteSlide(id: string): Observable<ApiResponse<null>> {
    return this.http.delete<ApiResponse<null>>(API.ADMIN.CONTENT_SLIDE(id));
  }

  // ─── Admin Campaign APIs ──────────────────────────────────────────────────

  getAdminCampaign(): Observable<ApiResponse<SiteConfig>> {
    return this.http.get<ApiResponse<SiteConfig>>(API.ADMIN.CONTENT_CAMPAIGN);
  }

  updateCampaign(config: Partial<SiteConfig>): Observable<ApiResponse<SiteConfig>> {
    return this.http.put<ApiResponse<SiteConfig>>(API.ADMIN.CONTENT_CAMPAIGN, config);
  }
}
