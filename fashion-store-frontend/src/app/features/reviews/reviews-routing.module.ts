import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MyReviewsPage } from './pages/my-reviews-page/my-reviews-page';
import { WriteReviewPage } from './pages/write-review-page/write-review-page';

const routes: Routes = [
  { path: "", redirectTo: "my-reviews", pathMatch: "full" },
  { path: "my-reviews", component: MyReviewsPage },
  { path: "write/:productId", component: WriteReviewPage },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ReviewsRoutingModule {}
