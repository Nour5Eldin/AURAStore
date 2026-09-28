import { Component } from "@angular/core";
import { Router } from "@angular/router";
import { AuthService } from "@auth0/auth0-angular";

@Component({
  selector: "app-forgot-password-page",
  standalone: false,
  templateUrl: "./forgot-password-page.html",
  styleUrls: ["./forgot-password-page.scss"],
})
export class ForgotPasswordPage {
  loading = false;

  constructor(private auth: AuthService, private router: Router) { }

  /**
   * Redirects the user to Auth0 Universal Login.
   * On that page they can click "Forgot password?" to receive a
   * password-reset email directly from Auth0.
   *
   * Note: Auth0 does not expose a direct `screen_hint: 'reset'`.
   * The reset email flow is initiated from within the Auth0 login page.
   */
  startRecovery(): void {
    this.loading = true;
    this.auth.loginWithRedirect().subscribe({
      error: () => { this.loading = false; },
    });
  }

  goToLogin(): void {
    this.router.navigate(["/auth/login"]);
  }
}
