import { createReducer, on } from '@ngrx/store';
import { RatingFilters } from '@avisdevol-cs/shared';

import * as RatingsActions from '../actions/ratings.actions';

export interface State {
    ratingFiltersForm: RatingFilters;
}

export const initialState: State = {
    ratingFiltersForm: {},
};

export const reducer = createReducer(
    initialState,
    on(
        RatingsActions.search,
        (state: State, ratingFiltersForm: RatingFilters): State => ({
            ...state,
            ratingFiltersForm,
        })
    ),
    on(RatingsActions.reset, (): State => initialState)
);

export const getFilters = (state: State): RatingFilters => state?.ratingFiltersForm;
