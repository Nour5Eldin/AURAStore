import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AccountRoutingModule } from './account-routing.module';
import { ProfilePage } from './pages/profile-page/profile-page';
import { AddressManagementPage } from './pages/address-management-page/address-management-page';
import { OrderHistoryPage } from './pages/order-history-page/order-history-page';
import { OrderDetailPage } from './pages/order-detail-page/order-detail-page';
import { RefundRequestPage } from './pages/refund-request-page/refund-request-page';
import { TestimonialSubmissionPage } from './pages/testimonial-submission-page/testimonial-submission-page';
import { AddressCard } from './components/address-card/address-card';
import { AddressForm } from './components/address-form/address-form';
import { OrderStatusBadge } from './components/order-status-badge/order-status-badge';
import { ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from "../../shared/shared.module";

@NgModule({
  declarations: [
    ProfilePage,
    AddressManagementPage,
    OrderHistoryPage,
    OrderDetailPage,
    RefundRequestPage,
    TestimonialSubmissionPage,
    AddressCard,
    AddressForm,
    OrderStatusBadge,
  ],
  imports: [CommonModule, AccountRoutingModule, ReactiveFormsModule, SharedModule],
})
export class AccountModule {}
