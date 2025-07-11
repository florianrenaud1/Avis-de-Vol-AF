import { createAction, props } from '@ngrx/store';
import { RatingFilters } from '@avisdevol-cs/shared';

export const search = createAction('[RatingsFilters] Ratings Filters During Search', props<RatingFilters>());
export const reset = createAction('[RatingsFilters] Reinitialising Ratings Form to its initial state');
