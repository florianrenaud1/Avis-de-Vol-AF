import { Pipe, PipeTransform } from '@angular/core';

export const truncateTransform = (value: string, args: any[] = []): string => {
    const parsedLimit = parseInt(args[0], 10);
    const limit = isNaN(parsedLimit) ? 20 : parsedLimit;
    const trail = args.length > 1 ? args[1] : '...';

    return value.length > limit ? value.substring(0, limit) + trail : value;
};

@Pipe({ name: 'appTruncate' })
export class TruncatePipe implements PipeTransform {
    public readonly transform = truncateTransform;
}
