import { Component } from "@angular/core";
import { AuthService } from "@auth0/auth0-angular";

/** Auth0 connection identifiers — must match the Social connection names
 *  configured in Auth0 Dashboard → Authentication → Social. */
const AUTH0_CONNECTIONS: Record<"google" | "apple", string> = {
  google: "google-oauth2",
  apple:  "apple",
};

@Component({
  selector: "app-login-page",
  standalone: false,
  templateUrl: "./login-page.html",
  styleUrls: ["./login-page.scss"],
})
export class LoginPage {
  loading = false;

  constructor(private auth: AuthService) { }

  onSubmit(): void {
    this.login();
  }

  login(): void {
    this.loading = true;
    this.auth.loginWithRedirect({
      appState: { target: history.state?.returnUrl || "/" },
    }).subscribe({
      error: () => { this.loading = false; },
    });
  }

  /**
   * Initiates a login flow pre-selecting the given social provider.
   * Auth0 will skip the Universal Login screen and redirect directly
   * to the provider's OAuth consent page.
   */
  signInWithProvider(provider: "google" | "apple"): void {
    this.loading = true;
    this.auth.loginWithRedirect({
      appState: { target: history.state?.returnUrl || "/" },
      authorizationParams: { connection: AUTH0_CONNECTIONS[provider] },
    }).subscribe({
      error: () => { this.loading = false; },
    });
  }
}
