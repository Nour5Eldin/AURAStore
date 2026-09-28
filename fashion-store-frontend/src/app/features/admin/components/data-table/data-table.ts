import { Component, Input, Output, EventEmitter } from "@angular/core";

export interface TableColumn {
  key: string;
  label: string;
  sortable?: boolean;
  width?: string;
}

@Component({
  selector: "app-data-table",
  standalone: false,
  templateUrl: "./data-table.html",
  styleUrls: ["./data-table.scss"],
})
export class DataTable {
  @Input() columns: TableColumn[] = [];
  @Input() rows: any[] = [];
  @Input() loading = false;
  @Input() emptyIcon="assignment";
  @Input() emptyMessage = "No data found";
  @Output() rowClick = new EventEmitter<any>();
  @Output() sort = new EventEmitter<{ key: string; dir: "asc" | "desc" }>();

  sortKey = "";
  sortDir: "asc" | "desc" = "asc";

  onSort(col: TableColumn): void {
    if (!col.sortable) return;
    if (this.sortKey === col.key) {
      this.sortDir = this.sortDir === "asc" ? "desc" : "asc";
    } else {
      this.sortKey = col.key;
      this.sortDir = "asc";
    }
    this.sort.emit({ key: this.sortKey, dir: this.sortDir });
  }

  getValue(row: any, key: string): any {
    return key.split(".").reduce((obj, k) => obj?.[k], row);
  }
}