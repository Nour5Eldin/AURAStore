import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import { API } from "../config/api.config";
import { ApiResponse, User } from "../models/api-response.model";

@Injectable({ providedIn: "root" })
export class AuthService {

  constructor(private http: HttpClient) { }

  syncCurrentUser(profile: { email?: string; name?: string; picture?: string }): Observable<User> {
    return this.http.post<ApiResponse<User>>(API.AUTH.SYNC, profile).pipe(
      map(res => res.data)
    );
  }

  getMe(): Observable<User> {
    return this.http.get<ApiResponse<User>>(
      API.AUTH.ME
    ).pipe(map(res => res.data));
  }

  updateProfile(data: {
    name?: string;
    email?: string;
    gender?: string;
    emailConsent?: boolean;
  }): Observable<User> {
    return this.http.patch<ApiResponse<User>>(
      API.AUTH.PROFILE,
      data
    ).pipe(map(res => res.data));
  }

  uploadAvatar(file: File): Observable<User> {
    const formData = new FormData();
    formData.append("avatar", file);
    return this.http.post<ApiResponse<User>>(
      API.AUTH.AVATAR,
      formData
    ).pipe(map(res => res.data));
  }

  removeAvatar(): Observable<User> {
    return this.http.delete<ApiResponse<User>>(
      API.AUTH.AVATAR
    ).pipe(map(res => res.data));
  }

}
