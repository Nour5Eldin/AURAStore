import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProfilePage } from './pages/profile-page/profile-page';
import { OrderHistoryPage } from './pages/order-history-page/order-history-page';
import { OrderDetailPage } from './pages/order-detail-page/order-detail-page';
import { AddressManagementPage } from './pages/address-management-page/address-management-page';
import { TestimonialSubmissionPage } from './pages/testimonial-submission-page/testimonial-submission-page';

const routes: Routes = [
  { path: "", redirectTo: "profile", pathMatch: "full" },
  { path: "profile", component: ProfilePage },
  { path: "orders", component: OrderHistoryPage },
  { path: "orders/:id", component: OrderDetailPage },
  { path: "addresses", component: AddressManagementPage },
  { path: "address", redirectTo: "addresses", pathMatch: "full" },
  { path: "testimonial", component: TestimonialSubmissionPage },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AccountRoutingModule {}
