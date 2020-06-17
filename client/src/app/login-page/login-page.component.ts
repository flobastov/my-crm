import {Component, OnDestroy, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {HttpErrorResponse} from "@angular/common/http";
import {AuthService} from "../shared/services/auth.service";
import {finalize} from "rxjs/operators";
import {Subscription} from "rxjs";
import {ActivatedRoute, Params, Router} from "@angular/router";
import {MateialService} from "../shared/classes/mateial.service";

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.scss']
})
export class LoginPageComponent implements OnInit, OnDestroy {

  public form: FormGroup;
  private _aSub: Subscription;

  constructor(
    private _auth: AuthService,
    private _router: Router,
    private _route: ActivatedRoute,
  ) {
  }

  ngOnInit(): void {
    this.form = new FormGroup({
      email: new FormControl(null, [Validators.required, Validators.email]),
      password: new FormControl(null, [Validators.required, Validators.minLength(6)]),
    });

    this._route.queryParams.subscribe((params: Params) => {
      if (params['registered']) {
        MateialService.toast('Регистрация прошла успешно.');
      } else if (params['accessDenied']) {
        MateialService.toast('Авторизуйтесь в системе.');
      } else if (params['sessionFailed']) {
        MateialService.toast('Пожалуйста войдите в систему заново.');
      }
    });
  }

  ngOnDestroy(): void {
    if (this._aSub) {
      this._aSub.unsubscribe();
    }
  }

  public onSubmit(): void {
    this.form.disable();
    this._aSub = this._auth.login(this.form.value)
      .pipe(finalize(() => {
        this.form.enable();
      }))
      .subscribe((response) => {
        this._router.navigate(['/overview']);
      }, (errorResponse: HttpErrorResponse) => {
        MateialService.toast(errorResponse.error.message);
      });
  }

}
