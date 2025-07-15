import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from './core/components/header/header.component';
import { FooterComponent } from './core/components/footer/footer.component';

@Component({
    selector: 'app-root',
    imports: [HeaderComponent, RouterOutlet, FooterComponent],
    templateUrl: './app.component.html',
})
export class AppComponent {
    title = 'avisdevol-cs';
}
