import {Component, OnInit} from '@angular/core';
import {AuthService} from "./shared/services/auth.service";

@Component({
  selector: 'app-root',
  template: '<router-outlet></router-outlet>'
})
export class AppComponent implements OnInit {

  constructor(
    private _auth: AuthService
  ) {
  }

  ngOnInit(): void {
    const potentialToken: string = localStorage.getItem('token');
    if (potentialToken) {
      this._auth.setToken(potentialToken);
    }
  }

}
