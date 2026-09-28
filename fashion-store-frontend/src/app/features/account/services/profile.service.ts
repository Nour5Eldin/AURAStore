import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable, throwError } from "rxjs";
import { API } from "../../../core/config/api.config";
import { ApiResponse, User } from "../../../core/models/api-response.model";

@Injectable({ providedIn: "root" })
export class ProfileService {

  constructor(private http: HttpClient) { }

  getProfile(): Observable<ApiResponse<User>> {
    return this.http.get<ApiResponse<User>>(API.AUTH.ME);
  }

  updateProfile(data: {
    name?: string;
    gender?: string;
    emailConsent?: boolean;
  }): Observable<ApiResponse<User>> {
    return this.http.patch<ApiResponse<User>>(API.AUTH.PROFILE, data);
  }

  changePassword(data: {
    currentPassword: string;
    newPassword: string;
    confirmPassword: string;
  }): Observable<ApiResponse<null>> {
    return throwError(() => new Error("Passwords are managed securely by Auth0."));
  }

  uploadAvatar(file: File): Observable<ApiResponse<User>> {
    const formData = new FormData();
    formData.append("avatar", file);
    return this.http.post<ApiResponse<User>>(API.AUTH.AVATAR, formData);
  }

  removeAvatar(): Observable<ApiResponse<User>> {
    return this.http.delete<ApiResponse<User>>(API.AUTH.AVATAR);
  }
}
