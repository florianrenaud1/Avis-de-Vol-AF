import { bootstrapApplication, BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { RouterModule, Routes } from '@angular/router';
import { TranslateLoader, TranslateModule, TranslateService } from '@ngx-translate/core';
import { Language } from './app/shared/enums/language.enum';
import { importProvidersFrom, APP_INITIALIZER } from '@angular/core';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { StoreRouterConnectingModule } from '@ngrx/router-store';
import { firstValueFrom } from 'rxjs';
import { App, CoreModule, LayoutEffects, MultiTranslateHttpLoader } from '@avisdevol-cs/core';
import { ratingsRoutes } from './app/features';

const appInitializerFactory = (translate: TranslateService) => {
    const locale = navigator.languages.includes(Language.FR) ? Language.FR : Language.EN;

    return (): Promise<any> => {
        translate.setDefaultLang(locale);
        return firstValueFrom(translate.use(locale));
    };
};

const createTranslateLoader = (): MultiTranslateHttpLoader => {
    const folders = ['commons', 'accessibility'];

    return new MultiTranslateHttpLoader(folders.map((folder: string) => ({ prefix: `./assets/i18n/${folder}/`, suffix: '.json' })));
};

const appRoutes: Routes = [
    { path: '', pathMatch: 'full', redirectTo: '/avis' },
    { path: 'avis', children: ratingsRoutes },
    {
        path: 'create',
        loadComponent: () => import('./app/features/rating/components/rating-create/rating-create.component').then(m => m.RatingCreateComponent),
    },
];

bootstrapApplication(AppComponent, {
    providers: [
        importProvidersFrom(
            RouterModule.forRoot(appRoutes),
            CoreModule,
            BrowserModule,
            TranslateModule.forRoot({
                loader: {
                    provide: TranslateLoader,
                    useFactory: createTranslateLoader,
                },
            }),
            StoreModule.forRoot(App.reducers, {
                metaReducers: [App.localStorageSyncReducer],
                runtimeChecks: {
                    strictActionImmutability: false,
                    strictStateImmutability: false,
                },
            }),
            StoreDevtoolsModule.instrument({
                maxAge: 5,
            }),
            EffectsModule.forRoot([LayoutEffects]),
            StoreRouterConnectingModule.forRoot({
                stateKey: 'router',
            })
            /*UserModule.forRoot({
                logoutUrl: `${environment.urlBackend}/logout`,
                url: `${environment.urlBackend}/me`,
            }),*/
            /*StoreModule.forRoot(App.reducers, {
                metaReducers: [App.localStorageSyncReducer],
                runtimeChecks: {
                    strictActionImmutability: false,
                    strictStateImmutability: false,
                },
            }),*/
            /*StoreDevtoolsModule.instrument({
                maxAge: 5,
            }),*/
            /*EffectsModule.forRoot([LayoutEffects, UserEffects]),
            StoreRouterConnectingModule.forRoot({
                stateKey: 'router',
            })*/
        ),
        {
            provide: APP_INITIALIZER,
            useFactory: appInitializerFactory,
            deps: [TranslateService],
            multi: true,
        },
    ],
}).catch(err => console.error(err));
