import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './core/guards/auth.guard';
import { AdminGuard } from './core/guards/admin.guard';

const routes: Routes = [
  {
    path: "",
    loadChildren: () =>
      import("./features/home/home.module").then(m => m.HomeModule),
  },
  {
    path: "products",
    loadChildren: () =>
      import("./features/catalog/product.module").then(m => m.ProductModule),
  },
  {
    path: "cart",
    loadChildren: () =>
      import("./features/cart/cart.module").then(m => m.CartModule),
  },
  {
    path: "checkout",
    canActivate: [AuthGuard],
    loadChildren: () =>
      import("./features/checkout/checkout.module").then(m => m.CheckoutModule),
  },
  {
    path: "auth",
    loadChildren: () =>
      import("./features/auth/auth.module").then(m => m.AuthModule),
  },
  {
    path: "account",
    canActivate: [AuthGuard],
    loadChildren: () =>
      import("./features/account/account.module").then(m => m.AccountModule),
  },
  {
    path: "admin",
    canActivate: [AuthGuard, AdminGuard],
    loadChildren: () =>
      import("./features/admin/admin.module").then(m => m.AdminModule),
  },
  {
    path: "reviews",
    canActivate: [AuthGuard],
    loadChildren: () =>
      import("./features/reviews/reviews.module").then(m => m.ReviewsModule),
  },
  {
    path: "not-found",
    loadChildren: () =>
      import("./features/not-found/not-found.module").then(m => m.NotFoundModule)
  },
  {
    path: "**",
    redirectTo: "not-found",
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {
    scrollPositionRestoration: "top",
    anchorScrolling: "enabled",
  })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
