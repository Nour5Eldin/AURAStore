import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';
import { takeUntil, debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';
import { environment } from '../../../../environments/environment';

/** Filter state — single source of truth, synced with URL params */
interface CatalogFilters {
  categoryId: string;
  subCategoryId: string;
  minPrice: number | null;
  maxPrice: number | null;
  search: string;
  sortBy: string;
  page: number;
  limit: number;
}

@Component({
  selector: 'app-product-listing-page',
  standalone: false,
  templateUrl: './product-listing-page.html',
  styleUrls: ['./product-listing-page.scss'],
})
export class ProductListingPage implements OnInit, OnDestroy {

  // ── Data ────────────────────────────────────────────────────────────────
  products: any[] = [];
  subcategories: any[] = [];
  loading = true;
  total = 0;
  totalPages = 0;
  currentPage = 1;

  // ── UI State ────────────────────────────────────────────────────────────
  categoryTitle = '';
  categoryDesc  = '';
  bannerImage   = '';
  showFilters   = false;

  /** Expose Math for template use */
  Math = Math;

  sortOptions = [
    { value: 'newest',      label: 'Newest' },
    { value: 'price_asc',   label: 'Price: Low to High' },
    { value: 'price_desc',  label: 'Price: High to Low' },
    { value: 'best_sellers', label: 'Best Selling' },
  ];

  // ── Filter State ─────────────────────────────────────────────────────────
  filters: CatalogFilters = {
    categoryId: '', subCategoryId: '',
    minPrice: null, maxPrice: null,
    search: '', sortBy: 'newest',
    page: 1, limit: 20,
  };

  pendingFilters: CatalogFilters = { ...this.filters };

  private destroy$      = new Subject<void>();
  private searchInput$  = new Subject<string>();
  private base          = environment.apiUrl;

  constructor(
    private http:   HttpClient,
    private route:  ActivatedRoute,
    private router: Router,
  ) {}

  // ─── Lifecycle ────────────────────────────────────────────────────────────

  ngOnInit(): void {
    // 1. Sync filters from URL params — single subscription entry point
    this.route.queryParams
      .pipe(takeUntil(this.destroy$))
      .subscribe(params => {
        this.syncFromParams(params);
        this.loadProducts();
        this.loadSubcategories();
      });

    // 2. Debounced search — avoids hammering the API on every keystroke
    this.searchInput$.pipe(
      debounceTime(380),
      distinctUntilChanged(),
      takeUntil(this.destroy$)
    ).subscribe(() => this.applyFilters());
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  // ─── URL Sync ─────────────────────────────────────────────────────────────

  private syncFromParams(params: any): void {
    this.filters.categoryId    = params['categoryId']    || '';
    this.filters.subCategoryId = params['subCategoryId'] || '';
    this.filters.search        = params['search']        || '';
    this.filters.sortBy        = params['sortBy']        || 'newest';
    this.filters.minPrice      = params['minPrice'] ? Number(params['minPrice']) : null;
    this.filters.maxPrice      = params['maxPrice'] ? Number(params['maxPrice']) : null;
    this.currentPage           = Number(params['page'])  || 1;
    this.filters.page          = this.currentPage;

    this.pendingFilters = { ...this.filters };
  }

  /** Push current filter state to URL — triggers queryParams subscription */
  applyFilters(): void {
    this.currentPage  = 1;
    this.filters.page = 1;
    this.router.navigate([], {
      relativeTo:          this.route,
      queryParams:         this.buildQueryParams(),
      // By omitting queryParamsHandling, we replace all query params with what's built, 
      // and we add a state to history so "Undo" (Back Button) works logically.
    });
  }

  private buildQueryParams(): Record<string, any> {
    const p: Record<string, any> = {};
    if (this.filters.categoryId)    p['categoryId']    = this.filters.categoryId;
    if (this.filters.subCategoryId) p['subCategoryId'] = this.filters.subCategoryId;
    if (this.filters.search)        p['search']        = this.filters.search;
    if (this.filters.sortBy && this.filters.sortBy !== 'newest') p['sortBy'] = this.filters.sortBy;
    if (this.filters.minPrice != null) p['minPrice'] = this.filters.minPrice;
    if (this.filters.maxPrice != null) p['maxPrice'] = this.filters.maxPrice;
    return p;
  }

  // ─── Data Loading ─────────────────────────────────────────────────────────

  loadProducts(): void {
    this.loading = true;
    const params: Record<string, any> = { page: this.currentPage, limit: this.filters.limit };
    if (this.filters.categoryId)    params['categoryId']    = this.filters.categoryId;
    if (this.filters.subCategoryId) params['subCategoryId'] = this.filters.subCategoryId;
    if (this.filters.search)        params['search']        = this.filters.search;
    if (this.filters.minPrice)      params['minPrice']      = this.filters.minPrice;
    if (this.filters.maxPrice)      params['maxPrice']      = this.filters.maxPrice;
    if (this.filters.sortBy)        params['sortBy']        = this.filters.sortBy;

    this.http.get<any>(`${this.base}/products`, { params }).subscribe({
      next: r => {
        const raw = r.data?.data || r.data || [];
        const unique = [];
        const seen = new Set();
        for (const p of raw) {
          if (!seen.has(p._id)) {
            seen.add(p._id);
            unique.push(p);
          }
        }
        this.products   = unique;
        this.total      = r.data?.total || 0;
        this.totalPages = r.data?.totalPages || 1;
        this.loading    = false;
        window.scrollTo({ top: 0, behavior: 'smooth' });
      },
      error: () => { this.loading = false; }
    });
  }

  loadSubcategories(): void {
    if (this.filters.categoryId) {
      this.http.get<any>(`${this.base}/categories/sub`, {
        params: { categoryId: this.filters.categoryId }
      }).subscribe({ next: r => { this.subcategories = r.data || []; } });
    }

    // Attempt to set category title dynamically based on search or category ID
    if (this.filters.search && ['men', 'women', 'kids'].includes(this.filters.search.toLowerCase())) {
      const g = this.filters.search;
      this.categoryTitle = g.charAt(0).toUpperCase() + g.slice(1);
    } else if (this.filters.categoryId) {
      this.http.get<any>(`${this.base}/categories`).subscribe({
        next: r => {
          const cats = r.data || [];
          const matched = cats.find((c: any) => c._id === this.filters.categoryId);
          if (matched) this.categoryTitle = matched.title;
        }
      });
    } else {
      this.categoryTitle = 'All Products';
    }
  }

  // ─── Filter Actions ───────────────────────────────────────────────────────

  /** Debounced — called on every keypress in the search input */
  onSearchInput(): void {
    this.searchInput$.next(this.filters.search);
  }

  openFilters(): void {
    this.pendingFilters = { ...this.filters };
    this.showFilters = true;
  }

  closeFilters(): void {
    this.showFilters = false;
  }

  commitFilters(): void {
    this.filters = { ...this.pendingFilters };
    this.showFilters = false;
    this.applyFilters();
  }

  togglePendingSubcategory(id: string): void {
    this.pendingFilters.subCategoryId = this.pendingFilters.subCategoryId === id ? '' : id;
  }

  clearPendingFilters(): void {
    this.pendingFilters = {
      ...this.pendingFilters,
      subCategoryId: '', search: '',
      minPrice: null, maxPrice: null,
      sortBy: 'newest',
    };
  }

  clearFilter(type: string): void {
    if (type === 'search') this.filters.search = '';
    if (type === 'price')  { this.filters.minPrice = null; this.filters.maxPrice = null; }
    if (type === 'subcategory') {
      this.filters.subCategoryId = '';
      this.filters.categoryId = ''; // Clear parent category to return to the main gender section
    }
    
    this.pendingFilters = { ...this.filters };
    // When clearing active chips, apply immediately.
    this.applyFilters();
  }

  clearAllFilters(): void {
    // Preserve gender context if search represents a gender
    const isGender = ['men', 'women', 'kids'].includes(this.filters.search?.toLowerCase());
    
    this.filters = {
      ...this.filters,
      categoryId: '', subCategoryId: '',
      search: isGender ? this.filters.search : '',
      minPrice: null,   maxPrice: null,
      sortBy: 'newest',
    };
    this.pendingFilters = { ...this.filters };
    this.applyFilters();
  }

  goToPage(page: number): void {
    if (page < 1 || page > this.totalPages) return;
    this.currentPage  = page;
    this.filters.page = page;
    this.loadProducts();
  }

  goToProduct(slug: string): void {
    this.router.navigate(['/products', slug]);
  }

  // ─── Computed Properties ──────────────────────────────────────────────────

  get activeFilterCount(): number {
    let n = 0;
    if (this.filters.subCategoryId) n++;
    if (this.filters.search) n++;
    if (this.filters.minPrice || this.filters.maxPrice) n++;
    return n;
  }

  get activeSubcategoryName(): string {
    if (!this.filters.subCategoryId) return '';
    const sub = this.subcategories.find(s => s._id === this.filters.subCategoryId);
    return sub?.title || '';
  }

  get pageNumbers(): number[] {
    return Array.from({ length: this.totalPages }, (_, i) => i + 1);
  }
}