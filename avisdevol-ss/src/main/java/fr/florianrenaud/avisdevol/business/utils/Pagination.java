package fr.florianrenaud.avisdevol.business.utils;

import java.util.List;

/**
 * Generic class for pagination of domain model
 * @param <T> T is a Domain model type (can be ScalaUser, Company...)
 */
public record Pagination<T>(List<T> content, Integer totalElements, Pageable pageable) {
}
