import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { tap } from 'rxjs';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule, MatError } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { TranslateModule } from '@ngx-translate/core';
import { AuthenticationService } from '@avisdevol-cs/shared';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
    selector: 'app-create-account',
    templateUrl: './create-account.component.html',
    styleUrls: ['./create-account.component.scss'],
    imports: [ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatButtonModule, MatIconModule, MatError, TranslateModule],
})
export class CreateAccountComponent {
    private _formBuilder = inject(FormBuilder);
    private _authenticationService = inject(AuthenticationService);
    private _router = inject(Router);

    public createAccountGroup = this._formBuilder.group({
        username: ['', [Validators.required]],
        email: ['', [Validators.required, Validators.email]],
        password: ['', [Validators.required]],
    });

    createAccount() {
        const account = this.computeAccount();
        this._authenticationService
            .register(account)
            .pipe(
                tap(() => {
                    this.navigateToLogin();
                }),
                takeUntilDestroyed()
            )
            .subscribe();
    }

    private computeAccount() {
        return {
            username: this.createAccountGroup.controls.username.value,
            email: this.createAccountGroup.controls.email.value,
            password: this.createAccountGroup.controls.password.value,
        };
    }

    navigateToLogin() {
        this._router.navigate(['/login']);
    }
}
