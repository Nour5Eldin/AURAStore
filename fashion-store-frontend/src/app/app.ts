import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState } from './store/app.state';
import { loadUser } from './store/auth/auth.actions';
import { asyncScheduler, Observable, Subject } from 'rxjs';
import { filter, observeOn, startWith, takeUntil } from 'rxjs/operators';
import { Router, NavigationEnd } from '@angular/router';
import { LoadingService } from './core/services/loading.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.html',
  standalone: false,
  styleUrl: './app.scss'
})
export class App implements OnInit {
  isLoading$: Observable<boolean>;
  isHomePage = true;
  isAdminPage = false;
  private destroy$ = new Subject<void>();

  constructor(
    private _store: Store<AppState>,
    private loadingService: LoadingService,
    private router: Router
  ) {
    this.isLoading$ = this.loadingService.isLoading$.pipe(
      startWith(false),
      observeOn(asyncScheduler),
    );

    this.updatePageFlags(this.router.url);
    this.router.events.pipe(
      filter((e): e is NavigationEnd => e instanceof NavigationEnd),
      takeUntil(this.destroy$)
    ).subscribe(e => this.updatePageFlags(e.urlAfterRedirects));

  }

  ngOnInit(): void {
    this._store.dispatch(loadUser());
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private updatePageFlags(url: string): void {
    this.isHomePage = url === '/' || url === '';
    this.isAdminPage = url.startsWith('/admin');
  }
}
