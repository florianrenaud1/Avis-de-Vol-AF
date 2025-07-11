import { createReducer, on } from '@ngrx/store';

import { PageActions } from '../actions';

export interface State {
    size: number;
}

const initialState: State = {
    size: 20,
};

export const reducer = createReducer(
    initialState,
    on(
        PageActions.changePageSize,
        (state: State, action: ReturnType<typeof PageActions.changePageSize>): State => ({
            ...state,
            size: action.payload,
        })
    )
);

export const getPageSize = (state: State): number => state.size;
