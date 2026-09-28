import { Component, OnInit, OnDestroy } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";
import { AccountOrderService } from "../../services/order.service";
import { NotificationService } from "../../../../core/services/notification.service";
import { Order, OrderStatus } from "../../../../core/models/api-response.model";

@Component({
  selector: "app-order-detail-page",
  standalone: false,
  templateUrl: "./order-detail-page.html",
  styleUrls: ["./order-detail-page.scss"],
})
export class OrderDetailPage implements OnInit, OnDestroy {

  order: Order | null = null;
  loading = true;
  cancelling = false;
  refundReason = "";
  showRefundForm = false;

  private destroy$ = new Subject<void>();
  timelineSteps: OrderStatus[] = [
  "pending",
  "preparing",
  "shipped",
  "received",
  ] as OrderStatus[];
  
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
    this.loading = true;
    this.orderSvc.getOrderDetail(id)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: res => { this.order = res.data; this.loading = false; },
        error: () => { this.router.navigate(["/account/orders"]); },
      });
  }

  onCancel(): void {
    if (!this.order) return;
    this.cancelling = true;

    this.orderSvc.cancelOrder(this.order._id)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: res => {
          this.order = res.data;
          this.cancelling = false;
          this.notification.success("Order cancelled successfully.");
        },
        error: err => {
          this.cancelling = false;
          this.notification.error(err.error?.message || "Failed to cancel order.");
        },
      });
  }

  onRequestRefund(): void {
    if (!this.order || !this.refundReason.trim()) {
      this.notification.error("Please enter a refund reason.");
      return;
    }

    this.orderSvc.requestRefund(this.order._id, this.refundReason)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: res => {
          this.order = res.data;
          this.showRefundForm = false;
          this.refundReason = "";
          this.notification.success("Refund request submitted.");
        },
        error: err => {
          this.notification.error(err.error?.message || "Failed to submit refund.");
        },
      });
  }

  get canCancel(): boolean {
    return ["pending", "preparing"].includes(this.order?.status || "");
  }

  get canRefund(): boolean {
    return ["received", "shipped"].includes(this.order?.status || "") &&
      !this.order?.refundRequested;
  }

  getStatusColor(status: OrderStatus): string {
    const colors: Record<OrderStatus, string> = {
      pending: "#f59e0b",
      preparing: "#3b82f6",
      shipped: "#0ea5e9",
      received: "#16a34a",
      cancelledByUser: "#dc2626",
      cancelledByAdmin: "#dc2626",
      refused: "#dc2626",
    };
    return colors[status] || "#6b7280";
  }

  getStepStatus(stepStatus: OrderStatus): "done" | "active" | "pending" {
    const flow: OrderStatus[] = ["pending", "preparing", "shipped", "received"];
    const currentIdx = flow.indexOf(this.order?.status as OrderStatus);
    const stepIdx = flow.indexOf(stepStatus);

    if (currentIdx === -1) return "pending";
    if (stepIdx < currentIdx) return "done";
    if (stepIdx === currentIdx) return "active";
    return "pending";
  }
}
