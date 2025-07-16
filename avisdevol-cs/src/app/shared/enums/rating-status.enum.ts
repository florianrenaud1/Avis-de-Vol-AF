/**
 * Enum representing the status of a rating.
 */
export enum RatingStatus {
    /**
     * All statuses (for filtering)
     */
    ALL = 'ALL',

    /**
     * Rating has been processed
     */
    PROCESSED = 'PROCESSED',

    /**
     * Rating has been published
     */
    PUBLISHED = 'PUBLISHED',

    /**
     * Rating has been rejected
     */
    REJECTED = 'REJECTED',
}

/**
 * Options for the rating status select
 */
export const RATING_STATUS_OPTIONS = [
    {
        value: RatingStatus.ALL,
        label: 'COMMONS.SELECT.ALL',
        color: 'text-gray-600',
        bgColor: 'bg-gray-100',
        textColor: 'text-gray-800',
        borderColor: 'border-gray-200',
        dotColor: 'bg-gray-600',
    },
    {
        value: RatingStatus.PROCESSED,
        label: 'COMMONS.STATUS.PROCESSED',
        color: 'text-green-600',
        bgColor: 'bg-green-100',
        textColor: 'text-green-800',
        borderColor: 'border-green-200',
        dotColor: 'bg-green-600',
    },
    {
        value: RatingStatus.PUBLISHED,
        label: 'COMMONS.STATUS.PUBLISHED',
        color: 'text-blue-600',
        bgColor: 'bg-blue-100',
        textColor: 'text-blue-800',
        borderColor: 'border-blue-200',
        dotColor: 'bg-blue-600',
    },
    {
        value: RatingStatus.REJECTED,
        label: 'COMMONS.STATUS.REJECTED',
        color: 'text-red-600',
        bgColor: 'bg-red-100',
        textColor: 'text-red-800',
        borderColor: 'border-red-200',
        dotColor: 'bg-red-600',
    },
];
