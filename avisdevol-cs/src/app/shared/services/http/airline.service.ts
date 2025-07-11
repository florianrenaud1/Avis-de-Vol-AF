import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { AbstractHttpService } from './abstract-http.service';
import { Airline } from '../../models';
import { objectToHttpParams } from '../../helpers';

@Injectable({ providedIn: 'root' })
export class AirlineService extends AbstractHttpService<Airline, number> {
    public constructor() {
        super('/api/rest/airline');
    }

    public getAirlinesByName(name: string): Observable<Airline[]> {
        const params = objectToHttpParams({ name });
        const url = `${this.servicePath}`;
        this.httpClient.get<Airline[]>(url, { params }).subscribe({
            next: airlines => console.log('Airlines fetched successfully:', airlines),
            error: error => console.error('Error fetching airlines:', error),
        });
        return this.httpClient.get<Airline[]>(url, { params });
    }
}
