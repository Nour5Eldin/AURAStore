import { Component, OnInit, OnDestroy } from "@angular/core";
import { Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";
import { AdminUserService } from "../../services/admin-user.service";
import { NotificationService } from "../../../../core/services/notification.service";
import { User, PaginatedResponse } from "../../../../core/models/api-response.model";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";

@Component({
  selector: "app-user-management",
  standalone: false,
  templateUrl: "./user-management.html",
  styleUrls: ["./user-management.scss"],
})
export class UserManagement implements OnInit, OnDestroy {

  users: User[] = [];
  pagination: Partial<PaginatedResponse<User>> = {};
  loading = true;

  filters = { page: 1, role: "", isActive: "", search: "" };

  private destroy$ = new Subject<void>();
  
  showModal = false;
  saving = false;
  selectedUser: User | null = null;
  userForm: FormGroup;

  constructor(
    private userSvc: AdminUserService,
    private notify: NotificationService,
    private fb: FormBuilder,
  ) {
    this.userForm = this.fb.group({
      name: ['', Validators.required],
      username: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      mobile: [''],
      password: [''],
      role: ['user', Validators.required],
      gender: ['male', Validators.required]
    });
  }

  ngOnInit(): void { this.load(); }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  load(): void {
    this.loading = true;
    const opts: any = { page: this.filters.page, limit: 20 };
    if (this.filters.role) opts.role = this.filters.role;
    if (this.filters.isActive !== "") opts.isActive = this.filters.isActive;
    if (this.filters.search) opts.search = this.filters.search;

    this.userSvc.getUsers(opts)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: res => {
          this.users = res.data?.data || [];
          this.pagination = res.data || {};
          this.loading = false;
        },
        error: () => {
          this.users = [];
          this.loading = false;
        },
      });
  }

  onToggleActive(user: User): void {
    this.userSvc.toggleActive(user._id, !user.isActive)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: res => {
          this.users = this.users.map(u =>
            u._id === user._id ? res.data : u
          );
          this.notify.success(`User ${res.data.isActive ? "activated" : "deactivated"}.`);
        },
        error: err => this.notify.error(err.error?.message || "Failed."),
      });
  }

  onPageChange(page: number): void {
    this.filters.page = page;
    this.load();
  }

  getInitial(name: string): string {
    return name?.charAt(0)?.toUpperCase() || "?";
  }

  openModal(user?: User): void {
    this.selectedUser = user || null;
    this.userForm.reset({
      name: user?.name || '',
      username: user?.username || '',
      email: user?.email || '',
      mobile: user?.mobile || '',
      role: user?.role || 'user',
      gender: user?.gender || 'male'
    });
    
    if (!user) {
      this.userForm.get('password')?.setValidators([Validators.required, Validators.minLength(8)]);
    } else {
      this.userForm.get('password')?.clearValidators();
    }
    this.userForm.get('password')?.updateValueAndValidity();
    
    this.showModal = true;
  }

  closeModal(): void {
    this.showModal = false;
    this.selectedUser = null;
    this.userForm.reset();
  }

  saveUser(): void {
    if (this.userForm.invalid) return;
    this.saving = true;
    
    const obs$ = this.selectedUser 
      ? this.userSvc.updateUser(this.selectedUser._id, this.userForm.value)
      : this.userSvc.createUser(this.userForm.value);

    obs$.pipe(takeUntil(this.destroy$)).subscribe({
      next: () => {
        this.notify.success(`User ${this.selectedUser ? 'updated' : 'created'} successfully`);
        this.closeModal();
        this.load();
        this.saving = false;
      },
      error: (err) => {
        this.notify.error(err.error?.message || 'Failed to save user');
        this.saving = false;
      }
    });
  }

  deleteUser(user: User): void {
    if (confirm(`Are you sure you want to delete ${user.name}?`)) {
      this.userSvc.deleteUser(user._id).pipe(takeUntil(this.destroy$)).subscribe({
        next: () => {
          this.notify.success('User deleted successfully');
          this.load();
        },
        error: (err) => {
          this.notify.error(err.error?.message || 'Failed to delete user');
        }
      });
    }
  }
}
