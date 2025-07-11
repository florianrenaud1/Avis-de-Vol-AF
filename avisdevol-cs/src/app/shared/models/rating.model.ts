import { Moment } from 'moment';
import { Airline } from './airline.model';
import { RatingStatus } from '../enums/rating-status.enum';

export interface Rating {
    id?: string;
    flightNumber: string;
    date: Date;
    airline: Airline;
    rating: number;
    comments?: string;
    createdAt: Date;
    updatedAt: Date;
    answer?: string;
    status?: RatingStatus;
}

export interface RatingFilters {
    airline?: string;
    flightNumber?: string;
    startDate?: Moment;
    endDate?: Moment;
    answered?: boolean;
    status?: RatingStatus;
}

export interface RatingForCreation {
    id?: string;
    flightNumber: string;
    date: Date;
    airline: Airline;
    rating: number;
    comments?: string;
    createdAt: Date;
    updatedAt: Date;
    answer?: string;
}
