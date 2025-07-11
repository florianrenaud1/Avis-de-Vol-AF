package fr.florianrenaud.avisdevol.rest.exceptions;

import org.springframework.http.HttpStatus;

/**
 * Managed error types, translatable on frontend side.
 */
public enum RestErrorType {

	/** Internal server error. */
	INTERNAL_SERVER_ERROR(HttpStatus.INTERNAL_SERVER_ERROR, "COMMONS.ERROR.SERVER.INTERNAL_SERVER_ERROR"),
	/** User is not authorized to see/perform action for the requested resource. */
	FORBIDDEN(HttpStatus.FORBIDDEN, "COMMONS.ERROR.SERVER.FORBIDDEN"),
	UNPROCESSABLE_ENTITY(HttpStatus.UNPROCESSABLE_ENTITY, "COMMONS.ERROR.SERVER.UNPROCESSABLE_ENTITY");

	/** i18n key value to be used in frontend. */
	private final String i18nKey;

	/** Http status to return for this error. */
	private final HttpStatus status;

	/**
	 * The error message constructor.
	 * @param httpStatus
	 * @param i18nKey
	 */
	RestErrorType(HttpStatus httpStatus, String i18nKey) {
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
