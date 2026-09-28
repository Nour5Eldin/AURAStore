import { Component, OnInit, OnDestroy } from "@angular/core";
import { Subject } from "rxjs";
import { takeUntil, timeout } from "rxjs/operators";
import { AdminOrderService } from "../../services/admin-order.service";
import { NotificationService } from "../../../../core/services/notification.service";
import { Order, OrderStatus, PaginatedResponse } from "../../../../core/models/api-response.model";

@Component({
  selector: "app-order-management",
  standalone: false,
  templateUrl: "./order-management.html",
  styleUrls: ["./order-management.scss"],
})
export class OrderManagement implements OnInit, OnDestroy {

  orders: Order[] = [];
  pagination: Partial<PaginatedResponse<Order>> = {};
  loading = true;
  selectedOrder: Order | null = null;

  filters = { page: 1, status: "", search: "" };

  statusOptions = [
    { value: "", label: "All Orders" },
    { value: "pending", label: "Pending" },
    { value: "preparing", label: "Preparing" },
    { value: "shipped", label: "Shipped" },
    { value: "received", label: "Received" },
    { value: "cancelledByUser", label: "Cancelled" },
    { value: "refused", label: "Refused" },
  ];

  nextStatusMap: Record<string, OrderStatus> = {
    pending: "preparing",
    preparing: "shipped",
    shipped: "received",
  };

  private destroy$ = new Subject<void>();

  constructor(
    private orderSvc: AdminOrderService,
    private notify: NotificationService,
  ) { }

  ngOnInit(): void { this.load(); }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  load(): void {
    this.loading = true;
    const opts: any = { page: this.filters.page, limit: 15 };
    if (this.filters.status) opts.status = this.filters.status;
    if (this.filters.search) opts.search = this.filters.search;

    this.orderSvc.getOrders(opts)
      .pipe(timeout(15000), takeUntil(this.destroy$))
      .subscribe({
        next: res => {
          this.orders = res.data?.data ?? [];
          this.pagination = res.data ?? {};
          this.loading = false;
        },
        error: () => { this.orders = []; this.loading = false; },
      });
  }

  advanceStatus(order: Order): void {
    const next = this.nextStatusMap[order.status];
    if (!next) return;

    this.orderSvc.updateStatus(order._id, next)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: res => {
          this.orders = this.orders.map(o => o._id === order._id ? res.data : o);
          if (this.selectedOrder?._id === order._id) this.selectedOrder = res.data;
          this.notify.success(`Order moved to ${next}.`);
        },
        error: err => this.notify.error(err.error?.message || "Failed."),
      });
  }

  handleRefund(order: Order, decision: "approved" | "refused"): void {
    this.orderSvc.handleRefund(order._id, decision)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: res => {
          this.orders = this.orders.map(o => o._id === order._id ? res.data : o);
          if (this.selectedOrder?._id === order._id) this.selectedOrder = res.data;
          this.notify.success(`Refund ${decision}.`);
        },
        error: err => this.notify.error(err.error?.message || "Failed."),
      });
  }

  onPageChange(page: number): void {
    this.filters.page = page;
    this.load();
  }

  getStatusColor(status: string): string {
    const map: Record<string, string> = {
      pending: "#f59e0b", preparing: "#3b82f6",
      shipped: "#0ea5e9", received: "#16a34a",
      cancelledByUser: "#dc2626", cancelledByAdmin: "#dc2626",
      refused: "#dc2626",
    };
    return map[status] || "#6b7280";
  }
}