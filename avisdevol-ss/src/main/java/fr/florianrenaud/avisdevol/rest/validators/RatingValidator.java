package fr.florianrenaud.avisdevol.rest.validators;

import static fr.florianrenaud.avisdevol.rest.exceptions.RestErrorType.UNPROCESSABLE_ENTITY;

import fr.florianrenaud.avisdevol.rest.controllers.RatingController;
import java.time.LocalDate;
import java.time.format.DateTimeParseException;

import org.apache.commons.lang3.ObjectUtils;
import org.apache.commons.lang3.StringUtils;

import fr.florianrenaud.avisdevol.business.resources.RatingResource;
import fr.florianrenaud.avisdevol.rest.exceptions.RestException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

/**
 * Validator of Rating for create or update actions.
 */
public final class RatingValidator {

	private static final Logger LOG = LoggerFactory.getLogger(RatingValidator.class);

	/**
	 * Default constructor.
	 */
	private RatingValidator() {}
	/**
	 * Validates the RatingResource for creating or updating a rating.
	 *
	 * @param ratingResource the RatingResource to validate
	 * @throws RestException if validation fails
	 */
	public static void validateRatingResource(RatingResource ratingResource) throws RestException {
		if (StringUtils.isEmpty(ratingResource.getFlightNumber()) || ratingResource.getFlightNumber().matches("^[A-Za-z]{2}\\\\d{4,12}$")) {
			LOG.error("Invalid flight number: {}", ratingResource.getFlightNumber());
			throw new RestException(UNPROCESSABLE_ENTITY);
		}
		// Validation de la compagnie aérienne
		if (ObjectUtils.isEmpty(ratingResource.getAirline())) {
			LOG.error("Airline is empty or null");
			throw new RestException(UNPROCESSABLE_ENTITY);
		}
		// Validation de la date
		if (ratingResource.getDate() != null) {
			try {
				if (ratingResource.getDate().isAfter(LocalDate.now())) {
					LOG.error("Rating date is in the future: {}", ratingResource.getDate());
					throw new RestException(UNPROCESSABLE_ENTITY);
				}
			} catch (DateTimeParseException e) {
				LOG.error("Invalid date format: {}", ratingResource.getDate(), e);
				throw new RestException(UNPROCESSABLE_ENTITY);
			}
		} else {
			LOG.error("Rating date is null");
			throw new RestException(UNPROCESSABLE_ENTITY);
		}

		// Validation de la note
		if (ratingResource.getRating() == null ||
				ratingResource.getRating() < 1 ||
				ratingResource.getRating() > 5) {
			LOG.error("Invalid rating value: {}", ratingResource.getRating());
			throw new RestException(UNPROCESSABLE_ENTITY);
		}

		// Validation du commentaire
		if (StringUtils.isEmpty(ratingResource.getComments()) ||
				ratingResource.getComments().length() > 500) {
			LOG.error("Invalid comments: {}", ratingResource.getComments());
			throw new RestException(UNPROCESSABLE_ENTITY);
		}
	}
}
