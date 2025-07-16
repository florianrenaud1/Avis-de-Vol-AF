import { Component, inject, output, signal, computed, OnInit } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { RouterLink, RouterLinkActive, Router, NavigationEnd } from '@angular/router';
import { CommonModule } from '@angular/common';
import { App, LayoutActions } from '../../states';
import { Store } from '@ngrx/store';
import { jwtDecode } from 'jwt-decode';
import { filter } from 'rxjs/operators';

@Component({
    selector: 'app-header',
    imports: [
        MatMenuModule,
        MatButtonModule,
        MatDividerModule,
        TranslateModule,
        RouterLink,
        RouterLinkActive,
        MatIconModule,
        MatTooltipModule,
        CommonModule,
    ],
    templateUrl: './header.component.html',
    styleUrl: './header.component.scss',
})
export class HeaderComponent implements OnInit {
    // Dependency injection.
    private readonly _store = inject(Store<App.State>);
    private readonly _translateService = inject(TranslateService);
    private readonly _router = inject(Router);

    // Outputs.
    public readonly toggleMenu = output<void>();

    // Signals pour gérer l'état de connexion
    public readonly isLoggedIn = signal<boolean>(false);
    public readonly username = signal<string>('');

    // Computed pour le texte du bouton de connexion
    public readonly loginButtonText = computed(() => {
        return this.isLoggedIn() ? this.username() : this._translateService.instant('COMMONS.HEADER.LOGIN');
    });

    // Computed pour l'icône du bouton de connexion
    public readonly loginButtonIcon = computed(() => {
        return this.isLoggedIn() ? 'person' : 'login';
    });

    ngOnInit(): void {
        this.checkAuthenticationStatus();

        this._router.events.pipe(filter(event => event instanceof NavigationEnd)).subscribe(() => {
            this.checkAuthenticationStatus();
        });

        window.addEventListener('storage', event => {
            if (event.key === 'jwtToken') {
                this.checkAuthenticationStatus();
            }
        });
    }

    /**
     * Récupère la langue actuelle
     */
    public get currentLanguage(): string {
        return this._translateService.currentLang?.toUpperCase() || 'FR';
    }

    /**
     * Vérifie l'état d'authentification au chargement du composant
     */
    private checkAuthenticationStatus(): void {
        const token = localStorage.getItem('jwtToken');
        if (token) {
            try {
                const payload: any = jwtDecode(token);
                // Vérifier que le token n'est pas expiré
                const currentTime = Date.now() / 1000;
                if (payload.exp && payload.exp > currentTime) {
                    this.isLoggedIn.set(true);
                    // Extraire le nom d'utilisateur du token
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
        this._router.navigateByUrl('/');
    }

    /**
     * Gère le clic sur le bouton de connexion/profil
     */
    public handleLoginClick(): void {
        if (this.isLoggedIn()) {
            // Si connecté, on peut soit aller au profil soit afficher un menu
            this._router.navigateByUrl('/dashboard');
        } else {
            // Si non connecté, aller à la page de connexion
            this._router.navigateByUrl('/login');
        }
    }

    /**
     * Change the language of the application
     * @param language The language to change to
     */
    public changeLanguage(language: string): void {
        this._store.dispatch(LayoutActions.changeLanguage({ payload: language }));
    }
}
