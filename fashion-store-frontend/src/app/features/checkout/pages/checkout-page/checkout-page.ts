import { Component, OnInit, OnDestroy } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { Subject } from "rxjs";
import { forkJoin } from "rxjs";
import { takeUntil, finalize } from "rxjs/operators";
import { CheckoutService } from "../../services/checkout.Service";
import { NotificationService } from "../../../../core/services/notification.service";
import { Address, CartItem, CartResponse, } from "../../../../core/models/api-response.model";

type CheckoutStep = "address" | "review" | "done";

@Component({
  selector: "app-checkout-page",
  standalone: false,
  templateUrl: "./checkout-page.html",
  styleUrls: ["./checkout-page.scss"],
})
export class CheckoutPage implements OnInit, OnDestroy {

  step: CheckoutStep = "address";
  loading = false;
  addresses: Address[] = [];
  cartData: CartResponse | null = null;
  orderId = "";

  form!: FormGroup;

  private destroy$ = new Subject<void>();

  constructor(
    private fb: FormBuilder,
    private checkout: CheckoutService,
    private notification: NotificationService,
    private router: Router,
  ) { }

  ngOnInit(): void {
    this.form = this.fb.group({
      addressId: ["", [Validators.required]],
      phoneNumber: ["", [
        Validators.required,
        Validators.pattern(/^\+[1-9]\d{6,14}$/),
      ]],
      newAddress: [""],
    });

    this.loadData();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadData(): void {
    this.loading = true;

    forkJoin({
      addresses: this.checkout.getAddresses(),
      cart: this.checkout.getCart(),
    })
      .pipe(
        takeUntil(this.destroy$),
        finalize(() => { this.loading = false; })
      )
      .subscribe({
        next: ({ addresses, cart }) => {
          this.addresses = addresses?.data || [];
          this.cartData = cart?.data || null;

          // Pre-select default address
          const defaultAddr = this.addresses.find(a => a.isDefault);
          if (defaultAddr) {
            this.form.patchValue({ addressId: defaultAddr._id });
          }

          // Redirect if cart is empty
          if (!this.cartData?.activeItems?.length) {
            this.notification.warning("Your cart is empty.");
            this.router.navigate(["/cart"]);
          }
        },
        error: () => {
          this.notification.error("Failed to load checkout data. Please try again.");
        },
      });
  }

  selectAddress(id: string): void {
    this.form.patchValue({ addressId: id });
  }

  goToReview(): void {
    if (this.form.get("addressId")?.invalid || this.form.get("phoneNumber")?.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.step = "review";
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  placeOrder(): void {
    this.loading = true;

    this.checkout.placeOrder({
      addressId: this.form.value.addressId,
      phoneNumber: this.form.value.phoneNumber,
    }).pipe(
      takeUntil(this.destroy$),
      finalize(() => { this.loading = false; })
    )
      .subscribe({
        next: res => {
          this.orderId = res.data._id;
          this.step = "done";
          this.notification.success("Order placed successfully!");
          window.scrollTo({ top: 0, behavior: "smooth" });
        },
        error: err => {
          this.notification.error(err.error?.message || "Failed to place order.");
        },
      });
  }

  get selectedAddress(): Address | undefined {
    return this.addresses.find(a => a._id === this.form.value.addressId);
  }

  get activeItems(): CartItem[] {
    return this.cartData?.activeItems || [];
  }

  get subtotal(): number {
    return this.cartData?.subtotal || 0;
  }

  f(name: string) { return this.form.get(name); }
}