import { Component, Input } from "@angular/core";

@Component({
  selector: "app-skeleton-loader",
  standalone: false,
  templateUrl: "./skeleton-loader.html",
  styleUrls: ["./skeleton-loader.scss"],
})
export class SkeletonLoader {
  @Input() type:   "product-card" | "text" | "avatar" | "banner" = "text";
  @Input() width  = "100%";
  @Input() height = "20px";
}