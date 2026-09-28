import { Component, Input } from "@angular/core";

@Component({
  selector: "app-kpi-card",
  standalone: false,
  templateUrl: "./kpi-card.html",
  styleUrls: ["./kpi-card.scss"],
})
export class KpiCard {
  @Input() icon="inventory_2";
  @Input() label = "";
  @Input() value: any = 0;
  @Input() color: "blue" | "green" | "amber" | "red" | "purple" = "blue";
}