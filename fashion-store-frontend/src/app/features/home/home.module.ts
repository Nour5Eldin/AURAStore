import { NgModule } from '@angular/core';
import { HomeRoutingModule } from './home-routing.module';
import { HomePage } from './pages/home-page/home-page';
import { HeroSlider } from './components/hero-slider/hero-slider';
import { NewArrivals } from './components/new-arrivals/new-arrivals';
import { BestSellers } from './components/best-sellers/best-sellers';
import { TestimonialsSlider } from './components/testimonials-slider/testimonials-slider';
import { SharedModule } from "../../shared/shared.module";

@NgModule({
  declarations: [HomePage, HeroSlider, NewArrivals, BestSellers, TestimonialsSlider],
  imports: [HomeRoutingModule, SharedModule],
})
export class HomeModule {}
