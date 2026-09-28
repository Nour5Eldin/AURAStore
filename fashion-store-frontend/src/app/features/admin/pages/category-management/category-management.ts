import { Component, OnInit, OnDestroy } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Subject, forkJoin } from "rxjs";
import { takeUntil } from "rxjs/operators";
import { AdminCategoryService } from "../../services/admin-category.service";
import { AdminCacheService } from "../../services/admin-cache.service";
import { NotificationService } from "../../../../core/services/notification.service";
import { Category, Subcategory } from "../../../../core/models/api-response.model";

@Component({
  selector: "app-category-management",
  standalone: false,
  templateUrl: "./category-management.html",
  styleUrls: ["./category-management.scss"],
})
export class CategoryManagement implements OnInit, OnDestroy {

  categories: Category[] = [];
  subcategories: Subcategory[] = [];
  loading = true;
  catForm!: FormGroup;
  subForm!: FormGroup;
  editingCatId: string | null = null;
  editingSubId: string | null = null;
  showCatForm = false;
  showSubForm = false;
  selectedCatId = "";

  private destroy$ = new Subject<void>();

  constructor(
    private fb: FormBuilder,
    private categorySvc: AdminCategoryService,
    private cache: AdminCacheService,
    private notify: NotificationService,
  ) { }

  ngOnInit(): void {
    this.initForms();
    this.loadCategories();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  initForms(): void {
    this.catForm = this.fb.group({
      title: ["", [Validators.required, Validators.minLength(2)]],
      isActive: [true],
    });

    this.subForm = this.fb.group({
      title: ["", [Validators.required, Validators.minLength(2)]],
      categoryId: ["", [Validators.required]],
      isActive: [true],
    });
  }

  loadCategories(): void {
    this.loading = true;
    // Load both in parallel using the shared cache (single HTTP call each)
    forkJoin([
      this.cache.getCategories(),
      this.cache.getSubcategories(),
    ]).pipe(takeUntil(this.destroy$)).subscribe({
      next: ([cats, subs]) => {
        this.categories   = cats;
        this.subcategories = subs;
        this.loading = false;
      },
      error: () => { this.loading = false; },
    });
  }

  loadSubcategories(): void {
    this.cache.getSubcategories()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: subs => { this.subcategories = subs; },
        error: () => { this.subcategories = []; },
      });
  }

  // ─── Category CRUD ────────────────────────────────────────────────────────

  onSaveCategory(): void {
    if (this.catForm.invalid) { this.catForm.markAllAsTouched(); return; }

    const action = this.editingCatId
      ? this.categorySvc.updateCategory(this.editingCatId, this.catForm.value)
      : this.categorySvc.createCategory(this.catForm.value);

    action.pipe(takeUntil(this.destroy$)).subscribe({
      next: () => {
        this.notify.success(this.editingCatId ? "Category updated." : "Category created.");
        this.showCatForm = false;
        this.editingCatId = null;
        this.catForm.reset({ isActive: true });
        this.cache.invalidate("categories");  // clear cache → fresh fetch
        this.loadCategories();
      },
      error: err => this.notify.error(err.error?.message || "Failed."),
    });
  }

  onToggleCat(cat: Category): void {
    this.categorySvc.toggleCategory(cat._id, !cat.isActive)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: res => {
          this.categories = this.categories.map(c =>
            c._id === cat._id ? res.data : c
          );
          this.notify.success(`Category ${res.data.isActive ? "activated" : "deactivated"}.`);
        },
      });
  }

  onDeleteCat(id: string): void {
    if (!confirm("Delete this category? All subcategories will be affected.")) return;
    this.categorySvc.deleteCategory(id)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.categories = this.categories.filter(c => c._id !== id);
          this.cache.invalidate("all");
          this.notify.success("Category deleted.");
        },
        error: err => this.notify.error(err.error?.message || "Failed."),
      });
  }

  // ─── Subcategory CRUD ────────────────────────────────────────────────────

  onSaveSubcategory(): void {
    if (this.subForm.invalid) { this.subForm.markAllAsTouched(); return; }

    const action = this.editingSubId
      ? this.categorySvc.updateSubcategory(this.editingSubId, this.subForm.value)
      : this.categorySvc.createSubcategory(this.subForm.value);

    action.pipe(takeUntil(this.destroy$)).subscribe({
      next: () => {
        this.notify.success("Subcategory saved.");
        this.showSubForm = false;
        this.editingSubId = null;
        this.subForm.reset({ isActive: true });
        this.cache.invalidate("subcategories");  // clear subcategory cache
        this.loadSubcategories();
      },
      error: err => this.notify.error(err.error?.message || "Failed."),
    });
  }

  onDeleteSub(id: string): void {
    if (!confirm("Delete this subcategory?")) return;
    this.categorySvc.deleteSubcategory(id)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.subcategories = this.subcategories.filter(s => s._id !== id);
          this.cache.invalidate("subcategories");
          this.notify.success("Subcategory deleted.");
        },
        error: err => this.notify.error(err.error?.message || "Failed."),
      });
  }

  getCategoryName(categoryId: string): string {
    const cat = this.categories.find(c => c._id === categoryId);
    return cat?.title || categoryId;
  }
}
