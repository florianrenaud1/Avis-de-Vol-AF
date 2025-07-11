import moment from 'moment';

type AllowedDateType = Date | moment.Moment | string | number | null | undefined;

export function dateFormatTransform(value: AllowedDateType): string | undefined {
    // Use the utc method in order to have the same date whatever the value format is
    if (moment.isDate(value) || moment.isMoment(value) || typeof value === 'number') {
        return moment(value).format('YYYY-MM-DD');
    } else if (typeof value === 'string') {
        const date = moment(value, moment.ISO_8601);
        return date.isValid() ? date.format('YYYY-MM-DD') : value;
    }
    return undefined;
}
