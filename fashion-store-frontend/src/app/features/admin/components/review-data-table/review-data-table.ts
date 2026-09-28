import { Component, Input, Output, EventEmitter, NgModule, NgModuleRef } from "@angular/core";
import { Review } from "../../../../core/models/api-response.model";

@Component({
  selector: "app-review-data-table",
  standalone: false,
  templateUrl: "./review-data-table.html",
  styleUrls: ["./review-data-table.scss"],
})
export class ReviewDataTable {
  @Input() reviews: Review[] = [];
  @Input() loading = false;
  @Output() toggle = new EventEmitter<{ id: string; isApproved: boolean }>();

  getStars(n: number): number[] { return Array(n).fill(0); }

  getUserName(r: Review): string {
    return (r.userId as any)?.name || "Anonymous";
  }

  getProductName(r: Review): string {
    return (r as any)?.product?.name || "—";
  }
}