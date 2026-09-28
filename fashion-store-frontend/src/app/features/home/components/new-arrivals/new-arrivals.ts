import { Component, Input, OnInit } from "@angular/core";
import { HomeService } from "../../services/home.service";
import { Product } from "../../../../core/models/api-response.model";

@Component({
  selector: "app-new-arrivals",
  standalone: false,
  templateUrl: "./new-arrivals.html",
  styleUrls: ["./new-arrivals.scss"],
})
export class NewArrivals implements OnInit {

  @Input() products: Product[] = [];
  @Input() loading = true;
  @Input() error = false;

  constructor(private homeService: HomeService) { }

  ngOnInit(): void {
    this.homeService.getNewArrivals(8).subscribe({
      next: res => { this.products = res.data; this.loading = false; },
      error: () => { this.error = true; this.loading = false; },
    });
  }
}