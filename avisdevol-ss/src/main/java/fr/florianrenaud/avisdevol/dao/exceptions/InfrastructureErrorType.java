package fr.florianrenaud.avisdevol.dao.exceptions;

import org.springframework.http.HttpStatus;

/**
 * Managed infrastructure error types
 */
public enum InfrastructureErrorType {

	/* Airline not found */
	AIRLINE_NOT_FOUND(HttpStatus.NOT_FOUND, "COMMONS.ERROR.SERVER.AIRLINE_NOT_FOUND"),
	RATING_NOT_FOUND(HttpStatus.NOT_FOUND, "COMMONS.ERROR.SERVER.RATING_NOT_FOUND"),

	;


	/** i18n key value. */
	private final String i18nKey;

	/** Http status to return for this error. */
	private final HttpStatus status;

	/**
	 * The error message constructor.
	 * @param httpStatus httpStatus
	 * @param i18nKey i18nKey
	 */
	InfrastructureErrorType(HttpStatus httpStatus, String i18nKey) {
		this.status = httpStatus;
		this.i18nKey = i18nKey;
	}

	/**
	 * Get the error message i18n key value.
	 * @return the error message i18n key value.
	 */
	public String getI18nKey() {
		return this.i18nKey;
	}

	/**
	 * Getter for status attribute.
	 * @return the status
	 */
	public HttpStatus getStatus() {
		return this.status;
	}

}
