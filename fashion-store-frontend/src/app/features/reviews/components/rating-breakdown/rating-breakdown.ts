import { Component, Input, OnChanges } from '@angular/core';
import { RatingSummary } from '../../../../core/models/api-response.model';

interface BreakdownRow {
  star: number;
  count: number;
  pct: number;
}

@Component({
  selector: 'app-rating-breakdown',
  standalone: false,
  templateUrl: './rating-breakdown.html',
  styleUrl: './rating-breakdown.scss',
})
export class RatingBreakdown implements OnChanges {
  @Input() summary: RatingSummary | null = null;

  rows: BreakdownRow[] = [];

  ngOnChanges(): void {
    if (!this.summary) { this.rows = []; return; }
    const total = this.summary.total || 1;
    this.rows = [5, 4, 3, 2, 1].map(star => {
      const count = this.summary!.breakdown[star] ?? 0;
      return { star, count, pct: Math.round((count / total) * 100) };
    });
  }

  get averageRounded(): string {
    return (this.summary?.average ?? 0).toFixed(1);
  }
}
