import { Component, Input, Output, EventEmitter, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Address } from "../../../../core/models/api-response.model";

@Component({
  selector: "app-address-form",
  standalone: false,
  templateUrl: "./address-form.html",
  styleUrls: ["./address-form.scss"],
})
export class AddressForm implements OnInit {
  @Input() address: Address | null = null;
  @Output() save = new EventEmitter<any>();
  @Output() cancel = new EventEmitter<void>();

  form!: FormGroup;
  labels = ["home", "work", "other"];

  constructor(private fb: FormBuilder) { }

  ngOnInit(): void {
    this.form = this.fb.group({
      label: [this.address?.label || "home", [Validators.required]],
      addressText: [this.address?.addressText || "",
      [Validators.required, Validators.minLength(10)]],
      isDefault: [this.address?.isDefault || false],
    });
  }

  onSubmit(): void {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    this.save.emit(this.form.value);
  }

  f(n: string) { return this.form.get(n); }
}