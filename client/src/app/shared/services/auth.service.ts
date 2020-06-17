import {Injectable} from "@angular/core";
import {User} from "../interfaces";
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {tap} from "rxjs/operators";

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private _token: string = null;

  constructor(
    private _http: HttpClient
  ) {
  }

  public register(user: User): Observable<User> {
    return this._http.post<User>('/api/auth/register', user);
  }

  public login(user: User): Observable<{ token: string }> {
    return this._http.post<{ token: string }>('/api/auth/login', user)
      .pipe(tap(({token}) => {
        localStorage.setItem('auth-token', token);
        this.setToken(token);
      }));
  }

  public setToken(token: string): void {
    this._token = token;
  }

  public getToken(): string {
    return this._token;
  }

  public isAuthenticated(): boolean {
    return !!this._token;
  }

  public logout(): void {
    this.setToken(null);
    localStorage.clear();
  }

}
