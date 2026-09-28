import { Component, OnInit, OnDestroy, Input } from "@angular/core";
import { Testimonial } from "../../../../core/models/api-response.model";

@Component({
  selector: "app-testimonials-slider",
  standalone: false,
  templateUrl: "./testimonials-slider.html",
  styleUrls: ["./testimonials-slider.scss"],
})
export class TestimonialsSlider implements OnInit, OnDestroy {

  @Input() testimonials: Testimonial[] = [];
  @Input() loading = true;
  currentIndex = 0;
  private timer: any;

  ngOnInit(): void {
    if (this.testimonials.length > 1) this.startAuto();
  }

  ngOnDestroy(): void { clearInterval(this.timer); }

  startAuto(): void {
    this.timer = setInterval(() => this.next(), 4000);
  }

  next(): void {
    this.currentIndex = (this.currentIndex + 1) % this.testimonials.length;
  }

  prev(): void {
    this.currentIndex = (this.currentIndex - 1 + this.testimonials.length) % this.testimonials.length;
  }

  goTo(i: number): void { this.currentIndex = i; }

  getStars(n: number): number[] { return Array(n).fill(0); }

  getUserName(t: Testimonial): string {
    return (t.userId as any)?.name || "Anonymous";
  }

  getUserInitial(t: Testimonial): string {
    return this.getUserName(t).charAt(0).toUpperCase();
  }
}