import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { TranslateService } from '@ngx-translate/core';
import { LayoutActions } from '@avisdevol-cs/core';
import { distinctUntilChanged, map, tap } from 'rxjs/operators';

@Injectable()
export class LayoutEffects {
    // Dependency injection.
    private readonly _translateService = inject(TranslateService);
    private readonly _actions$ = inject(Actions);

    public readonly changeLangage$ = createEffect(
        () =>
            this._actions$.pipe(
                ofType(LayoutActions.changeLanguage),
                map((action: ReturnType<typeof LayoutActions.changeLanguage>) => action.payload),
                distinctUntilChanged(),
                tap((language: string) => this._translateService.use(language))
            ),
        { dispatch: false }
    );
}
