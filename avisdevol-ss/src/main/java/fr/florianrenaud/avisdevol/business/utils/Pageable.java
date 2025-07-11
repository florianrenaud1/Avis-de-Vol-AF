package fr.florianrenaud.avisdevol.business.utils;

/**
 * Used in Pagination object to provide data about Pages like number, size...
 */
public record Pageable(Integer pageNumber, Integer pageSize) {
}
