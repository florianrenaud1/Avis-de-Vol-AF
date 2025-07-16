// auth.actions.ts
import { createAction, props } from '@ngrx/store';

export const setUser = createAction('[User] Set Token', props<{ token: string }>());
export const clearToken = createAction('[User] Clear Token');
