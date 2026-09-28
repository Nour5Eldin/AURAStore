import { Component, OnInit, OnDestroy } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { forkJoin, Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";
import { Store } from "@ngrx/store";
import { ProductService } from "../../services/product.service";
import { Product } from "../../../../core/models/api-response.model";
import { AppState } from "../../../../store/app.state";
import { selectIsLoggedIn } from "../../../../store/auth/auth.selectors";
import { addToCart } from "../../../../store/cart/cart.actions";
import { ReviewService } from "../../../reviews/services/review.service";

@Component({
  selector: "app-product-detail-page",
  standalone: false,
  templateUrl: "./product-detail-page.html",
  styleUrls: ["./product-detail-page.scss"],
})
export class ProductDetailPage implements OnInit, OnDestroy {

  product: Product | null = null;
  relatedProducts: Product[] = [];
  loading = true;
  relatedLoading = true;

  selectedImage = 0;
  quantity = 1;
  isAdding = false;
  addedToCart = false;
  isLoggedIn$!: any;

  reviews: any[] = [];
  ratingSummary: any = null;
  reviewsLoading = false;
  reviewsPage = 1;


  private destroy$ = new Subject<void>();

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private productService: ProductService,
    private store: Store<AppState>,
    private reviewSvc: ReviewService,
  ) { }

  ngOnInit(): void {
    this.isLoggedIn$ = this.store.select(selectIsLoggedIn);
    this.route.paramMap
      .pipe(takeUntil(this.destroy$))
      .subscribe(params => {
        const slug = params.get("slug");
        if (slug) this.loadProduct(slug);
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadProduct(slug: string): void {
    this.loading = true;
    this.selectedImage = 0;
    this.quantity = 1;

    this.productService.getProductBySlug(slug)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: res => {
          this.product = res.data;
          this.loading = false;
          this.loadRelated(slug);
          forkJoin({
            related: this.productService.getRelatedProducts(slug),
            reviews: this.reviewSvc.getProductReviews(res.data._id),
          }).pipe(takeUntil(this.destroy$))
            .subscribe(data => {
              this.relatedProducts = data.related.data;
              this.reviews = data.reviews.data.reviews.data;
              this.ratingSummary = data.reviews.data.summary;
              this.relatedLoading = false;
            })
        },
        error: () => {
          this.router.navigate(["/not-found"]);
        },
      });
  }

  loadRelated(slug: string): void {
    this.relatedLoading = true;
    this.productService.getRelatedProducts(slug)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: res => { this.relatedProducts = res.data; this.relatedLoading = false; },
        error: () => { this.relatedLoading = false; },
      });
  }

  selectImage(index: number): void {
    this.selectedImage = index;
  }

  decreaseQty(): void {
    if (this.quantity > 1) this.quantity--;
  }

  increaseQty(): void {
    if (!this.product) return;
    if (this.quantity < this.product.stock) this.quantity++;
  }

  onAddToCart(): void {
    if (!this.product || this.isOutOfStock) return;

    this.isAdding = true;
    this.store.dispatch(addToCart({
      productId: this.product._id,
      quantity: this.quantity,
    }));

    setTimeout(() => {
      this.isAdding = false;
      this.addedToCart = true;
      setTimeout(() => this.addedToCart = false, 2000);
    }, 800);
  }

  get isOutOfStock(): boolean {
    return (this.product?.stock ?? 0) === 0;
  }

  get isLowStock(): boolean {
    const stock = this.product?.stock ?? 0;
    return stock > 0 && stock <= 3;
  }
}