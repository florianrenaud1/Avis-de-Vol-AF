import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { select, Store } from '@ngrx/store';
import { App } from '@avisdevol-cs/core';
import { BehaviorSubject, catchError, map, Observable, of, switchMap, take } from 'rxjs';

import { Pageable } from '../models/global/global.model';

export type DataLoaderCallback<T, F> = (
    filters: F,
    pageIndex: number,
    pageSize: number,
    sortCol: string,
    sortDirection: string
) => Observable<Pageable<T>>;

export class ObservableDataSource<T, F> extends MatTableDataSource<T> {
    private readonly _dataSubject = new BehaviorSubject<T[]>([]);

    public constructor(
        private readonly _store: Store<App.State>,
        private readonly _dataLoader?: DataLoaderCallback<T, F>
    ) {
        super();
    }
    public exportFilters: F | undefined;
    public override connect(): BehaviorSubject<T[]> {
        return this._dataSubject;
    }

    public override disconnect(): void {
        this._dataSubject.complete();
    }

    public loadData(filters: F, resetPagination = false): void {
        if (this._dataLoader) {
            this._store
                .pipe(
                    select(App.getPageSize),
                    take(1),
                    map((pageSizeStored: number) => this.paginator?.pageSize ?? pageSizeStored),
                    switchMap((pageSize: number) => {
                        if (resetPagination) {
                            (this.paginator as MatPaginator).pageIndex = 0;
                        }
                        this.exportFilters = filters;
                        return (this._dataLoader as DataLoaderCallback<T, F>)(
                            filters,
                            this.paginator?.pageIndex as number,
                            pageSize,
                            this.sort?.active as string,
                            this.sort?.direction as string
                        ).pipe(
                            catchError(() => {
                                (this.paginator as MatPaginator).length = 0;
                                return of({
                                    content: [],
                                    number: 0,
                                    numberOfElements: 0,
                                    pageable: { pageNumber: 0, pageSize },
                                    totalElements: 0,
                                    totalPages: 0,
                                });
                            })
                        );
                    }),
                    map((pageableData: Pageable<T>) => {
                        (this.paginator as MatPaginator).pageIndex = pageableData.number;
                        (this.paginator as MatPaginator).length = pageableData.totalElements;
                        return pageableData.content;
                    })
                )
                .subscribe((data: T[]) => {
                    this._dataSubject.next(data);
                });
        }
    }
}
