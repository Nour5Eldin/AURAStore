import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-not-found-page',
  standalone: false,
  templateUrl: './not-found-page.html',
  styleUrl: './not-found-page.scss',
})
export class NotFoundPage {
  constructor(private router: Router) { }
  goHome(): void { this.router.navigate(["/"]); }
  goBack(): void { history.back(); }
}
