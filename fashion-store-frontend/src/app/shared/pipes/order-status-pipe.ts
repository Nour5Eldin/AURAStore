import { Pipe, PipeTransform } from "@angular/core";
import { OrderStatus } from "../../core/models/api-response.model";

@Pipe({ name: "orderStatus", standalone: false })
export class OrderStatusPipe implements PipeTransform {
  private labels: Record<OrderStatus, string> = {
    pending: "Pending",
    preparing: "Preparing",
    shipped: "Shipped",
    cancelledByUser: "Cancelled",
    cancelledByAdmin: "Cancelled",
    refused: "Refused",
    received: "Delivered",
  };

  transform(value: OrderStatus): string {
    return this.labels[value] || value;
  }
}