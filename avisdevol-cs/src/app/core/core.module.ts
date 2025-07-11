import { STEPPER_GLOBAL_OPTIONS } from '@angular/cdk/stepper';
import { HTTP_INTERCEPTORS, provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { inject, NgModule } from '@angular/core';

import { HttpInterceptorService } from './interceptors/http.interceptor';

@NgModule({
    providers: [
        provideHttpClient(withInterceptorsFromDi()),
        {
            provide: STEPPER_GLOBAL_OPTIONS,
            useValue: { displayDefaultIndicatorType: false },
        },
        { multi: true, provide: HTTP_INTERCEPTORS, useClass: HttpInterceptorService },
    ],
})
export class CoreModule {
    public constructor() {
        const parentModule = inject(CoreModule, { optional: true, skipSelf: true });

        if (parentModule) {
            throw new Error('CoreModule is already loaded. Import it in the AppModule only');
        }
    }
}
