import { Component, OnInit, OnDestroy } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Subject } from "rxjs";
import { takeUntil, timeout } from "rxjs/operators";
import { AdminReportsService, SalesReport } from "../../services/admin-reports.service";
import { ChartDataPoint } from "../../components/report-chart/report-chart";

@Component({
  selector: "app-sales-reports",
  standalone: false,
  templateUrl: "./sales-reports.html",
  styleUrls: ["./sales-reports.scss"],
})
export class SalesReports implements OnInit, OnDestroy {

  report: SalesReport | null = null;
  loading = false;
  form!: FormGroup;
  chartData: ChartDataPoint[] = [];

  private destroy$ = new Subject<void>();

  constructor(
    private fb: FormBuilder,
    private reportsSvc: AdminReportsService,
  ) { }

  ngOnInit(): void {
    // Default: current month
    const now = new Date();
    const start = new Date(now.getFullYear(), now.getMonth(), 1);

    this.form = this.fb.group({
      startDate: [this.formatDate(start), [Validators.required]],
      endDate: [this.formatDate(now), [Validators.required]],
    });

    this.onFetch();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  onFetch(): void {
    if (this.form.invalid) return;
    const { startDate, endDate } = this.form.value;

    this.loading = true;
    this.reportsSvc.getSalesReport(startDate, endDate)
      .pipe(timeout(15000), takeUntil(this.destroy$))
      .subscribe({
        next: res => {
          this.report = res.data;
          this.loading = false;
          this.buildChart();
        },
        error: () => { this.loading = false; },
      });
  }

  buildChart(): void {
    if (!this.report) return;
    this.chartData = this.report.topProducts.map(p => ({
      label: p.name.slice(0, 12),
      value: p.totalSold,
    }));
  }

  formatDate(d: Date): string {
    return d.toISOString().split("T")[0];
  }
}
