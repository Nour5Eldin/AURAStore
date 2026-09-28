import { inject, Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { Router } from "@angular/router";
import { AuthService as Auth0Service } from "@auth0/auth0-angular";
import { combineLatest, of } from "rxjs";
import { catchError, filter, map, retry, switchMap, take, tap } from "rxjs/operators";
import * as AuthActions from "./auth.actions";
import { AuthService } from "../../core/services/auth.service";
import { NotificationService } from "../../core/services/notification.service";

@Injectable()
export class AuthEffects {
  private actions$ = inject(Actions);
  private auth0 = inject(Auth0Service);
  private authApi = inject(AuthService);
  private notification = inject(NotificationService);
  private router = inject(Router);

  logout$ = createEffect(() => this.actions$.pipe(
    ofType(AuthActions.logout),
    tap(() => {
      this.auth0.logout({ logoutParams: { returnTo: window.location.origin } }).subscribe({
        error: () => this.router.navigate(["/"]),
      });
    }),
  ), { dispatch: false });

  loadUser$ = createEffect(() => this.actions$.pipe(
    ofType(AuthActions.loadUser),
    switchMap(() => combineLatest([
      this.auth0.isLoading$,
      this.auth0.isAuthenticated$,
      this.auth0.user$,
    ]).pipe(
      filter(([loading]) => !loading),
      take(1),
      switchMap(([, isAuthenticated, profile]) => {
        if (!isAuthenticated || !profile?.email) return of(AuthActions.loadUserFailure());
        return this.authApi.syncCurrentUser({
          email: profile.email,
          name: profile.name || profile.nickname,
          picture: profile.picture,
        }).pipe(
          retry(2),  // ← retry up to 2 extra times (3 total) on transient Atlas latency
          map(user => AuthActions.loadUserSuccess({ user })),
          catchError((err) => {
            const message = err?.error?.message || "Failed to sync your account. Please try again.";
            this.notification.error(message);
            return of(AuthActions.loadUserFailure());
          }),
        );
      }),
    )),
  ));

  loadUserFailure$ = createEffect(() => this.actions$.pipe(
    ofType(AuthActions.loadUserFailure),
    tap(() => this.router.url.startsWith("/account") || this.router.url.startsWith("/admin")
      ? this.router.navigate(["/auth/login"])
      : undefined),
  ), { dispatch: false });
}
