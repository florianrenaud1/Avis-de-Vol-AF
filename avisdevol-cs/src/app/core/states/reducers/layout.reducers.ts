import { ProgressBarMode } from '@angular/material/progress-bar';
import { createReducer, on } from '@ngrx/store';
import { ProgressState } from '@avisdevol-cs/core';

import { LayoutActions } from '../actions';

export interface State {
    lang: string;
    progress: ProgressState;
}

const initialState: State = {
    lang: '',
    progress: {
        mode: '' as ProgressBarMode,
        show: false,
    },
};

export const reducer = createReducer(
    initialState,
    on(LayoutActions.changeLanguage, (state: State, action: ReturnType<typeof LayoutActions.changeLanguage>) => ({
        ...state,
        lang: action.payload,
    })),
    on(LayoutActions.showProgress, (state: State, action: ReturnType<typeof LayoutActions.showProgress>) => ({
        ...state,
        progress: {
            mode: action.payload ?? initialState.progress.mode,
            percent: 1,
            show: true,
        },
    })),
    on(LayoutActions.updateProgress, (state: State, action: ReturnType<typeof LayoutActions.updateProgress>) => ({
        ...state,
        progress: {
            ...state.progress,
            percent: Math.floor(action.payload),
        },
    })),
    on(LayoutActions.dismissProgress, (state: State) => ({
        ...state,
        progress: {
            ...state.progress,
            percent: 0,
            show: false,
        },
    }))
);

export const getLanguage = (state: State): string => state.lang;
export const getProgressState = (state: State): ProgressState => state.progress;
