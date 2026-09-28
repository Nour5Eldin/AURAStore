import { Injectable } from "@angular/core";
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor, HttpErrorResponse } from "@angular/common/http";
import { Observable, throwError } from "rxjs";
import { catchError } from "rxjs/operators";
import { NotificationService } from "../services/notification.service";
import { Router } from "@angular/router";

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {

  constructor( private notification: NotificationService, private router: Router ) { }

  intercept(
    req: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {

    return next.handle(req).pipe(
      catchError((error: HttpErrorResponse) => {

        const message = error.error?.message || "Something went wrong.";

        switch (error.status) {
          case 400:
            this.notification.error(message);
            break;

          case 401:
            break;

          case 403:
            this.notification.error("You don't have permission to do this.");
            this.router.navigate(["/"]);
            break;

          case 404:
            this.notification.error(message || "Resource not found.");
            break;

          case 422:
            const errors = error.error?.errors;
            if (errors?.length) {
              this.notification.error(errors[0].message);
            }
            break;

          case 500:
            this.notification.error("Server error. Please try again later.");
            break;

          default:
            this.notification.error("Network error. Check your connection.");
        }

        return throwError(() => error);
      })
    );
  }
}