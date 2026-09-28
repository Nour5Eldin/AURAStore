import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { AppState, loadUser, selectIsLoggedIn } from '../../store/app.state';
import { map, Observable, take } from 'rxjs';
import { selectAuthInitialized } from '../../store/auth/auth.selectors';
import { combineLatest, filter } from 'rxjs';

@Injectable({ providedIn: "root" })
export class GuestGuard implements CanActivate {
  constructor(private store: Store<AppState>, private router: Router) { }
  canActivate(): Observable<boolean> {
    this.store.select(selectAuthInitialized).pipe(take(1)).subscribe(initialized => {
      if (!initialized) this.store.dispatch(loadUser());
    });
    return combineLatest([
      this.store.select(selectAuthInitialized),
      this.store.select(selectIsLoggedIn),
    ]).pipe(
      filter(([initialized]) => initialized),
      take(1), map(([, isLoggedIn]) => {
        if (!isLoggedIn) return true;
        this.router.navigate(["/"]);
        return false;
      })
    )
  }

}
