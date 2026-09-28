import { Component } from "@angular/core";
import { AuthService } from "@auth0/auth0-angular";

/** Auth0 connection identifiers — must match the Social connection names
 *  configured in Auth0 Dashboard → Authentication → Social. */
const AUTH0_CONNECTIONS: Record<"google" | "apple", string> = {
  google: "google-oauth2",
  apple:  "apple",
};

@Component({
  selector: "app-register-page",
  standalone: false,
  templateUrl: "./register-page.html",
  styleUrls: ["./register-page.scss"],
})
export class RegisterPage {
  loading = false;

  constructor(private auth: AuthService) { }

  onSubmit(): void {
    this.signUp();
  }

  signUp(): void {
    this.loading = true;
    this.auth.loginWithRedirect({
      appState: { target: "/" },
      authorizationParams: { screen_hint: "signup" },
    }).subscribe({
      error: () => { this.loading = false; },
    });
  }

  /**
   * Initiates a sign-up flow pre-selecting the given social provider.
   * Auth0 will skip the Universal Login screen and redirect directly
   * to the provider's OAuth consent page.
   */
  signUpWithProvider(provider: "google" | "apple"): void {
    this.loading = true;
    this.auth.loginWithRedirect({
      appState: { target: "/" },
      authorizationParams: {
        connection: AUTH0_CONNECTIONS[provider],
        screen_hint: "signup",
      },
    }).subscribe({
      error: () => { this.loading = false; },
    });
  }
}
