import { ProgressBarMode } from '@angular/material/progress-bar';

export interface ProgressState {
    show: boolean;
    percent?: number;
    mode: ProgressBarMode;
}
