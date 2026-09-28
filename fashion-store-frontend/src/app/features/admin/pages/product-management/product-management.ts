import { Component, OnInit, OnDestroy } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Subject, forkJoin } from "rxjs";
import { takeUntil } from "rxjs/operators";
import { AdminProductService } from "../../services/admin-product.service";
import { AdminCategoryService } from "../../services/admin-category.service";
import { AdminCacheService } from "../../services/admin-cache.service";
import { NotificationService } from "../../../../core/services/notification.service";
import { Product, Category, Subcategory, PaginatedResponse } from "../../../../core/models/api-response.model";

@Component({
  selector: "app-product-management",
  standalone: false,
  templateUrl: "./product-management.html",
  styleUrls: ["./product-management.scss"],
})
export class ProductManagement implements OnInit, OnDestroy {

  products: Product[] = [];
  categories: Category[] = [];
  subcategories: Subcategory[] = [];
  pagination: Partial<PaginatedResponse<Product>> = {};
  loading = true;
  showForm = false;
  editProduct: Product | null = null;
  saving = false;

  productForm!: FormGroup;
  imageFile: File | null = null;
  imagePreview: string | null = null;

  filters = { page: 1, limit: 15, categoryId: "", isActive: "", search: "" };

  private destroy$ = new Subject<void>();

  constructor(
    private fb: FormBuilder,
    private productSvc: AdminProductService,
    private categorySvc: AdminCategoryService,
    private cache: AdminCacheService,
    private notify: NotificationService,
  ) { }

  ngOnInit(): void {
    this.initForm();
    this.loadCategoriesAndProducts();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  // ─── Form ────────────────────────────────────────────────────────────────

  initForm(): void {
    this.productForm = this.fb.group({
      name: ["", [Validators.required, Validators.minLength(3)]],
      description: ["", [Validators.required, Validators.minLength(10)]],
      price: [0, [Validators.required, Validators.min(1)]],
      stock: [0, [Validators.required, Validators.min(0)]],
      categoryId: ["", Validators.required],
      subCategoryId: [""],
      mainImage: [""],
      isActive: [true],
    });
  }

  openCreate(): void {
    this.editProduct = null;
    this.productForm.reset({ price: 0, stock: 0, isActive: true, categoryId: "", subCategoryId: "" });
    this.imageFile = null;
    this.imagePreview = null;
    this.showForm = true;
  }

  openEdit(product: Product): void {
    this.editProduct = product;
    const catId = typeof product.categoryId === "string" ? product.categoryId : (product.categoryId as any)?._id || "";
    const subCatId = typeof product.subCategoryId === "string" ? product.subCategoryId : (product.subCategoryId as any)?._id || "";

    this.productForm.patchValue({
      name: product.name,
      description: product.description,
      price: product.price,
      stock: product.stock,
      categoryId: catId,
      subCategoryId: subCatId,
      mainImage: product.mainImage,
      isActive: product.isActive,
    });

    this.imagePreview = product.mainImage || null;
    this.imageFile = null;

    if (catId) {
      this.loadSubcategories(catId);
    }

    this.showForm = true;
  }

  closeForm(): void {
    this.showForm = false;
    this.editProduct = null;
    this.imageFile = null;
    this.imagePreview = null;
  }

  onCategoryChange(): void {
    const catId = this.productForm.get("categoryId")?.value;
    this.productForm.patchValue({ subCategoryId: "" });
    this.subcategories = [];
    if (catId) {
      this.loadSubcategories(catId);
    }
  }

  onImageFileChange(event: Event): void {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) {
      this.imageFile = file;
      const reader = new FileReader();
      reader.onload = () => this.imagePreview = reader.result as string;
      reader.readAsDataURL(file);
    }
  }

  onSaveProduct(): void {
    if (this.productForm.invalid) {
      this.productForm.markAllAsTouched();
      return;
    }

    this.saving = true;
    const formData = new FormData();
    const vals = this.productForm.value;

    formData.append("name", vals.name);
    formData.append("description", vals.description);
    formData.append("price", String(vals.price));
    formData.append("stock", String(vals.stock));
    formData.append("categoryId", vals.categoryId);
    if (vals.subCategoryId) formData.append("subCategoryId", vals.subCategoryId);
    formData.append("isActive", String(vals.isActive));

    if (this.imageFile) {
      formData.append("image", this.imageFile);
    } else if (vals.mainImage) {
      formData.append("mainImage", vals.mainImage);
    }

    const action = this.editProduct
      ? this.productSvc.updateProduct(this.editProduct._id, formData)
      : this.productSvc.createProduct(formData);

    action.pipe(takeUntil(this.destroy$)).subscribe({
      next: () => {
        this.notify.success(this.editProduct ? "Product updated." : "Product created.");
        this.saving = false;
        this.closeForm();
        this.loadProducts();
      },
      error: err => {
        this.saving = false;
        this.notify.error(err.error?.message || "Failed to save product.");
      },
    });
  }

  // ─── Data Loading ────────────────────────────────────────────────────────

  /** Load categories from cache + products in parallel. */
  loadCategoriesAndProducts(): void {
    this.loading = true;
    forkJoin([
      this.cache.getCategories(),
      this.loadProductsObservable(),
    ]).pipe(takeUntil(this.destroy$)).subscribe({
      next: ([cats, productsRes]) => {
        this.categories = cats;
        this.products   = productsRes.data?.data ?? [];
        this.pagination = productsRes.data ?? {};
        this.loading    = false;
      },
      error: () => { this.loading = false; },
    });
  }

  private loadProductsObservable() {
    const params: any = { page: this.filters.page, limit: this.filters.limit };
    if (this.filters.categoryId) params.categoryId = this.filters.categoryId;
    if (this.filters.isActive !== "") params.isActive = this.filters.isActive;
    return this.productSvc.getProducts(params);
  }

  loadCategories(): void {
    this.cache.getCategories()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: cats => { this.categories = cats; },
        error: () => { this.categories = []; },
      });
  }

  loadSubcategories(categoryId: string): void {
    this.cache.getSubcategoriesFor(categoryId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: subs => { this.subcategories = subs; },
        error: () => { this.subcategories = []; },
      });
  }

  loadProducts(): void {
    this.loading = true;
    this.loadProductsObservable()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: res => {
          this.products   = res.data?.data ?? [];
          this.pagination = res.data ?? {};
          this.loading    = false;
        },
        error: () => { this.loading = false; },
      });
  }

  // ─── Actions ─────────────────────────────────────────────────────────────

  onToggleActive(product: Product): void {
    this.productSvc.toggleActive(product._id, !product.isActive)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: res => {
          this.products = this.products.map(p =>
            p._id === product._id ? res.data : p
          );
          this.notify.success(`Product ${res.data.isActive ? "activated" : "deactivated"}.`);
        },
        error: err => this.notify.error(err.error?.message || "Failed."),
      });
  }

  onDelete(id: string): void {
    if (!confirm("Delete this product?")) return;
    this.productSvc.deleteProduct(id)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.products = this.products.filter(p => p._id !== id);
          this.notify.success("Product deleted.");
        },
        error: err => this.notify.error(err.error?.message || "Failed."),
      });
  }

  onPageChange(page: number): void {
    this.filters.page = page;
    this.loadProducts();
  }

  // ─── Helpers ─────────────────────────────────────────────────────────────

  f(name: string) {
    return this.productForm.get(name);
  }
}
