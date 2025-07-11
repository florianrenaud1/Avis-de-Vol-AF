import { DestroyRef, Directive, inject, viewChild } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { select, Store } from '@ngrx/store';
import { App, PageActions } from '@avisdevol-cs/core';
import { merge, Observable, tap, withLatestFrom } from 'rxjs';

import { DataLoaderCallback, ObservableDataSource } from './observable.datasource';

@Directive({ standalone: true })
export class AbstractListComponent<T, F> {
    // Dependency injection.
    protected readonly store = inject(Store<App.State>);
    protected readonly destroyRef = inject(DestroyRef);

    // Properties.
    public paginator = viewChild<MatPaginator>(MatPaginator);
    public sort = viewChild<MatSort>(MatSort);

    // Local properties.
    public dataSource: ObservableDataSource<T, F>;
    public pageSizeOptions = [10, 20, 50];
    public displayedColumns: string[] = [];

    // Observables.
    public pageSize$: Observable<number>;

    public constructor() {
        this.pageSize$ = this.store.pipe(select(App.getPageSize));
        this.dataSource = new ObservableDataSource<T, F>(this.store);
    }

    /**
     * Propagates change page size in the store.
     * @param $event change page event
     */
    public onPageChange($event: any): void {
        this.store.dispatch(PageActions.changePageSize($event.pageSize));
    }

    /**
     * Init table data source for given data without Loading
     * @param data Data to display
     */
    protected initDatasource(dataLoader: DataLoaderCallback<T, F>, filters$: Observable<F>): void {
        this.dataSource = new ObservableDataSource(this.store, dataLoader);
        this.dataSource.paginator = this.paginator() ?? null;
        this.dataSource.sort = this.sort() ?? null;
        this.initSortAndPaginator(filters$);
    }

    /**
     * Init sort behaviour for data table.
     * Must be called in ngOnInit.
     */
    protected initSortAndPaginator(filters$: Observable<F>): void {
        // If the user changes the sort order, reset back to the first page.
        this.sort()
            ?.sortChange.pipe(
                tap(() => {
                    if (this.paginator()) {
                        (this.paginator() as MatPaginator).pageIndex = 0;
                    }
                }),
                takeUntilDestroyed(this.destroyRef)
            )
            .subscribe();

        merge(this.sort()?.sortChange ?? [], this.paginator()?.page ?? [])
            .pipe(
                withLatestFrom(filters$),
                tap(([, filters]) => this.dataSource.loadData(filters)),
                takeUntilDestroyed(this.destroyRef)
            )
            .subscribe();

        // Hide pagination tooltips
        // const paginatorIntl = this.paginator()?._intl;
        // if (paginatorIntl) {
        //     paginatorIntl.firstPageLabel = '';
        //     paginatorIntl.nextPageLabel = '';
        //     paginatorIntl.lastPageLabel = '';
        //     paginatorIntl.previousPageLabel = '';
        // }
    }
}
