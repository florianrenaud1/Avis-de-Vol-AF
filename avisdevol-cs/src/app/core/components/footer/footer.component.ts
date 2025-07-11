import { Component } from '@angular/core';
import pkg from '../../../../../package.json';
import { TranslateModule } from '@ngx-translate/core';

@Component({
    selector: 'app-footer',
    imports: [TranslateModule],
    styleUrl: './footer.component.scss',
    templateUrl: './footer.component.html',
})
export class FooterComponent {
    public readonly version = pkg.version;
}
