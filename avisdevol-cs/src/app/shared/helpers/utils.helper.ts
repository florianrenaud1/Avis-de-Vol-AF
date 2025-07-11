import { HttpParams } from '@angular/common/http';

/**
 * Trim all attributes of an object and remove null, undefined or empty attributes.
 * /!\ This function is not iterrative (does not clean subobjets).
 * @param obj json object to clean
 * @returns Cleaned object
 */
export function trimAndCleanObject<T extends Record<string, any>>(obj: T): Partial<T> {
    if (obj) {
        return Object.keys(obj)
            .filter(key => isNotBlank(obj[key]))
            .reduce((result: Partial<T>, key: keyof T) => ({ ...result, [key]: trimAny(obj[key]) }), {});
    }
    return obj;
}

/**
 * Check value is not undefined, null, blank or empty.
 * @param value Value to test
 * @returns True if not undefined, null, blank nor empty.
 */
export function isNotBlank<T>(value: T): boolean {
    return value !== undefined && value !== null && trimAny(value) !== '';
}

/**
 * Trim value if input type is string.
 * @param value Value to test
 * @returns Trimed string or value
 */
export function trimAny<T>(value: any): T {
    return value?.trim?.() ?? value;
}

/**
 * Convert an object to HttpParams.
 * @param object Object to convert
 * @returns HttpParams instance
 */
export function objectToHttpParams(object: object): HttpParams {
    let httpParams = new HttpParams();
    if (object) {
        for (const [key, value] of Object.entries(object)) {
            httpParams = httpParams.append(key, value);
        }
    }
    return httpParams;
}
