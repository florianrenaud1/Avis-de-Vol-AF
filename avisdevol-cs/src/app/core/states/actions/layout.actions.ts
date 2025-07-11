import { createAction, props } from '@ngrx/store';
import { ProgressMode } from '@avisdevol-cs/core';

export const changeLanguage = createAction('[Layout] Change language', props<{ payload: string }>());
export const showProgress = createAction('[Progress] Display progress bar', (progressMode?: ProgressMode) => ({ payload: progressMode }));
export const updateProgress = createAction('[Progress] Increment progress bar', props<{ payload: number }>());
export const dismissProgress = createAction('[Progress] Hide progress bar');
export const ResetFilters = createAction('[Menu] Reset search filters on moving to anoter page');
