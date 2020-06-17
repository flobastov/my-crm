import {Component, OnDestroy, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {finalize} from "rxjs/operators";
import {HttpErrorResponse} from "@angular/common/http";
import {AuthService} from "../shared/services/auth.service";
import {Subscription} from "rxjs";
import {ActivatedRoute, Router} from "@angular/router";
import {MateialService} from "../shared/classes/mateial.service";

@Component({
  selector: 'app-register-page',
  templateUrl: './register-page.component.html',
  styleUrls: ['./register-page.component.scss']
})
export class RegisterPageComponent implements OnInit, OnDestroy {

  public form: FormGroup;
  private _aSub: Subscription;

  constructor(
    private _auth: AuthService,
    private _router: Router,
    private _route: ActivatedRoute
  ) {

  }

  ngOnInit(): void {
    this.form = new FormGroup({
      email: new FormControl(null, [Validators.required, Validators.email]),
      password: new FormControl(null, [Validators.required, Validators.minLength(6)]),
    });
  }

  ngOnDestroy(): void {
    if (this._aSub) {
      this._aSub.unsubscribe();
    }
  }

  public onSubmit(): void {
    this.form.disable();
    this._aSub = this._auth.register(this.form.value)
      .pipe(finalize(() => {
        this.form.enable();
      }))
      .subscribe((response) => {
          this._router.navigate(['/login'], {
            queryParams: {
              registered: true
            }
          });
        },
        (errorResponse: HttpErrorResponse) => {
          MateialService.toast(errorResponse.error.message);
        });
  }

}
