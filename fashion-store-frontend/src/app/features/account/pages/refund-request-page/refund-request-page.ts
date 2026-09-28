import { Component, OnInit, OnDestroy } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";
import { AccountOrderService } from "../../services/order.service";
import { NotificationService } from "../../../../core/services/notification.service";
import { Order } from "../../../../core/models/api-response.model";

@Component({
  selector: "app-refund-request-page",
  standalone: false,
  templateUrl: "./refund-request-page.html",
  styleUrls: ["./refund-request-page.scss"],
})
export class RefundRequestPage implements OnInit, OnDestroy {

  order: Order | null = null;
  reason = "";
  loading = false;
  orderLoading = true;

  private destroy$ = new Subject<void>();

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private orderSvc: AccountOrderService,
    private notification: NotificationService,
  ) { }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get("id");
    if (id) this.loadOrder(id);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadOrder(id: string): void {
    this.orderSvc.getOrderDetail(id)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: res => {
          this.order = res.data;
          this.orderLoading = false;

          // Guard — already requested
          if (this.order.refundRequested) {
            this.notification.info("Refund already requested for this order.");
            this.router.navigate(["/account/orders", id]);
          }
        },
        error: () => this.router.navigate(["/account/orders"]),
      });
  }

  onSubmit(): void {
    if (!this.reason.trim() || this.reason.trim().length < 20) {
      this.notification.error("Reason must be at least 20 characters.");
      return;
    }

    this.loading = true;
    this.orderSvc.requestRefund(this.order!._id, this.reason)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.notification.success("Refund request submitted successfully.");
          this.router.navigate(["/account/orders", this.order!._id]);
        },
        error: err => {
          this.loading = false;
          this.notification.error(err.error?.message || "Failed to submit refund.");
        },
      });
  }

  get charCount(): number { return this.reason.length; }
  get isValid(): boolean { return this.reason.trim().length >= 20; }
}