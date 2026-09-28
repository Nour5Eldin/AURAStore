import { Component, OnInit, OnDestroy } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Store } from "@ngrx/store";
import { Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";
import { AppState } from "../../../../store/app.state";
import { selectUser } from "../../../../store/auth/auth.selectors";
import { updateProfileSuccess } from "../../../../store/auth/auth.actions";
import { ProfileService } from "../../services/profile.service";
import { NotificationService } from "../../../../core/services/notification.service";
import { User } from "../../../../core/models/api-response.model";

@Component({
  selector: "app-profile-page",
  standalone: false,
  templateUrl: "./profile-page.html",
  styleUrls: ["./profile-page.scss"],
})
export class ProfilePage implements OnInit, OnDestroy {

  user: User | null = null;
  profileForm!: FormGroup;
  passwordForm!: FormGroup;
  editMode = false;
  loading = false;
  pwLoading = false;
  showCurrent = false;
  showNew = false;
  showConfirm = false;
  avatarLoading = false;

  private destroy$ = new Subject<void>();

  constructor(
    private fb: FormBuilder,
    private store: Store<AppState>,
    private profileSvc: ProfileService,
    private notification: NotificationService,
  ) { }

  ngOnInit(): void {
    this.store.select(selectUser)
      .pipe(takeUntil(this.destroy$))
      .subscribe(user => {
        this.user = user;
        if (user) this.initForms(user);
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  initForms(user: User): void {
    this.profileForm = this.fb.group({
      name: [user.name, [Validators.required, Validators.minLength(2)]],
      gender: [user.gender, [Validators.required]],
      emailConsent: [user.emailConsent],
    });

    this.passwordForm = this.fb.group({
      currentPassword: ["", [Validators.required]],
      newPassword: ["", [Validators.required, Validators.minLength(8),
      Validators.pattern(/^(?=.*[a-zA-Z])(?=.*\d)/)]],
      confirmPassword: ["", [Validators.required]],
    });
  }

  onUpdateProfile(): void {
    if (this.profileForm.invalid) {
      this.profileForm.markAllAsTouched();
      return;
    }

    this.loading = true;
    this.profileSvc.updateProfile(this.profileForm.value)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: res => {
          this.loading = false;
          this.editMode = false;
          this.store.dispatch(updateProfileSuccess({ user: res.data }));
          this.notification.success("Profile updated successfully.");
        },
        error: err => {
          this.loading = false;
          this.notification.error(err.error?.message || "Update failed.");
        },
      });
  }

  onChangePassword(): void {
    const { newPassword, confirmPassword } = this.passwordForm.value;

    if (newPassword !== confirmPassword) {
      this.notification.error("Passwords do not match.");
      return;
    }

    if (this.passwordForm.invalid) {
      this.passwordForm.markAllAsTouched();
      return;
    }

    this.pwLoading = true;
    this.profileSvc.changePassword(this.passwordForm.value)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.pwLoading = false;
          this.passwordForm.reset();
          this.notification.success("Password changed successfully.");
        },
        error: err => {
          this.pwLoading = false;
          this.notification.error(err.error?.message || "Password change failed.");
        },
      });
  }

  onAvatarChange(event: Event): void {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (!file) return;

    this.avatarLoading = true;
    this.profileSvc.uploadAvatar(file)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: res => {
          this.avatarLoading = false;
          this.store.dispatch(updateProfileSuccess({ user: res.data }));
          this.notification.success("Avatar updated.");
        },
        error: () => {
          this.avatarLoading = false;
          this.notification.error("Failed to upload avatar.");
        },
      });
  }

  onRemoveAvatar(): void {
    this.profileSvc.removeAvatar()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: res => {
          this.store.dispatch(updateProfileSuccess({ user: res.data }));
          this.notification.info("Avatar removed.");
        },
        error: () => {
          this.notification.error("Failed to remove avatar.");
        },
      });
  }

  getInitials(): string {
    return this.user?.name?.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2) || "U";
  }

  f(name: string) { return this.profileForm?.get(name); }
  fp(name: string) { return this.passwordForm?.get(name); }
}
