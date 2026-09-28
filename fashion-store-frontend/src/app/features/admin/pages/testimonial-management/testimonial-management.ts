import { Component, OnInit, OnDestroy } from "@angular/core";
import { Subject } from "rxjs";
import { takeUntil, timeout } from "rxjs/operators";
import { AdminTestimonialService } from "../../services/admin-testimonial.service";
import { NotificationService } from "../../../../core/services/notification.service";
import { Testimonial, PaginatedResponse } from "../../../../core/models/api-response.model";

@Component({
  selector: "app-testimonial-management",
  standalone: false,
  templateUrl: "./testimonial-management.html",
  styleUrls: ["./testimonial-management.scss"],
})
export class TestimonialManagement implements OnInit, OnDestroy {

  testimonials: Testimonial[] = [];
  pagination: Partial<PaginatedResponse<Testimonial>> = {};
  loading = true;
  filterStatus = "";
  page = 1;

  private destroy$ = new Subject<void>();

  constructor(
    private testimonialSvc: AdminTestimonialService,
    private notify: NotificationService,
  ) { }

  ngOnInit(): void { this.load(); }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  load(): void {
    this.loading = true;
    const opts: any = { page: this.page, limit: 15 };
    if (this.filterStatus) opts.status = this.filterStatus;

    this.testimonialSvc.getTestimonials(opts)
      .pipe(timeout(15000), takeUntil(this.destroy$))
      .subscribe({
        next: res => {
          this.testimonials = res.data?.data ?? [];
          this.pagination = res.data ?? {};
          this.loading = false;
        },
        error: () => { this.testimonials = []; this.loading = false; },
      });
  }

  onUpdateStatus(id: string, status: "approved" | "refused"): void {
    this.testimonialSvc.updateStatus(id, status)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: res => {
          this.testimonials = this.testimonials.map(t =>
            t._id === id ? res.data : t
          );
          this.notify.success(`Testimonial ${status}.`);
        },
        error: err => this.notify.error(err.error?.message || "Failed."),
      });
  }

  getStars(n: number): number[] { return Array(n).fill(0); }

  getUserName(t: Testimonial): string {
    return (t.userId as any)?.name || "Anonymous";
  }
}