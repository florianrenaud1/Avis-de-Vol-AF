import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { AbstractHttpService } from './abstract-http.service';
import { Pageable, Rating, RatingFilters, RatingForCreation } from '../../models';
import { RatingStatus } from '../../enums';
import { objectToHttpParams, trimAndCleanObject } from '../../helpers';
import { trim } from 'lodash';

@Injectable({ providedIn: 'root' })
export class RatingService extends AbstractHttpService<Rating, number> {
    public constructor() {
        super('/api/rest/rating');
    }

    public search(filters: Partial<RatingFilters>, page: number, size: number, col: string, direction: string): Observable<Pageable<Rating>> {
        const params = objectToHttpParams({ col, direction, page, size });
        const url = `${this.servicePath}/search`;
        return this.httpClient.post<Pageable<Rating>>(url, filters, { params });
    }

    public createRating(data: RatingForCreation): Observable<RatingForCreation> {
        const url = `${this.servicePath}/add`;
        return this.httpClient.post<RatingForCreation>(url, trimAndCleanObject(data));
    }

    public addAnswer(id: string, answer: string): Observable<void> {
        const url = `${this.servicePath}/answer/${id}`;
        return this.httpClient.put<void>(url, trim(answer));
    }

    /**
     * Met à jour le statut d'un avis
     */
    public updateStatus(id: string, status: RatingStatus): Observable<void> {
        const url = `${this.servicePath}/status/${id}`;
        return this.httpClient.put<void>(url, status);
    }
}
