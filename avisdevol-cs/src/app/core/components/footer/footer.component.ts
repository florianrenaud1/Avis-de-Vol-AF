import { Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import pkg from '../../../../../package.json';
import { TranslateModule } from '@ngx-translate/core';

@Component({
    selector: 'app-footer',
    imports: [TranslateModule, MatIconModule],
    styleUrl: './footer.component.scss',
    templateUrl: './footer.component.html',
})
export class FooterComponent {
    public readonly version = pkg.version;
    public readonly currentYear = new Date().getFullYear();
}
