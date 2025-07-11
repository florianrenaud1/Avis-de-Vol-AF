import { Component, inject, output } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';
import { App, LayoutActions } from '../../states';
import { Store } from '@ngrx/store';

@Component({
    selector: 'app-header',
    imports: [MatMenuModule, MatButtonModule, TranslateModule, RouterLink, RouterLinkActive, MatIconModule, MatTooltipModule, CommonModule],
    templateUrl: './header.component.html',
    styleUrl: './header.component.scss',
})
export class HeaderComponent {
    // Dependency injection.
    private readonly _store = inject(Store<App.State>);
    private readonly _translateService = inject(TranslateService);

    // Outputs.
    public readonly toggleMenu = output<void>();

    /**
     * Récupère la langue actuelle
     */
    public get currentLanguage(): string {
        return this._translateService.currentLang?.toUpperCase() || 'FR';
    }

    public changeLanguage(language: string): void {
        this._store.dispatch(LayoutActions.changeLanguage({ payload: language }));
    }
}
