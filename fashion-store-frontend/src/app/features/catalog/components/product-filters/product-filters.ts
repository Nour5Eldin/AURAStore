import { Component, Input, Output, EventEmitter, OnInit } from "@angular/core";
import { FormBuilder, FormGroup } from "@angular/forms";
import { Category, Subcategory }  from "../../../../core/models/api-response.model";
import { ProductFilters as Filters } from "../../services/product.service";
import { ProductService }     from "../../services/product.service";

@Component({
  selector:    "app-product-filters",
  standalone:  false,
  templateUrl: "./product-filters.html",
  styleUrls:   ["./product-filters.scss"],
})
export class ProductFilters implements OnInit {

  @Input()  categories:    Category[]    = [];
  @Input()  subcategories: Subcategory[] = [];
  @Input()  filters:       Filters       = {};
  @Output() filtersChange  = new EventEmitter<Partial<Filters>>();
  @Output() categorySelect = new EventEmitter<string | undefined>();
  @Output() clearAll       = new EventEmitter<void>();

  sortOptions = [
    { value: "newest",       label: "Newest First"    },
    { value: "price_asc",    label: "Price: Low–High" },
    { value: "price_desc",   label: "Price: High–Low" },
    { value: "best_sellers", label: "Best Sellers"    },
  ];

  // ─── Price Range ─────────────────────────────────────────────────────────
  minPrice    = 0;
  maxPrice    = 50000;    
  priceMin    = 0;
  priceMax    = 5000;

  constructor(private productSvc: ProductService) {}

  ngOnInit(): void {
    // جيب أعلى سعر من الـ API
    this.productSvc.getMaxPrice().subscribe(max => {
      this.maxPrice = max;
      this.priceMax = max;
      // لو في filter موجود من الـ URL
      if (this.filters.maxPrice) this.priceMax = this.filters.maxPrice;
      if (this.filters.minPrice) this.priceMin = this.filters.minPrice;
    });
  }

  onMinChange(val: number): void {
    this.priceMin = Math.min(+val, this.priceMax - 100);
    this.emitPrice();
  }

  onMaxChange(val: number): void {
    this.priceMax = Math.max(+val, this.priceMin + 100);
    this.emitPrice();
  }

  private emitPrice(): void {
    this.filtersChange.emit({
      minPrice: this.priceMin > 0         ? this.priceMin : undefined,
      maxPrice: this.priceMax < this.maxPrice ? this.priceMax : undefined,
      page:     1,
    });
  }

  onCategoryChange(catId: string | undefined): void {
    this.categorySelect.emit(catId);
  }

  onSubcategoryChange(subId: string | undefined): void {
    this.filtersChange.emit({ subCategoryId: subId, page: 1 });
  }

  onSortChange(val: string): void {
    this.filtersChange.emit({ sortBy: val as any, page: 1 });
  }

  get priceMinPercent(): number {
    return (this.priceMin / this.maxPrice) * 100;
  }

  get priceMaxPercent(): number {
    return (this.priceMax / this.maxPrice) * 100;
  }

  get hasActive(): boolean {
    return !!(this.filters.categoryId || this.filters.subCategoryId ||
              this.filters.minPrice   || this.filters.maxPrice ||
              this.filters.search);
  }
}