import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
//import { NotificationService } from '@refex-adm/shared';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';

@Injectable()
export class HttpInterceptorService implements HttpInterceptor {
    // Dependency injection.
    //private readonly _store = inject(Store<App.State>);
    //rivate readonly _notificationService = inject(NotificationService);

    public intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        this._showProgress(request);
        return next.handle(request).pipe(
            catchError((response: HttpErrorResponse) => {
                // Hide progress
                this._hideProgress(request);
                // Show error notif
                //this._notificationService.displayError(this._getErrorMessage(response));
                return throwError(() => response);
            }),
            tap((event: HttpEvent<any>) => {
                if (event instanceof HttpResponse) {
                    this._hideProgress(request);
                }
            })
        );
    }

    private _showProgress(request: HttpRequest<any>): void {
        if (!request.headers.has('ignoreProgress')) {
            //this._store.dispatch(LayoutActions.showProgress());
        }
    }

    private _hideProgress(request: HttpRequest<any>): void {
        if (!request.headers.has('ignoreProgress')) {
            //this._store.dispatch(LayoutActions.dismissProgress());
        }
    }

    private _getErrorMessage(response: HttpErrorResponse): string {
        switch (response.status) {
            // Siteminder expired session case
            case 0:
                return 'COMMONS.ERROR.SERVER.SESSION_EXPIRED';
            // PingAccess expired session case
            case 401:
                return 'COMMONS.ERROR.SERVER.SESSION_EXPIRED';
            // Access denied case
            case 403:
                return 'COMMONS.ERROR.SERVER.FORBIDDEN';
            // Standard managed error message
            default:
                return response.error?.message ?? response.message;
        }
    }
}
