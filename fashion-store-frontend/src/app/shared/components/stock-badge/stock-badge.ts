import { Component, Input } from "@angular/core";

@Component({
  selector: "app-stock-badge",
  standalone: false,
  templateUrl: "./stock-badge.html",
  styleUrls: ["./stock-badge.scss"],
})
export class StockBadge {
  @Input() stock = 0;
}
