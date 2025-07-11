import { Pipe, PipeTransform } from '@angular/core';
import { defaultTo } from 'lodash';

@Pipe({
    name: 'booleanPipe',
})
export class BooleanDisplayPipe implements PipeTransform {
    public transform(boolean: string): string {
        return defaultTo(BooleanDictionary[boolean], '');
    }
}

const BooleanDictionary: Record<string, string> = {
    true: 'COMMONS.LEXICON.YES',
    false: 'COMMONS.LEXICON.NO',
};
