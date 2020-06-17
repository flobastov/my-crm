import {Injectable} from "@angular/core";
import {
  ActivatedRouteSnapshot,
  CanActivate,
  CanActivateChild, Router,
  RouterStateSnapshot
} from "@angular/router";

import {Observable, of} from "rxjs";
import {AuthService} from "../services/auth.service";

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate, CanActivateChild {

  constructor(
    private _auth: AuthService,
    private _router: Router
  ) {
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
    if (this._auth.isAuthenticated()) {
      return of(true);
    } else {
      this._router.navigate(['/login'], {
        queryParams: {
          accessDenied: true
        }
      });
      return of(false);
    }
  }

  canActivateChild(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
    return this.canActivate(route, state);
  }

}
