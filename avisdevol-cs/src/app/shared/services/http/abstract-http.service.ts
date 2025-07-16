import { HttpClient } from '@angular/common/http';
import { inject } from '@angular/core';
import { Observable } from 'rxjs';
import { trimAndCleanObject } from '../../helpers';

export abstract class AbstractHttpService<T extends Record<string, any>, I> {
    // Dependency injection.
    protected readonly httpClient = inject(HttpClient);

    // Properties.
    protected servicePath: string;

    public constructor(servicePath: string) {
        this.servicePath = `${servicePath}`;
    }

    public getOne(id: I): Observable<T> {
        const url = `${this.servicePath}/${id}`;
        return this.httpClient.get<T>(url);
    }

    public create(data: T): Observable<T> {
        const url = `${this.servicePath}/add`;
        return this.httpClient.post<T>(url, trimAndCleanObject(data));
    }

    public update(id: I, data: T): Observable<T> {
        const url = `${this.servicePath}/${id}`;
        return this.httpClient.put<T>(url, trimAndCleanObject(data));
    }

    public delete(id: I): Observable<I> {
        const url = `${this.servicePath}/${id}`;
        return this.httpClient.delete<I>(url);
    }
}
