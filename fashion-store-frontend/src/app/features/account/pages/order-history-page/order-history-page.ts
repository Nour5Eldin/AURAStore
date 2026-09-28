import { Component, OnInit, OnDestroy } from "@angular/core";
import { Router } from "@angular/router";
import { Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";
import { AccountOrderService } from "../../services/order.service";
import {
  Order, OrderStatus,
  PaginatedResponse,
} from "../../../../core/models/api-response.model";

@Component({
  selector: "app-order-history-page",
  standalone: false,
  templateUrl: "./order-history-page.html",
  styleUrls: ["./order-history-page.scss"],
})
export class OrderHistoryPage implements OnInit, OnDestroy {

  orders: Order[] = [];
  pagination: Partial<PaginatedResponse<Order>> = {};
  loading = true;
  currentPage = 1;
  filterStatus: OrderStatus | "" = "";

  statusOptions = [
    { value: "", label: "All Orders" },
    { value: "pending", label: "Pending" },
    { value: "preparing", label: "Preparing" },
    { value: "shipped", label: "Shipped" },
    { value: "received", label: "Delivered" },
    { value: "cancelledByUser", label: "Cancelled" },
    { value: "refused", label: "Refused" },
  ];

  private destroy$ = new Subject<void>();

  constructor(
    private orderSvc: AccountOrderService,
    private router: Router,
  ) { }

  ngOnInit(): void { this.load(); }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  load(): void {
    this.loading = true;
    const opts: any = { page: this.currentPage, limit: 10 };
    if (this.filterStatus) opts.status = this.filterStatus;

    this.orderSvc.getUserOrders(opts)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: res => {
          this.orders = res.data.data;
          this.pagination = res.data;
          this.loading = false;
        },
        error: () => { this.loading = false; },
      });
  }

  onStatusFilter(status: string): void {
    this.filterStatus = status as OrderStatus | "";
    this.currentPage = 1;
    this.load();
  }

  onPageChange(page: number): void {
    this.currentPage = page;
    this.load();
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  viewOrder(id: string): void {
    this.router.navigate(["/account/orders", id]);
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
}