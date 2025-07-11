import { Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { TranslateModule } from '@ngx-translate/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-header',
    imports: [MatMenuModule, MatButtonModule, TranslateModule, RouterLink, RouterLinkActive, MatIconModule, MatTooltipModule, CommonModule],
    templateUrl: './header.component.html',
    styleUrl: './header.component.scss',
})
export class HeaderComponent {
    public languages = [
        { code: 'fr', label: 'Français' },
        { code: 'en', label: 'English' },
    ];
    public lang: string = 'fr';
}
