import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, GuardResult, MaybeAsync, Router, RouterStateSnapshot } from '@angular/router';
import { AppState, loadUser, selectIsLoggedIn } from '../../store/app.state';
import { Store } from '@ngrx/store';
import { selectAuthInitialized } from '../../store/auth/auth.selectors';
import { combineLatest, filter, map, Observable, take } from 'rxjs';

@Injectable({ providedIn: "root" })
export class AuthGuard implements CanActivate {
  constructor(private store: Store<AppState>,
    private router: Router
  ){}
  canActivate(_route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
    this.store.select(selectAuthInitialized).pipe(take(1)).subscribe(initialized => {
      if (!initialized) this.store.dispatch(loadUser());
    });
    return combineLatest([
      this.store.select(selectAuthInitialized),
      this.store.select(selectIsLoggedIn),
    ]).pipe(
      filter(([initialized]) => initialized),
      take(1), map(([, isLoggedIn]) => {
        if (isLoggedIn) return true;
        this.router.navigate(["/auth/login"], {
          state: { returnUrl: state.url },
        });
        return false;
      })
    )
  }
  
}
