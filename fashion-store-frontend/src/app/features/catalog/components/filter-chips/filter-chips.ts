import { Component, Input, Output, EventEmitter } from "@angular/core";

export interface FilterChip {
  key: string;
  label: string;
  value: any;
}

@Component({
  selector: "app-filter-chips",
  standalone: false,
  templateUrl: "./filter-chips.html",
  styleUrls: ["./filter-chips.scss"],
})
export class FilterChips {
  @Input() chips: FilterChip[] = [];
  @Output() remove = new EventEmitter<FilterChip>();
  @Output() clearAll = new EventEmitter<void>();
}