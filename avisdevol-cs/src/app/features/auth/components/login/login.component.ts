import { Component, inject, OnInit, computed, signal, DestroyRef } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import { tap } from 'rxjs';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { TranslateModule } from '@ngx-translate/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatError } from '@angular/material/form-field';
import { RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { AuthenticationService, NotificationService } from '@avisdevol-cs/shared';
import { App } from '@avisdevol-cs/core';
import { jwtDecode } from 'jwt-decode';
import { setUser } from '../../../../core/states/actions/user.actions';
import { TranslateService } from '@ngx-translate/core';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss'],
    imports: [
        MatSnackBarModule,
        MatButtonModule,
        MatCheckboxModule,
        TranslateModule,
        ReactiveFormsModule,
        MatFormFieldModule,
        MatInputModule,
        MatError,
        RouterModule,
        MatIconModule,
    ],
})
export class LoginComponent implements OnInit {
    private readonly _route = inject(Router);
    private readonly _activatedRoute = inject(ActivatedRoute);
    private readonly _formBuilder = inject(FormBuilder);
    private readonly _store = inject(Store<App.State>);
    private readonly _authenticateService = inject(AuthenticationService);
    private readonly _notificationService = inject(NotificationService);
    private readonly _translateService = inject(TranslateService);
    private readonly _destroyRef = inject(DestroyRef);

    // Signals pour gérer l'état de connexion
    public readonly isLoggedIn = signal<boolean>(false);
    public readonly username = signal<string>('');

    // URL de retour après connexion
    private returnUrl = '/';

    // Computed pour vérifier l'état de connexion
    public readonly loginButtonText = computed(() => {
        return this.isLoggedIn() ? `${this.username()}` : 'COMMONS.HEADER.LOGIN';
    });

    ngOnInit(): void {
        this.checkAuthenticationStatus();
        this.handleQueryParams();
    }

    public connexionGroup = this._formBuilder.group({
        email: ['', [Validators.required, Validators.email]],
        password: ['', [Validators.required]],
    });

    //public user2: Signal<User> = this.store.selectSignal(App.getUser);

    /**
     * Gère les paramètres de requête (URL de retour, messages d'erreur, etc.)
     */
    private handleQueryParams(): void {
        this._activatedRoute.queryParams.subscribe(params => {
            // Récupérer l'URL de retour
            this.returnUrl = params['returnUrl'] || '/';

            // Afficher des messages selon les paramètres
            if (params['expired'] === 'true') {
                this._notificationService.displayWarning(this._translateService.instant('COMMONS.CONNEXIONPAGE.SESSION_EXPIRED'));
            }

            if (params['error'] === 'invalid_token') {
                this._notificationService.displayError(this._translateService.instant('COMMONS.CONNEXIONPAGE.INVALID_TOKEN'));
            }

            if (params['returnUrl']) {
                this._notificationService.displayInfo(this._translateService.instant('COMMONS.CONNEXIONPAGE.LOGIN_REQUIRED'));
            }
        });
    }

    /**
     * Vérifie l'état d'authentification au chargement du composant
     */
    private checkAuthenticationStatus(): void {
        const token = localStorage.getItem('jwtToken');
        if (token) {
            try {
                const payload: any = jwtDecode(token); // Utiliser any pour accéder à toutes les propriétés
                // Vérifier que le token n'est pas expiré
                const currentTime = Date.now() / 1000;
                if (payload.exp && payload.exp > currentTime) {
                    this.isLoggedIn.set(true);
                    // Extraire le nom d'utilisateur du token (peut être dans sub, email, ou name selon votre JWT)
                    this.username.set(payload.sub || payload.email || payload.username || 'Utilisateur');
                } else {
                    // Token expiré, le supprimer
                    this.logout();
                }
            } catch (error) {
                console.error('Erreur lors du décodage du token:', error);
                this.logout();
            }
        }
    }

    /**
     * Déconnecte l'utilisateur
     */
    public logout(): void {
        localStorage.removeItem('jwtToken');
        this.isLoggedIn.set(false);
        this.username.set('');
        this._route.navigateByUrl('/');
    }

    public connexion() {
        const credentials = this.computeCredentials();
        this._authenticateService
            .login(credentials)
            .pipe(
                tap(response => {
                    const payload: any = jwtDecode(response.token);
                    localStorage.setItem('jwtToken', response.token);

                    this.isLoggedIn.set(true);
                    this.username.set(payload.sub || payload.email || payload.username || 'Utilisateur');

                    this._store.dispatch(setUser({ token: payload.sub }));

                    // Rediriger vers l'URL de retour ou la page d'accueil
                    this._route.navigateByUrl(this.returnUrl);
                })
            )
            .subscribe();
    }

    private computeCredentials() {
        return {
            email: this.connexionGroup.controls.email.value,
            password: this.connexionGroup.controls.password.value,
        };
    }
}
