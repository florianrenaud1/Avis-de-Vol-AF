import { Component, inject, input } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { MatTooltip } from '@angular/material/tooltip';
import { Router } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

@Component({
    imports: [MatButton, MatIcon, MatTooltip, TranslateModule],
    selector: 'app-page-title',
    templateUrl: './page-title.component.html',
})
export class PageTitleComponent {
    // Dependency injection.
    private readonly _router = inject(Router);

    // Inputs.
    public readonly icon = input<string>('');
    public readonly label = input<string>('');
    public readonly params = input<object>({});
    public readonly buttonBack = input<boolean>(false);
    public readonly urlBack = input<string>('');
    public readonly infoTooltip = input<string>('');

    /**
     * Redirect to given url if any.
     */
    public redirectToBackUrl(): void {
        if (this.urlBack()) {
            this._router.navigateByUrl(this.urlBack());
        }
    }
}
