import { Component, Input } from "@angular/core";

@Component({
  selector: "app-password-strength",
  standalone: false,
  templateUrl: "./password-strength.html",
  styleUrls: ["./password-strength.scss"],
})
export class PasswordStrength {
  @Input() password = "";

  get strength(): { label: string; width: string; color: string; level: number } {
    const pw = this.password;
    if (!pw.length) return { label: "", width: "0%", color: "#e5e7eb", level: 0 };
    if (pw.length < 6) return { label: "Weak", width: "25%", color: "#dc2626", level: 1 };
    if (pw.length < 8) return { label: "Fair", width: "50%", color: "#f59e0b", level: 2 };
    if (pw.length < 12) return { label: "Good", width: "75%", color: "#0ea5e9", level: 3 };
    return { label: "Strong", width: "100%", color: "#16a34a", level: 4 };
  }
}