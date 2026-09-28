import { Component, OnInit, OnDestroy } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";
import { AccountAddressService } from "../../services/address.service";
import { NotificationService } from "../../../../core/services/notification.service";
import { Address } from "../../../../core/models/api-response.model";

@Component({
  selector: "app-address-management-page",
  standalone: false,
  templateUrl: "./address-management-page.html",
  styleUrls: ["./address-management-page.scss"],
})
export class AddressManagementPage implements OnInit, OnDestroy {

  addresses: Address[] = [];
  loading = true;
  showForm = false;
  editingId: string | null = null;
  form!: FormGroup;

  labels = ["home", "work", "other"];

  private destroy$ = new Subject<void>();

  constructor(
    private fb: FormBuilder,
    private addressSvc: AccountAddressService,
    private notification: NotificationService,
  ) { }

  ngOnInit(): void {
    this.initForm();
    this.loadAddresses();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  initForm(address?: Address): void {
    this.form = this.fb.group({
      label: [address?.label || "home", [Validators.required]],
      addressText: [address?.addressText || "", [Validators.required, Validators.minLength(10)]],
      isDefault: [address?.isDefault || false],
    });
  }

  loadAddresses(): void {
    this.loading = true;
    this.addressSvc.getAddresses()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: res => { this.addresses = res.data; this.loading = false; },
        error: () => { this.loading = false; },
      });
  }

  openAddForm(): void {
    this.editingId = null;
    this.initForm();
    this.showForm = true;
  }

  openEditForm(address: Address): void {
    this.editingId = address._id;
    this.initForm(address);
    this.showForm = true;
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const action = this.editingId
      ? this.addressSvc.updateAddress(this.editingId, this.form.value)
      : this.addressSvc.createAddress(this.form.value);

    action.pipe(takeUntil(this.destroy$)).subscribe({
      next: () => {
        this.showForm = false;
        this.editingId = null;
        this.notification.success(this.editingId ? "Address updated." : "Address added.");
        this.loadAddresses();
      },
      error: err => {
        this.notification.error(err.error?.message || "Failed to save address.");
      },
    });
  }

  onDelete(id: string): void {
    this.addressSvc.deleteAddress(id)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.notification.info("Address deleted.");
          this.loadAddresses();
        },
        error: err => {
          this.notification.error(err.error?.message || "Failed to delete.");
        },
      });
  }

  onSetDefault(id: string): void {
    this.addressSvc.setDefault(id)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.notification.success("Default address updated.");
          this.loadAddresses();
        },
      });
  }

  f(name: string) { return this.form.get(name); }
}