export interface Pageable<T> {
    content: T[];
    totalElements: number;
    totalPages: number;
    number: number;
    numberOfElements: number;
    pageable?: {
        pageNumber: number;
        pageSize: number;
    };
}
