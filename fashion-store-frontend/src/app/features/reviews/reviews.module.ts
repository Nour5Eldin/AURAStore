import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ReviewsRoutingModule } from './reviews-routing.module';
import { MyReviewsPage } from './pages/my-reviews-page/my-reviews-page';
import { WriteReviewPage } from './pages/write-review-page/write-review-page';
import { ReviewList } from './components/review-list/review-list';
import { ReviewCard } from './components/review-card/review-card';
import { StarRating } from './components/star-rating/star-rating';
import { RatingBreakdown } from './components/rating-breakdown/rating-breakdown';

@NgModule({
  declarations: [
    MyReviewsPage,
    WriteReviewPage,
    ReviewList,
    ReviewCard,
    StarRating,
    RatingBreakdown,
  ],
  imports: [CommonModule, ReviewsRoutingModule],
})
export class ReviewsModule {}
