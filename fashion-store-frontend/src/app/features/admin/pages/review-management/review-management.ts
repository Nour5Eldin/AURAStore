import { Component, OnInit, OnDestroy } from "@angular/core";
import { Subject } from "rxjs";
import { takeUntil, timeout } from "rxjs/operators";
import { AdminReviewService } from "../../services/admin-review.service";
import { NotificationService } from "../../../../core/services/notification.service";
import { Review, PaginatedResponse } from "../../../../core/models/api-response.model";

@Component({
  selector: "app-review-management",
  standalone: false,
  templateUrl: "./review-management.html",
  styleUrls: ["./review-management.scss"],
})
export class ReviewManagement implements OnInit, OnDestroy {

  reviews: Review[] = [];
  pagination: Partial<PaginatedResponse<Review>> = {};
  loading = true;
  page = 1;

  private destroy$ = new Subject<void>();

  constructor(
    private reviewSvc: AdminReviewService,
    private notify: NotificationService,
  ) { }

  ngOnInit(): void { this.load(); }
  ngOnDestroy(): void { this.destroy$.next(); this.destroy$.complete(); }

  load(): void {
    this.loading = true;
    this.reviewSvc.getReviews({ page: this.page, limit: 20 })
      .pipe(timeout(15000), takeUntil(this.destroy$))
      .subscribe({
        next: res => {
          this.reviews = res.data?.data ?? [];
          this.pagination = res.data ?? {};
          this.loading = false;
        },
        error: () => { this.reviews = []; this.loading = false; },
      });
  }

  onToggle(event: { id: string; isApproved: boolean }): void {
    this.reviewSvc.toggleApproval(event.id, event.isApproved)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: res => {
          this.reviews = this.reviews.map(r => r._id === event.id ? res.data : r);
          this.notify.success(`Review ${event.isApproved ? "approved" : "hidden"}.`);
        },
        error: err => this.notify.error(err.error?.message || "Failed."),
      });
  }
}
