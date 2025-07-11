import { ActionReducer, ActionReducerMap, createFeatureSelector, createSelector } from '@ngrx/store';
import { LocalStorageConfig, localStorageSync } from 'ngrx-store-localstorage';

import * as RatingForm from './ratings.reducers';
import * as Layout from './layout.reducers';
import * as Page from './page.reducers';

/**
 * As mentioned, we treat each reducer like a table in a database. This means
 * our top level state interface is just a map of keys to inner state types.
 */
export interface State {
    layout: Layout.State;
    ratings: RatingForm.State;
    page: Page.State;
}

/**
 * Our state is composed of a map of action reducer functions.
 * These reducer functions are called with each dispatched action
 * and the current or initial state and return a new immutable state.
 */
export const reducers: ActionReducerMap<State> = {
    layout: Layout.reducer,
    ratings: RatingForm.reducer,
    page: Page.reducer,
};

/**
 * Configure local storage synchronisation.
 * @param reducer
 */
export function localStorageSyncReducer(reducer: ActionReducer<any>): ActionReducer<any> {
    const config: LocalStorageConfig = {
        keys: [{ layout: ['lang'] }],
        rehydrate: true,
        removeOnUndefined: true,
    };
    return localStorageSync(config)(reducer);
}

/**
 * Layout Reducers
 */
export const getLayoutState = createFeatureSelector<Layout.State>('layout');
export const getLanguage = createSelector(getLayoutState, Layout.getLanguage);
export const getProgressState = createSelector(getLayoutState, Layout.getProgressState);

/**
 * ratings reducers
 */
export const getRatingFormState = createFeatureSelector<RatingForm.State>('ratings');
export const getRatingFormFiltersState = createSelector(getRatingFormState, RatingForm.getFilters);

// Page selectors.
export const getPageState = createFeatureSelector<Page.State>('page');
export const getPageSize = createSelector(getPageState, Page.getPageSize);
