import { Pipe, PipeTransform } from '@angular/core';

import { dateFormatTransform } from '../helpers/pipe-transforms';

@Pipe({
    name: 'dateFormat',
})
export class DateFormatPipe implements PipeTransform {
    public readonly transform = dateFormatTransform;
}
