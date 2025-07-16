import { createReducer, on } from '@ngrx/store';
import { setUser, clearToken } from '../actions/user.actions';
export interface State {
    token: string | null;
}

export const initialState: State = {
    token: typeof window !== 'undefined' ? localStorage.getItem('jwtToken') : null,
};

export const reducer = createReducer(
    initialState,
    on(setUser, (state, { token }) => ({ ...state, token })),
    on(clearToken, state => ({ ...state, token: null }))
);
