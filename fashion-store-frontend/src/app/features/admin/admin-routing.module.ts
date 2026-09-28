import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";

import { AdminDashboard } from "./pages/admin-dashboard/admin-dashboard";
import { ProductManagement } from "./pages/product-management/product-management";
import { CategoryManagement } from "./pages/category-management/category-management";
import { OrderManagement } from "./pages/order-management/order-management";
import { TestimonialManagement } from "./pages/testimonial-management/testimonial-management";
import { ContentManagement } from "./pages/content-management/content-management";
import { SalesReports } from "./pages/sales-reports/sales-reports";
import { ReviewManagement } from "./pages/review-management/review-management";
import { ReviewAnalytics } from "./pages/review-analytics/review-analytics";
import { UserManagement } from "./pages/user-management/user-management";

const routes: Routes = [
  { path: "", redirectTo: "dashboard", pathMatch: "full" },
  { path: "dashboard", component: AdminDashboard },
  { path: "products", component: ProductManagement },
  { path: "categories", component: CategoryManagement },
  { path: "orders", component: OrderManagement },
  { path: "testimonials", component: TestimonialManagement },
  { path: "content", component: ContentManagement },
  { path: "reports", component: SalesReports },
  { path: "reviews", component: ReviewManagement },
  { path: "review-analytics", component: ReviewAnalytics },
  { path: "users", component: UserManagement },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AdminRoutingModule { }