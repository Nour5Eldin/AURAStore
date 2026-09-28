import { Component, OnInit, OnDestroy } from "@angular/core";
import { Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";
import { AdminReviewService } from "../../services/admin-review.service";
import { Review, PaginatedResponse } from "../../../../core/models/api-response.model";

@Component({
  selector: "app-review-analytics",
  standalone: false,
  templateUrl: "./review-analytics.html",
  styleUrls: ["./review-analytics.scss"],
})
export class ReviewAnalytics implements OnInit, OnDestroy {

  reviews: Review[] = [];
  pagination: Partial<PaginatedResponse<Review>> = {};
  loading = true;
  filterStar = 0;
  filterApproved = "";
  page = 1;

  private destroy$ = new Subject<void>();

  constructor(private reviewSvc: AdminReviewService) { }

  ngOnInit(): void { this.load(); }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  load(): void {
    this.loading = true;
    const opts: any = { page: this.page, limit: 20 };
    if (this.filterStar) opts.stars = this.filterStar;
    if (this.filterApproved) opts.isApproved = this.filterApproved === "true";

    this.reviewSvc.getReviews(opts)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: res => {
          this.reviews = res.data.data;
          this.pagination = res.data;
          this.loading = false;
        },
        error: () => { this.loading = false; },
      });
  }

  onToggle(event: { id: string; isApproved: boolean }): void {
    this.reviewSvc.toggleApproval(event.id, event.isApproved)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: res => {
          this.reviews = this.reviews.map(r =>
            r._id === event.id ? res.data : r
          );
        },
      });
  }

  get ratingBreakdown(): { star: number; count: number; pct: number }[] {
    const total = this.reviews.length;
    return [5, 4, 3, 2, 1].map(star => {
      const count = this.reviews.filter(r => r.stars === star).length;
      return { star, count, pct: total ? Math.round((count / total) * 100) : 0 };
    });
  }

  get avgRating(): number {
    if (!this.reviews.length) return 0;
    return +(this.reviews.reduce((s, r) => s + r.stars, 0) / this.reviews.length).toFixed(1);
  }
}
