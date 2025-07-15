package fr.florianrenaud.avisdevol.business.utils;

import java.util.List;

/**
 * Generic class for pagination of domain model
 * @param <T> the type of the content in the pagination
 */
public record Pagination<T>(List<T> content, Integer totalElements, Pageable pageable) {
}
