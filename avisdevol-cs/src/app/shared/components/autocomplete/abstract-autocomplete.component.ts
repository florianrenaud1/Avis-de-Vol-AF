import { Directive, input, viewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatAutocompleteTrigger } from '@angular/material/autocomplete';
import { debounceTime, distinctUntilChanged, merge, Observable, shareReplay, startWith, Subject, switchMap } from 'rxjs';

@Directive()
export abstract class AbstractAutocompleteComponent<T> {
    // Inputs.
    public readonly control = input.required<FormControl>();
    public readonly allowFreeText = input<boolean>(true);

    // ViewChilds.
    protected readonly autocompleteTrigger = viewChild.required<MatAutocompleteTrigger>('autocompleteTrigger');

    // Observables.
    private readonly _clearAutocompleteOptions$$ = new Subject<void>();

    /**
     * Clears the input when leaving it if free text is not allowed.
     * @param event the blur event emitted by the input
     */
    public onBlur(event: Event): void {
        event.stopPropagation();
        if (typeof this.control().value === 'string') {
            this.control().setValue(this.formatControlValue(), { emitEvent: false });
        }
        if (!this.allowFreeText()) {
            this._clearAutocompleteOptions$$.next();
        }
    }

    /**
     * Returns the name of the form control field that will be used to display the formatted value in the input.
     * @returns the name of the form control field
     */
    protected abstract getFormatControlFieldName(): string;

    /**
     * If the form control's value is a string, turn it into a search item.
     * It is separated from the onBlur function so that it can be overriden for custom formating of the string value.
     */
    protected formatControlValue(): T | undefined {
        return this.allowFreeText() && this.control().value ? ({ [this.getFormatControlFieldName()]: this.control().value.trim() } as T) : undefined;
    }

    /**
     * Closes the dropdown if the enter key is pressed to validate the value.
     * @param event keydown event emitted by the input
     */
    public onKeydownEnter(event: Event): void {
        this.onBlur(event);
        this.autocompleteTrigger().closePanel();
    }

    /**
     * Create an observable plugged on the control's valueChanges to retrieve results when the control's value changes.
     * @param callback arrow function in which the service to retrieve the results is called
     * @returns an observable that emits the array of objects retrieved in the callback
     */
    protected valueChanges(callback: (value: string | T) => Observable<T[]>): Observable<T[]> {
        return merge(this._clearAutocompleteOptions$$, this.control().valueChanges).pipe(
            debounceTime(400),
            distinctUntilChanged(),
            switchMap(callback),
            shareReplay({ bufferSize: 1, refCount: true }),
            startWith([])
        );
    }
}
