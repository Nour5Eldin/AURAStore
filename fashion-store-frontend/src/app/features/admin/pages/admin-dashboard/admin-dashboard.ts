import { Component, OnInit, OnDestroy } from "@angular/core";
import { Subject } from "rxjs";
import { takeUntil, timeout } from "rxjs/operators";
import { AdminOrderService } from "../../services/admin-order.service";

@Component({
  selector: "app-admin-dashboard",
  standalone: false,
  templateUrl: "./admin-dashboard.html",
  styleUrls: ["./admin-dashboard.scss"],
})
export class AdminDashboard implements OnInit, OnDestroy {

  kpis: any = null;
  loading = true;
  today = new Date();
  private destroy$ = new Subject<void>();

  constructor(
    private orderSvc: AdminOrderService,
  ) { }

  ngOnInit(): void {
    this.orderSvc.getDashboardKPIs()
      .pipe(
        timeout(15000),
        takeUntil(this.destroy$)
      )
      .subscribe({
        next: res => { this.kpis = res.data; this.loading = false; },
        error: () => { this.loading = false; },
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}