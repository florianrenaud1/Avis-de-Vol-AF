import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { HeaderComponent } from './core/components/header/header.component';
import { FooterComponent } from './core/components/footer/footer.component';

@Component({
    selector: 'app-root',
    imports: [HeaderComponent, RouterOutlet, FooterComponent, TranslateModule],
    templateUrl: './app.component.html',
})
export class AppComponent {
    title = 'avisdevol-cs';
}
