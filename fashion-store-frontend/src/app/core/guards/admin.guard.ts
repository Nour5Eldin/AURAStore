import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { Store } from '@ngrx/store';
import { AppState, loadUser, selectIsAdmin } from '../../store/app.state';
import { map, Observable, take } from 'rxjs';
import { selectAuthInitialized } from '../../store/auth/auth.selectors';
import { combineLatest, filter } from 'rxjs';

@Injectable({ providedIn: "root" })
export class AdminGuard implements CanActivate{
  constructor(private store: Store<AppState>, private router: Router) { }
  canActivate(): Observable<boolean> {
    this.store.select(selectAuthInitialized).pipe(take(1)).subscribe(initialized => {
      if (!initialized) this.store.dispatch(loadUser());
    });
    return combineLatest([
      this.store.select(selectAuthInitialized),
      this.store.select(selectIsAdmin),
    ]).pipe(
      filter(([initialized]) => initialized),
      take(1),
      map(([, isAdmin]) => {
        if (isAdmin) return true;
        this.router.navigate(["/"])
        return false;
      })
      
    );
  }
    
  }