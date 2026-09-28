import { NgModule }     from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterModule } from "@angular/router";
import { FormsModule }  from "@angular/forms";
import { ProductCard }     from "./components/product-card/product-card";
import { StockBadge }      from "./components/stock-badge/stock-badge";
import { SkeletonLoader }  from "./components/skeleton-loader/skeleton-loader";
import { EmptyState }      from "./components/empty-state/empty-state";
import { Pagination }      from "./components/pagination/pagination";
import { Breadcrumb }      from "./components/breadcrumb/breadcrumb";
import { ConfirmDialog }   from "./components/confirm-dialog/confirm-dialog";
import { StarRating }      from "./components/star-rating/star-rating";
import { LazyImage }       from "./directives/lazy-image";
import { CurrencyPipe } from "./pipes/currency-egp-pipe";
import { OrderStatusPipe } from "./pipes/order-status-pipe";

const COMPONENTS = [
  ProductCard, StockBadge, SkeletonLoader,
  EmptyState, Pagination, Breadcrumb,
  ConfirmDialog, StarRating,
];

@NgModule({
  declarations: [...COMPONENTS, LazyImage, CurrencyPipe, OrderStatusPipe],
  imports:      [CommonModule, RouterModule, FormsModule],
  exports:      [
    ...COMPONENTS, LazyImage, CurrencyPipe, OrderStatusPipe,
    CommonModule, RouterModule, FormsModule,
  ],
})
export class SharedModule {}