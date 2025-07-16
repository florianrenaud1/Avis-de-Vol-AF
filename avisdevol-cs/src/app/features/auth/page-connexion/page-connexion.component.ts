import { Component, inject, OnInit } from '@angular/core';
import {FormBuilder, Validators} from '@angular/forms';
import {Router} from '@angular/router';
import { Store } from '@ngrx/store';
import { tap, catchError } from 'rxjs';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { TranslateModule } from "@ngx-translate/core";
import { ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatError } from '@angular/material/form-field';
import { RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { AuthenticationService, JwtPayload, NotificationService } from '@avisdevol-cs/shared';
import { App } from '@avisdevol-cs/core';
import { jwtDecode } from 'jwt-decode';
import { setUser } from '../../../core/states/actions/user.actions';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';



@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  imports: [MatSnackBarModule,MatButtonModule, MatCheckboxModule, TranslateModule, ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatError, RouterModule, MatIconModule],
})
export class LoginComponent {

      private readonly _route = inject(Router);
      private readonly _formBuilder = inject(FormBuilder);
  private readonly _store = inject(Store<App.State>);
  private readonly _authenticateService = inject(AuthenticationService);
  private readonly _notificationService = inject(NotificationService);

  constructor(
  ) { }

  public connexionGroup = this._formBuilder.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required]],
  })

  //public user2: Signal<User> = this.store.selectSignal(App.getUser);

connexion() {
    let register = {
      "email": this.connexionGroup.controls.email.value,
      "password": this.connexionGroup.controls.password.value
    }

    this._authenticateService.login(register).pipe(
      tap(response => {
        const payloadRole: JwtPayload = jwtDecode(response.token);
        console.log(payloadRole.role);
        localStorage.setItem('jwtToken', response.token);
        const payload: JwtPayload = JSON.parse(atob(response.token.split('.')[1]));
        this._store.dispatch(setUser({ token: payload.sub }));
        this._route.navigateByUrl("/");
        this._notificationService.displaySuccess('Connexion réussie ! Bienvenue.');
      }),
      takeUntilDestroyed()
    ).subscribe();
  }


}
