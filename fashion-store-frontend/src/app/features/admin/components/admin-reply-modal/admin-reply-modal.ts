import { Component, Input, Output, EventEmitter } from "@angular/core";

@Component({
  selector: "app-admin-reply-modal",
  standalone: false,
  templateUrl: "./admin-reply-modal.html",
  styleUrls: ["./admin-reply-modal.scss"],
})
export class AdminReplyModal {
  @Input() title = "Reply";
  @Input() subtitle = "";
  @Input() visible = false;
  @Output() confirm = new EventEmitter<string>();
  @Output() close = new EventEmitter<void>();

  message = "";

  onConfirm(): void {
    if (!this.message.trim()) return;
    this.confirm.emit(this.message);
    this.message = "";
  }

  onClose(): void {
    this.message = "";
    this.close.emit();
  }
}
