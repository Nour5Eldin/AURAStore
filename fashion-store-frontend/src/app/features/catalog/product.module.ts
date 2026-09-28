
import { CommonModule } from '@angular/common';
import { ProductRoutingModule } from './product-routing.module';
import { ProductListingPage } from './pages/product-listing-page/product-listing-page';
import { ProductDetailPage } from './pages/product-detail-page/product-detail-page';
import { ProductFilters } from './components/product-filters/product-filters';
import { ProductGrid } from './components/product-grid/product-grid';
import { FilterChips } from './components/filter-chips/filter-chips';
import { NgModule } from '@angular/core';
import { SharedModule } from "../../shared/shared.module";
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [ProductListingPage, ProductDetailPage, ProductFilters, ProductGrid, FilterChips],
  imports: [ReactiveFormsModule,CommonModule, ProductRoutingModule, SharedModule],
})
export class ProductModule { }