import { Component } from "@angular/core";
import { Store } from "@ngrx/store";
import { AppState } from "../../../../store/app.state";
import { logout } from "../../../../store/auth/auth.actions";

@Component({
  selector: "app-admin-sidebar",
  standalone: false,
  templateUrl: "./sidebar.html",
  styleUrls: ["./sidebar.scss"],
})
export class AdminSidebar {

  navItems = [
    { icon: "bar_chart", label: "Dashboard", route: "/admin/dashboard" },
    { icon: "checkroom", label: "Products", route: "/admin/products" },
    { icon: "folder", label: "Categories", route: "/admin/categories" },
    { icon: "inventory_2", label: "Orders", route: "/admin/orders" },
    { icon: "star", label: "Testimonials", route: "/admin/testimonials" },
    { icon: "chat", label: "Reviews", route: "/admin/reviews" },
    { icon: "group", label: "Users", route: "/admin/users" },
    { icon: "desktop_mac", label: "Content Mgmt", route: "/admin/content" },
    { icon: "search", label: "Review Analytics", route: "/admin/review-analytics" },
    { icon: "trending_up", label: "Sales Reports", route: "/admin/reports" },
  ];

  constructor(private store: Store<AppState>) { }

  onLogout(): void {
    this.store.dispatch(logout());
  }
}
