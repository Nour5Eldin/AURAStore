import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable, of, shareReplay } from "rxjs";
import { map, tap } from "rxjs/operators";
import { API } from "../../../core/config/api.config";
import {
  ApiResponse,
  PaginatedResponse,
  Category,
  Subcategory,
} from "../../../core/models/api-response.model";

/**
 * AdminCacheService — fetches admin reference data ONCE and caches it in memory.
 *
 * Instead of every admin page making its own HTTP calls for categories /
 * subcategories, all pages share the same cached Observable. The cache is
 * invalidated by calling `invalidate()` (e.g. after create / update / delete).
 */
@Injectable({ providedIn: "root" })
export class AdminCacheService {

  private categories$: Observable<Category[]> | null = null;
  private subcategories$: Observable<Subcategory[]> | null = null;

  constructor(private http: HttpClient) {}

  // ─── Categories ─────────────────────────────────────────────────────────────

  /** Returns all admin categories (cached). */
  getCategories(): Observable<Category[]> {
    if (!this.categories$) {
      this.categories$ = this.http
        .get<ApiResponse<PaginatedResponse<Category>>>(API.ADMIN.CATEGORIES, {
          params: { page: 1, limit: 100 },
        })
        .pipe(
          map((res) => res.data?.data ?? []),
          shareReplay(1)          // ← share one HTTP request among all subscribers
        );
    }
    return this.categories$;
  }

  // ─── Subcategories ──────────────────────────────────────────────────────────

  /** Returns ALL subcategories in one request (cached). */
  getSubcategories(): Observable<Subcategory[]> {
    if (!this.subcategories$) {
      this.subcategories$ = this.http
        .get<ApiResponse<PaginatedResponse<Subcategory>>>(API.ADMIN.SUBCATEGORIES, {
          params: { limit: 200 },
        })
        .pipe(
          map((res) => res.data?.data ?? []),
          shareReplay(1)
        );
    }
    return this.subcategories$;
  }

  /** Subcategories filtered by a specific category ID (uses the shared cache). */
  getSubcategoriesFor(categoryId: string): Observable<Subcategory[]> {
    return this.getSubcategories().pipe(
      map((subs) => subs.filter((s) => s.categoryId === categoryId))
    );
  }

  // ─── Cache control ──────────────────────────────────────────────────────────

  /** Call this after any create / update / delete to force a fresh fetch. */
  invalidate(type: "categories" | "subcategories" | "all" = "all"): void {
    if (type === "categories" || type === "all") this.categories$ = null;
    if (type === "subcategories" || type === "all") this.subcategories$ = null;
  }
}
