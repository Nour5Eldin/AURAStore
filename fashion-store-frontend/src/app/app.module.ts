import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule, HTTP_INTERCEPTORS, provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { App } from './app';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { reducers } from './store/app.state';
import { AuthEffects } from './store/auth/auth.effects';
import { CartEffects } from './store/cart/cart.effects';
import { LayoutModule } from './layout/layout.module';
import { SharedModule } from './shared/shared.module';
import { provideToastr } from 'ngx-toastr';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { ErrorInterceptor } from './core/interceptors/error.interceptor';
import { LoadingInterceptor } from './core/interceptors/loading.interceptor';
import { CommonModule } from '@angular/common';
import { AuthHttpInterceptor, AuthModule } from '@auth0/auth0-angular';
import { environment } from './environments/environment';

@NgModule({
  declarations: [App],
  imports: [
    CommonModule,
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    LayoutModule,
    SharedModule,
    AuthModule.forRoot({
      domain: environment.auth0.domain,
      clientId: environment.auth0.clientId,
      authorizationParams: {
        redirect_uri: window.location.origin,
        audience: environment.auth0.audience,
      },
      httpInterceptor: {
        allowedList: [{
          uri: `${environment.apiUrl}/*`,
          tokenOptions: {
            authorizationParams: { audience: environment.auth0.audience },
          },
        }],
      },
    }),
    StoreModule.forRoot(reducers),
    EffectsModule.forRoot([AuthEffects, CartEffects]),
  ],
  providers: [
    provideAnimationsAsync(),
    provideToastr({
      timeOut: 3000,
      positionClass: 'toast-top-right',
      preventDuplicates: true,
    }),
    provideHttpClient(withInterceptorsFromDi()),
    { provide: HTTP_INTERCEPTORS, useClass: AuthHttpInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: LoadingInterceptor, multi: true },
  ],
  bootstrap: [App],
})
export class AppModule { }
