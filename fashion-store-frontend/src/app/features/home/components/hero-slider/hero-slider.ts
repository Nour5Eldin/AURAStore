import { Component, OnInit, OnDestroy } from "@angular/core";
import { Router } from "@angular/router";

@Component({
  selector:    "app-hero-slider",
  standalone:  false,
  templateUrl: "./hero-slider.html",
  styleUrls:   ["./hero-slider.scss"],
})
export class HeroSlider implements OnInit, OnDestroy {

  currentSlide = 0;
  private interval: any;

  slides = [
    {
      title:    "New Summer Collection",
      subtitle: "Fresh styles for the season",
      cta:      "Shop Now",
      link:     "/products?categoryId=summer",
      image:    "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1400",
      color:    "#1E3A8A",
    },
    {
      title:    "Women's Essentials",
      subtitle: "Timeless pieces for every occasion",
      cta:      "Explore",
      link:     "/products",
      image:    "https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=1400",
      color:    "#1A1A1A",
    },
    {
      title:    "Men's Casual Wear",
      subtitle: "Comfort meets style",
      cta:      "Shop Men",
      link:     "/products",
      image:    "https://images.unsplash.com/photo-1490578474895-699cd4e2cf59?w=1400",
      color:    "#C9A84C",
    },
  ];

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.startAutoPlay();
  }

  ngOnDestroy(): void {
    clearInterval(this.interval);
  }

  startAutoPlay(): void {
    this.interval = setInterval(() => {
      this.nextSlide();
    }, 5000);
  }

  goTo(index: number): void {
    this.currentSlide = index;
  }

  nextSlide(): void {
    this.currentSlide = (this.currentSlide + 1) % this.slides.length;
  }

  prevSlide(): void {
    this.currentSlide = (this.currentSlide - 1 + this.slides.length) % this.slides.length;
  }

  onCta(link: string): void {
    this.router.navigateByUrl(link);
  }
}