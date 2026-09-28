import { Component, OnInit, OnDestroy, AfterViewInit, NgZone } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';

interface Slide {
  image: string; label: string;
  title: string; description: string;
  cta: string; link: string;
}

@Component({
  selector: 'app-home-page',
  standalone: false,
  templateUrl: './home-page.html',
  styleUrls: ['./home-page.scss'],
})
export class HomePage implements OnInit, OnDestroy, AfterViewInit {

  slides: Slide[] = [
    {
      image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1800&q=90',
      label: "Women's Collection · SS26",
      title: "Elevate Your Everyday",
      description: "Our latest minimalist silhouettes designed for the modern lifestyle.",
      cta: "Shop Women", link: "/products"
    },
    {
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=1800&q=90',
      label: "Men's Collection · SS26",
      title: "Refined Tailoring",
      description: "Bridging traditional craftsmanship and contemporary silhouette.",
      cta: "Shop Men", link: "/products"
    },
  ];

  currentSlide = 0;
  private slideInterval: any;
  private revealObserver!: IntersectionObserver;

  // Campaign banner properties
  campaignTag    = 'LIMITED EDITION';
  campaignTitle  = 'Summer Collection 2026';
  campaignDescription = 'Discover the essence of summer with our meticulously curated pieces, crafted for sun-drenched days and warm evenings.';
  campaignBtnText = 'Explore Campaign';
  campaignBtnLink = '/products';

  newArrivals: any[]  = [];
  bestSellers: any[]  = [];
  testimonials: any[] = [];
  newArrivalsLoading  = true;
  bestSellersLoading  = true;

  private base = environment.apiUrl;

  constructor(
    private http: HttpClient,
    private router: Router,
    private zone: NgZone
  ) {}

  ngOnInit(): void {
    this.startAutoSlide();
    this.loadNewArrivals();
    this.loadBestSellers();
    this.loadTestimonials();
    this.loadDynamicContent();
  }

  ngAfterViewInit(): void {
    this.zone.runOutsideAngular(() => {
      this.initRevealObserver();
    });
  }

  ngOnDestroy(): void {
    clearInterval(this.slideInterval);
    if (this.revealObserver) this.revealObserver.disconnect();
  }

  // ── Slider ─────────────────────────────────────────────────────────────────
  startAutoSlide(): void {
    this.slideInterval = setInterval(() => this.nextSlide(), 6000);
  }

  nextSlide(): void {
    this.currentSlide = (this.currentSlide + 1) % this.slides.length;
  }

  prevSlide(): void {
    this.currentSlide = (this.currentSlide - 1 + this.slides.length) % this.slides.length;
  }

  goToSlide(i: number): void { this.currentSlide = i; }

  // ── Navigation ──────────────────────────────────────────────────────────────
  navigateToCategory(slug: string): void {
    this.router.navigate(['/products'], { queryParams: { categorySlug: slug } });
  }

  goToProduct(slug: string): void {
    this.router.navigate(['/products', slug]);
  }

  getStars(n: number): number[] { return Array(n).fill(0); }

  // ── Scroll Reveal ───────────────────────────────────────────────────────────
  private initRevealObserver(): void {
    if (typeof IntersectionObserver === 'undefined') return;

    this.revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('revealed');
            this.revealObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
    );

    // Observe after a brief delay to let Angular render
    setTimeout(() => {
      document.querySelectorAll('.reveal').forEach(el => {
        this.revealObserver?.observe(el);
      });
    }, 200);
  }

  // ── API Calls ───────────────────────────────────────────────────────────────
  private loadNewArrivals(): void {
    this.http.get<any>(`${this.base}/products/new-arrivals?limit=4`)
      .subscribe({
        next: r => {
          this.newArrivals = r.data;
          this.newArrivalsLoading = false;
          this.reObserveCards();
        },
        error: () => { this.newArrivalsLoading = false; }
      });
  }

  private loadBestSellers(): void {
    this.http.get<any>(`${this.base}/products/best-sellers?limit=4`)
      .subscribe({
        next: r => {
          this.bestSellers = r.data;
          this.bestSellersLoading = false;
          this.reObserveCards();
        },
        error: () => { this.bestSellersLoading = false; }
      });
  }

  private loadTestimonials(): void {
    this.http.get<any>(`${this.base}/testimonials`)
      .subscribe({
        next: r => {
          this.testimonials = (r.data || []).slice(0, 3);
          this.reObserveCards();
        },
        error: () => {}
      });
  }

  private reObserveCards(): void {
    setTimeout(() => {
      document.querySelectorAll('.reveal:not(.revealed)').forEach(el => {
        this.revealObserver?.observe(el);
      });
    }, 100);
  }

  private loadDynamicContent(): void {
    this.http.get<any>(`${this.base}/content/slides`)
      .subscribe({
        next: r => {
          if (r.data && r.data.length > 0) {
            this.slides = r.data;
            this.currentSlide = 0;
          }
        },
        error: () => console.warn("Could not load dynamic slides, using premium static fallbacks.")
      });

    this.http.get<any>(`${this.base}/content/campaign`)
      .subscribe({
        next: r => {
          if (r.data) {
            this.campaignTag         = r.data.campaignTag;
            this.campaignTitle       = r.data.campaignTitle;
            this.campaignDescription = r.data.campaignDescription;
            this.campaignBtnText     = r.data.campaignBtnText;
            this.campaignBtnLink     = r.data.campaignBtnLink;
          }
        },
        error: () => console.warn("Could not load dynamic campaign, using static fallbacks.")
      });
  }
}