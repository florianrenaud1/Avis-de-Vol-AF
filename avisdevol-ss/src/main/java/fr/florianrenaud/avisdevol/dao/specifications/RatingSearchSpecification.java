package fr.florianrenaud.avisdevol.dao.specifications;

import java.time.LocalTime;
import java.util.HashSet;
import java.util.Objects;
import java.util.Set;

import org.apache.commons.lang3.StringUtils;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Component;

import fr.florianrenaud.avisdevol.business.enums.RatingStatus;
import fr.florianrenaud.avisdevol.business.resources.RatingFiltersResource;
import fr.florianrenaud.avisdevol.dao.entity.RatingEntity;
import fr.florianrenaud.avisdevol.utils.Helpers;
import jakarta.persistence.criteria.Predicate;
import jakarta.validation.constraints.NotNull;

/**
 * Specification for searching ratings based on various filters.
 */
@Component
public class RatingSearchSpecification {

	/**
	 * SQL request specification for a RatingEntity.
	 * @param filters RatingFiltersResource filters
	 * @return Corresponding criteria specifications
	 */
	public Specification<RatingEntity> getRatingSearch(@NotNull RatingFiltersResource filters) {
		return (root, query, criteriaBuilder) -> {

			Set<Predicate> predicates = new HashSet<>();
			
			// Filter by airline name - accessing the name property of the joined airline entity
			if (StringUtils.isNotBlank(filters.getAirline())) {
				predicates.add(criteriaBuilder.like(
					criteriaBuilder.lower(root.join("airline").get("name")), 
					Helpers.sqlContains(filters.getAirline().toLowerCase())
				));
			}
			
			// Filter by flight number
			if (StringUtils.isNotBlank(filters.getFlightNumber())) {
				predicates.add(criteriaBuilder.like(
					criteriaBuilder.lower(root.get("flightNumber")), 
					Helpers.sqlContains(filters.getFlightNumber().toLowerCase())
				));
			}
			
			// Filter by start date
			if (filters.getStartDate() != null) {
				predicates.add(criteriaBuilder.greaterThanOrEqualTo(
					root.get("createdAt"), 
					filters.getStartDate().atTime(LocalTime.MIDNIGHT)
				));
			}
			
			// Filter by end date
			if (filters.getEndDate() != null) {
				predicates.add(criteriaBuilder.lessThanOrEqualTo(
					root.get("createdAt"), 
					filters.getEndDate().atTime(LocalTime.MAX)
				));
			}
			
			// Filter by answered status
			if (filters.getAnswered() != null) {
				if (filters.getAnswered()) {
					predicates.add(criteriaBuilder.and(
						criteriaBuilder.isNotNull(root.get("answer")),
						criteriaBuilder.notEqual(root.get("answer"), "")
					));
				} else {
					predicates.add(criteriaBuilder.or(
						criteriaBuilder.isNull(root.get("answer")),
						criteriaBuilder.equal(root.get("answer"), "")
					));
				}
			}
			
			// Filter by status - ignore filter if status is ALL
			if (filters.getStatus() != null && filters.getStatus() != RatingStatus.ALL) {
				predicates.add(criteriaBuilder.equal(root.get("status"), filters.getStatus()));
			}
			
			return criteriaBuilder.and(predicates.stream().filter(Objects::nonNull).toArray(Predicate[]::new));
		};
	}
	}

