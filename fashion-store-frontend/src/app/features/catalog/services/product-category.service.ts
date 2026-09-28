import { Injectable }    from "@angular/core";
import { HttpClient }    from "@angular/common/http";
import { Observable, of } from "rxjs";
import { map, catchError, shareReplay } from "rxjs/operators";
import { API }           from "../../../core/config/api.config";
import {
  ApiResponse,
  NavCategory,
  NavSubcategory,
} from "../../../core/models/api-response.model";

@Injectable({ providedIn: "root" })
export class ProductCategoryService {

  // Cache the single request for the lifetime of the service (singleton)
  private categoriesWithSubs$: Observable<ApiResponse<NavCategory[]>> | null = null;

  constructor(private http: HttpClient) {}

  /**
   * Returns all categories with their subcategories in ONE request.
   * The backend /categories/with-subs uses a MongoDB $lookup to join
   * subcategories server-side — no N+1 problem.
   * Result is cached via shareReplay(1) so multiple components share
   * the same HTTP call.
   */
  getCategoriesWithSubs(): Observable<ApiResponse<NavCategory[]>> {
    if (!this.categoriesWithSubs$) {
      this.categoriesWithSubs$ = this.http
        .get<ApiResponse<NavCategory[]>>(API.CATEGORIES.WITH_SUBS)
        .pipe(
          catchError(() => of({ success: false, message: "", data: [] as NavCategory[] })),
          shareReplay(1)   // ← all subscribers share one HTTP call
        );
    }
    return this.categoriesWithSubs$;
  }

  /** Invalidate cache (call after category/subcategory mutations). */
  invalidateCache(): void {
    this.categoriesWithSubs$ = null;
  }

  getHeaderCategories(
    titles: string[]
  ): Observable<ApiResponse<NavCategory[]>> {
    return this.getCategoriesWithSubs().pipe(
      map(res => ({
        ...res,
        data: res.data.filter(cat =>
          titles.some(t =>
            cat.title.toLowerCase().includes(t.toLowerCase())
          )
        ),
      }))
    );
  }

  getSubcategoriesForGender(
    categories: NavCategory[],
    gender: "men" | "women" | "kids"
  ): { category: NavCategory; subs: NavSubcategory[] }[] {
    return categories
      .map(cat => ({
        category: cat,
        subs: cat.subcategories.filter(sub =>
          sub.title.toLowerCase().includes(gender.toLowerCase()) ||
          sub.title.toLowerCase().includes(this.getGenderLabel(gender))
        ),
      }))
      .filter(item => item.subs.length > 0);
  }

  private getGenderLabel(gender: string): string {
    const map: Record<string, string> = {
      men:   "men's",
      women: "women's",
      kids:  "kids",
      girls: "girls",
    };
    return map[gender.toLowerCase()] || gender;
  }

  getSubcategories(categoryId: string): Observable<ApiResponse<NavSubcategory[]>> {
    // Still available for individual lookups (e.g. product listing filter)
    return this.http.get<ApiResponse<NavSubcategory[]>>(
      API.CATEGORIES.SUBS,
      { params: { categoryId } }
    );
  }
}