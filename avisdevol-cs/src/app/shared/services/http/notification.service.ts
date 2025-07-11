import { inject, Injectable } from '@angular/core';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';
import { TranslateService } from '@ngx-translate/core';
import { take, tap } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class NotificationService {
    // Dependency injection.
    private readonly _matSnackbar = inject(MatSnackBar);
    private readonly _translateService = inject(TranslateService);

    public displayInfo(translationKey: string): void {
        const snackBarConfig: MatSnackBarConfig = { panelClass: 'style-info' };
        this._openSnackBar(snackBarConfig, translationKey);
    }

    public displaySuccess(translationKey: string): void {
        const snackBarConfig: MatSnackBarConfig = { panelClass: 'style-success' };
        this._openSnackBar(snackBarConfig, translationKey);
    }

    public displayWarning(translationKey: string): void {
        const snackBarConfig: MatSnackBarConfig = { duration: 8000, panelClass: 'style-warning' };
        this._openSnackBar(snackBarConfig, translationKey);
    }

    public displayError(translationKey: string): void {
        const snackBarConfig: MatSnackBarConfig = { duration: 10000, panelClass: 'style-error' };
        this._openSnackBar(snackBarConfig, translationKey);
    }

    private _openSnackBar(snackBarConfig: MatSnackBarConfig, translationKey: string): void {
        this._translateService
            .get(translationKey)
            .pipe(
                tap((message: string) =>
                    this._matSnackbar.open(message, 'x', {
                        duration: 5000,
                        horizontalPosition: 'end', // 'start' | 'center' | 'end' | 'left' | 'right'
                        verticalPosition: 'bottom', // 'top' | 'bottom'
                        ...snackBarConfig,
                    })
                ),
                take(1)
            )
            .subscribe();
    }
}
