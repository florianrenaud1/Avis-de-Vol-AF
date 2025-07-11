import { createAction } from '@ngrx/store';

export const changePageSize = createAction('[Page] change page size', (payload: number) => ({ payload }));
