import { Component, Input, Output, EventEmitter } from "@angular/core";

@Component({
  selector: "app-pagination",
  standalone: false,
  templateUrl: "./pagination.html",
  styleUrls: ["./pagination.scss"],
})
export class Pagination {
  @Input() currentPage = 1;
  @Input() totalPages = 1;
  @Input() totalItems = 0;
  @Input() limit = 20;
  @Output() pageChange = new EventEmitter<number>();

  get pages(): number[] {
    const pages: number[] = [];
    const start = Math.max(1, this.currentPage - 2);
    const end = Math.min(this.totalPages, start + 4);
    for (let i = start; i <= end; i++) pages.push(i);
    return pages;
  }

  goTo(page: number): void {
    if (page >= 1 && page <= this.totalPages && page !== this.currentPage) {
      this.pageChange.emit(page);
    }
  }

  get showingFrom(): number {
    return (this.currentPage - 1) * this.limit + 1;
  }

  get showingTo(): number {
    return Math.min(this.currentPage * this.limit, this.totalItems);
  }
}