import { Component, Input, Output, EventEmitter } from "@angular/core";

@Component({
  selector: "app-empty-state",
  standalone: false,
  templateUrl: "./empty-state.html",
  styleUrls: ["./empty-state.scss"],
})
export class EmptyState {
  @Input() icon = "";
  @Input() title = "Nothing here yet";
  @Input() message = "";
  @Input() btnText = "";
  @Input() btnLink = "";
  @Output() btnClick = new EventEmitter<void>();
}