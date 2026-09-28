import { Component, OnInit } from "@angular/core";
import { HomeTestimonialService } from "../../../home/services/testimonial.service";
import { NotificationService } from "../../../../core/services/notification.service";
import { Router } from "@angular/router";

@Component({
  selector: "app-testimonial-submission-page",
  standalone: false,
  templateUrl: "./testimonial-submission-page.html",
  styleUrls: ["./testimonial-submission-page.scss"],
})
export class TestimonialSubmissionPage implements OnInit {

  stars = 0;
  comment = "";
  loading = false;
  submitted = false;

  constructor(
    private testimonialSvc: HomeTestimonialService,
    private notification: NotificationService,
    private router: Router,
  ) { }

  ngOnInit(): void { }

  setStars(n: number): void { this.stars = n; }

  onSubmit(): void {
    if (!this.stars) {
      this.notification.error("Please select a star rating.");
      return;
    }
    if (this.comment.trim().length < 10) {
      this.notification.error("Comment must be at least 10 characters.");
      return;
    }

    this.loading = true;
    this.testimonialSvc.submitTestimonial({
      stars: this.stars,
      comment: this.comment,
    }).subscribe({
      next: () => {
        this.loading = false;
        this.submitted = true;
        this.notification.success("Testimonial submitted for review!");
      },
      error: err => {
        this.loading = false;
        this.notification.error(err.error?.message || "Failed to submit.");
      },
    });
  }

  get charCount(): number { return this.comment.length; }
}
