import { Injectable }      from "@angular/core";
import { HttpClient }      from "@angular/common/http";
import { Observable }      from "rxjs";
import { API }             from "../../../core/config/api.config";
import { ApiResponse, Address } from "../../../core/models/api-response.model";

@Injectable({ providedIn: "root" })
export class AccountAddressService {

  constructor(private http: HttpClient) {}

  getAddresses(): Observable<ApiResponse<Address[]>> {
    return this.http.get<ApiResponse<Address[]>>(API.ADDRESSES.BASE);
  }

  createAddress(data: {
    label:       "home" | "work" | "other";
    addressText: string;
    isDefault?:  boolean;
  }): Observable<ApiResponse<Address>> {
    return this.http.post<ApiResponse<Address>>(
      API.ADDRESSES.BASE, data
    );
  }

  updateAddress(
    id:   string,
    data: { label?: string; addressText?: string }
  ): Observable<ApiResponse<Address>> {
    return this.http.patch<ApiResponse<Address>>(
      API.ADDRESSES.BY_ID(id), data
    );
  }

  deleteAddress(id: string): Observable<ApiResponse<null>> {
    return this.http.delete<ApiResponse<null>>(
      API.ADDRESSES.BY_ID(id)
    );
  }

  setDefault(id: string): Observable<ApiResponse<Address>> {
    return this.http.patch<ApiResponse<Address>>(
      API.ADDRESSES.SET_DEFAULT(id), {}
    );
  }
}