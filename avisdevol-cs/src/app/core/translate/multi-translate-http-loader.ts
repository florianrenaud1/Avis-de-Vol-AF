import { HttpClient } from '@angular/common/http';
import { inject } from '@angular/core';
import { TranslateLoader } from '@ngx-translate/core';
import { forkJoin, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

interface TranslateResource {
    prefix: string;
    suffix: string;
}

export class MultiTranslateHttpLoader implements TranslateLoader {
    // Dependency injection.
    private readonly _httpClient = inject(HttpClient);

    public constructor(private readonly _translateResources: TranslateResource[]) {}

    public getTranslation(lang: string): Observable<object> {
        return forkJoin(
            this._translateResources.map((translateResource: TranslateResource) =>
                this._httpClient.get(`${translateResource.prefix}${lang}${translateResource.suffix}`)
            )
        ).pipe(
            map((translations: object[]): object =>
                translations.reduce((previous: object, current: object): object => ({ ...previous, ...current }), {})
            )
        );
    }
}
