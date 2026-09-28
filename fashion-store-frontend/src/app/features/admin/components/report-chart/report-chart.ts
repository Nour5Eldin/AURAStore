import { Component, Input, OnChanges } from "@angular/core";

export interface ChartDataPoint {
  label: string;
  value: number;
}

@Component({
  selector: "app-report-chart",
  standalone: false,
  templateUrl: "./report-chart.html",
  styleUrls: ["./report-chart.scss"],
})
export class ReportChart implements OnChanges {
  @Input() data: ChartDataPoint[] = [];
  @Input() title = "Chart";
  @Input() color = "#1E3A8A";
  @Input() prefix = "EGP";

  maxValue = 0;
  bars: { label: string; value: number; height: string; formatted: string }[] = [];

  ngOnChanges(): void {
    this.maxValue = Math.max(...this.data.map(d => d.value), 1);
    this.bars = this.data.map(d => ({
      label: d.label,
      value: d.value,
      height: `${Math.max((d.value / this.maxValue) * 100, 2)}%`,
      formatted: `${this.prefix} ${d.value.toLocaleString()}`,
    }));
  }
}