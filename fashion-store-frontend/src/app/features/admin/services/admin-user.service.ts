import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { API } from "../../../core/config/api.config";
import { ApiResponse, PaginatedResponse, User } from "../../../core/models/api-response.model";

@Injectable({ providedIn: "root" })
export class AdminUserService {

  constructor(private http: HttpClient) { }

  getUsers(options: {
    role?: string;
    isActive?: boolean;
    search?: string;
    page?: number;
    limit?: number;
  } = {}): Observable<ApiResponse<PaginatedResponse<User>>> {
    const params: Record<string, string> = {};
    Object.entries(options).forEach(([k, v]) => {
      if (v !== undefined && v !== "") params[k] = String(v);
    });
    return this.http.get<ApiResponse<PaginatedResponse<User>>>(
      API.ADMIN.USERS, { params }
    );
  }

  createUser(userData: Partial<User>): Observable<ApiResponse<User>> {
    return this.http.post<ApiResponse<User>>(API.ADMIN.USERS, userData);
  }

  updateUser(id: string, userData: Partial<User>): Observable<ApiResponse<User>> {
    // API.ADMIN.USER(id) probably needs to be API.ADMIN.USERS + '/' + id if not defined that way.
    // Let's assume API.ADMIN.USERS is '/api/admin/users'.
    return this.http.patch<ApiResponse<User>>(`${API.ADMIN.USERS}/${id}`, userData);
  }

  deleteUser(id: string): Observable<ApiResponse<null>> {
    return this.http.delete<ApiResponse<null>>(`${API.ADMIN.USERS}/${id}`);
  }

  toggleActive(
    id: string,
    isActive: boolean
  ): Observable<ApiResponse<User>> {
    return this.http.patch<ApiResponse<User>>(
      `${API.ADMIN.USERS}/${id}/toggle-active`, { isActive }
    );
  }
}
