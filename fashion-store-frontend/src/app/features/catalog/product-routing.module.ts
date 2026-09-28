import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProductListingPage } from './pages/product-listing-page/product-listing-page';
import { ProductDetailPage } from './pages/product-detail-page/product-detail-page';

const routes: Routes = [
  { path: "", component: ProductListingPage },
  { path: ":slug", component: ProductDetailPage },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ProductRoutingModule {}
