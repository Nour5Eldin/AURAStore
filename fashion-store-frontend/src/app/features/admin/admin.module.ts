import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AdminRoutingModule } from './admin-routing.module';
import { SharedModule } from "../../shared/shared.module";

// Pages
import { AdminDashboard } from './pages/admin-dashboard/admin-dashboard';
import { ProductManagement } from './pages/product-management/product-management';
import { CategoryManagement } from './pages/category-management/category-management';
import { OrderManagement } from './pages/order-management/order-management';
import { TestimonialManagement } from './pages/testimonial-management/testimonial-management';
import { SalesReports } from './pages/sales-reports/sales-reports';
import { ReviewManagement } from './pages/review-management/review-management';
import { ReviewAnalytics } from './pages/review-analytics/review-analytics';
import { ContentManagement } from './pages/content-management/content-management';
import { UserManagement } from './pages/user-management/user-management'; 

// Components
import { AdminSidebar } from './components/sidebar/sidebar';
import { KpiCard } from './components/kpi-card/kpi-card';
import { DataTable } from './components/data-table/data-table';
import { StatusDropdown } from './components/status-dropdown/status-dropdown';
import { ReportChart } from './components/report-chart/report-chart';
import { ReviewDataTable } from './components/review-data-table/review-data-table';
import { AdminReplyModal } from './components/admin-reply-modal/admin-reply-modal';

@NgModule({
  declarations: [
    AdminDashboard,
    ProductManagement,
    CategoryManagement,
    OrderManagement,
    TestimonialManagement,
    SalesReports,
    AdminSidebar,
    KpiCard,
    DataTable,
    StatusDropdown,
    ReportChart,
    ReviewManagement,
    ReviewAnalytics,
    ReviewDataTable,
    AdminReplyModal,
    ContentManagement,
    UserManagement, 
  ],
  imports: [
    CommonModule, 
    SharedModule, 
    FormsModule,  
    ReactiveFormsModule,
    AdminRoutingModule,
  ],
})
export class AdminModule {}