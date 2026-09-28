import { Component, Input, Output, EventEmitter } from "@angular/core";
import { OrderStatus } from "../../../../core/models/api-response.model";

@Component({
  selector: "app-status-dropdown",
  standalone: false,
  templateUrl: "./status-dropdown.html",
  styleUrls: ["./status-dropdown.scss"],
})
export class StatusDropdown {
  @Input() current!: OrderStatus;
  @Output() statusChange = new EventEmitter<OrderStatus>();

  open = false;

  allStatuses: { value: OrderStatus; label: string }[] = [
    { value: "pending", label: "Pending" },
    { value: "preparing", label: "Preparing" },
    { value: "shipped", label: "Shipped" },
    { value: "received", label: "Received" },
    { value: "cancelledByAdmin", label: "Cancel (Admin)" },
    { value: "refused", label: "Refused" },
  ];

  select(status: OrderStatus): void {
    this.statusChange.emit(status);
    this.open = false;
  }

  getColor(status: string): string {
    const map: Record<string, string> = {
      pending: "#f59e0b", preparing: "#3b82f6",
      shipped: "#0ea5e9", received: "#16a34a",
      cancelledByAdmin: "#dc2626", refused: "#dc2626",
    };
    return map[status] || "#6b7280";
  }
}
