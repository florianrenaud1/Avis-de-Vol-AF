package fr.florianrenaud.avisdevol.rest.validators;

import static fr.florianrenaud.avisdevol.rest.exceptions.RestErrorType.UNPROCESSABLE_ENTITY;

import java.time.LocalDate;
import java.time.format.DateTimeParseException;

import org.apache.commons.lang3.ObjectUtils;
import org.apache.commons.lang3.StringUtils;

import fr.florianrenaud.avisdevol.business.resources.RatingResource;
import fr.florianrenaud.avisdevol.rest.exceptions.RestException;


/**
 * Validator of Rating for create or update actions.
 */
public final class RatingValidator {
	/**
	 * Default constructor.
	 */
	private RatingValidator() {

	}
	/**
	 * Validates the RatingResource for creating or updating a rating.
	 *
	 * @param ratingResource the RatingResource to validate
	 * @throws RestException if validation fails
	 */
	public static void validateRatingResource(RatingResource ratingResource) throws RestException {
		if (StringUtils.isEmpty(ratingResource.getFlightNumber()) || ratingResource.getFlightNumber().matches("^[A-Za-z]{2}\\\\d{4,12}$")) {
			throw new RestException(UNPROCESSABLE_ENTITY);
		}
		// Validation de la compagnie aérienne
		if (ObjectUtils.isEmpty(ratingResource.getAirline())) {
			throw new RestException(UNPROCESSABLE_ENTITY);
		}
		// Validation de la date
		if (ratingResource.getDate() != null) {
			try {
				if (ratingResource.getDate().isAfter(LocalDate.now())) {
					throw new RestException(UNPROCESSABLE_ENTITY);
				}
			} catch (DateTimeParseException e) {
				throw new RestException(UNPROCESSABLE_ENTITY);
			}
		} else {
			throw new RestException(UNPROCESSABLE_ENTITY);
		}

		// Validation de la note
		if (ratingResource.getRating() == null ||
				ratingResource.getRating() < 1 ||
				ratingResource.getRating() > 5) {
			throw new RestException(UNPROCESSABLE_ENTITY);
		}

		// Validation du commentaire
		if (StringUtils.isEmpty(ratingResource.getComments()) ||
				ratingResource.getComments().length() > 500) {
			throw new RestException(UNPROCESSABLE_ENTITY);
		}
	}
}
