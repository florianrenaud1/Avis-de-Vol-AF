package fr.florianrenaud.avisdevol.dao.specifications;

import java.time.LocalTime;
import java.util.HashSet;
import java.util.Objects;
import java.util.Set;

import org.apache.commons.lang3.StringUtils;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Component;

import fr.florianrenaud.avisdevol.business.resources.RatingFiltersResource;
import fr.florianrenaud.avisdevol.dao.entity.RatingEntity;
import fr.florianrenaud.avisdevol.utils.Helpers;
import jakarta.persistence.criteria.Predicate;
import jakarta.validation.constraints.NotNull;

@Component
public class RatingSearchSpecification {

	/**
	 * SQL request specification for a RatingEntity.
	 * @param filters RatingFiltersResource filters
	 * @return Corresponding criteria specifications
	 */
	public Specification<RatingEntity> getRatingSearch(@NotNull RatingFiltersResource filters) {
		return (root, query, criteriaBuilder) -> {
			// Only apply distinct for count queries or when not ordering
				//query.distinct(true);
			

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
					// Si answered = true, on veut les ratings qui ont une réponse (answer != null et answer != "")
					predicates.add(criteriaBuilder.and(
						criteriaBuilder.isNotNull(root.get("answer")),
						criteriaBuilder.notEqual(root.get("answer"), "")
					));
				} else {
					// Si answered = false, on veut les ratings sans réponse (answer == null ou answer == "")
					predicates.add(criteriaBuilder.or(
						criteriaBuilder.isNull(root.get("answer")),
						criteriaBuilder.equal(root.get("answer"), "")
					));
				}
			}
			
			// Filter by status
			if (filters.getStatus() != null) {
				predicates.add(criteriaBuilder.equal(root.get("status"), filters.getStatus()));
			}

			return criteriaBuilder.and(predicates.stream().filter(Objects::nonNull).toArray(Predicate[]::new));
		};
	}
	}

