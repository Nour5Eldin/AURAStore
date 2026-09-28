import { Component, Input, Output, EventEmitter } from "@angular/core";
import { Product } from "../../../../core/models/api-response.model";

@Component({
  selector: "app-product-grid",
  standalone: false,
  templateUrl: "./product-grid.html",
  styleUrls: ["./product-grid.scss"],
})
export class ProductGrid {
  @Input() products: Product[] = [];
  @Input() loading = false;
  @Input() skeletonCount = 12;
  @Output() quickAdd = new EventEmitter<Product>();

  get skeletons(): number[] {
    return Array(this.skeletonCount).fill(0);
  }

  trackBy(_: number, p: Product): string { return p._id; }
}
