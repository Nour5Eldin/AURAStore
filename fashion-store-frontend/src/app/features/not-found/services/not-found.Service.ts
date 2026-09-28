import { Injectable } from "@angular/core";
import { Router } from "@angular/router";

@Injectable({ providedIn: "root" })
export class NotFoundService {

  constructor(private router: Router) { }

  goHome(): void {
    this.router.navigate(["/"]);
  }

  goBack(): void {
    history.back();
  }
}