import {Injectable} from "@angular/core";
import {HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from "@angular/common/http";
import {Observable, throwError} from "rxjs";
import {catchError} from "rxjs/operators";

import {AuthService} from "../services/auth.service";
import {Router} from "@angular/router";

@Injectable()
export class TokenInterceptor implements HttpInterceptor {

  constructor(
    private _auth: AuthService,
    private _router: Router
  ) {
  }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (this._auth.isAuthenticated()) {
      req = req.clone({
        setHeaders: {
          Authorization: this._auth.getToken()
        }
      });
    }
    return next.handle(req).pipe(
      catchError((errorResponse: HttpErrorResponse) => {
        return this._handleAuthError(errorResponse);
      })
    );
  }

  private _handleAuthError(errorResponse: HttpErrorResponse): Observable<any> {
    if (errorResponse.status === 401) {
      this._router.navigate(['/login'], {
        queryParams: {
          sessionFailed: true
        }
      })
    }

    return throwError(errorResponse);
  }

}
