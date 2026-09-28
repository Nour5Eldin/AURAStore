import { Component, Input } from "@angular/core";
import { OrderStatus } from "../../../../core/models/api-response.model";

@Component({
  selector: "app-order-status-badge",
  standalone: false,
  template: `
    <span class="osb"
          [style.color]="color"
          [style.background]="color + '18'">
      {{ status | orderStatus }}
    </span>
  `,
  styleUrls: ["./order-status-badge.scss"],
})
export class OrderStatusBadge {
  @Input() status!: OrderStatus;

  get color(): string {
    const map: Record<OrderStatus, string> = {
      pending: "#f59e0b",
      preparing: "#3b82f6",
      shipped: "#0ea5e9",
      received: "#16a34a",
      cancelledByUser: "#dc2626",
      cancelledByAdmin: "#dc2626",
      refused: "#dc2626",
    };
    return map[this.status] || "#6b7280";
  }
}
