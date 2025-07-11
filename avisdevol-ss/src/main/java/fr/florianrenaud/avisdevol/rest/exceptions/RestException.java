package fr.florianrenaud.avisdevol.rest.exceptions;

import fr.florianrenaud.avisdevol.business.utils.AvisDeVolException;
import org.apache.commons.lang3.StringUtils;

/**
 * Rest exception thrown by Rest Layer
 */
public class RestException extends AvisDeVolException {
	private final RestErrorType error;

	/**
	 * Constructs a new exception with the specified detail message.
	 * @param error the error type
	 */
	public RestException(RestErrorType error) {
		this(error, null);
	}

	/**
	 * Constructs a new exception with the specified detail message.
	 * @param error the error type
	 * @param message the detail message (optional). The detail message is saved for later retrieval by the {@link #getMessage()} method.
	 */
	public RestException(RestErrorType error, String message) {
		super(StringUtils.isNotBlank(message) ? message : error.name());
		this.error = error;
	}

	/**
	 * Constructs a new exception with the specified detail message and cause.
	 * @param error the error type
	 * @param message the detail message (optional)
	 * @param cause the cause (which is saved for later retrieval by the {@link #getCause()} method). (A <tt>null</tt> value is permitted, and indicates
	 *            that the cause is nonexistent or unknown.)
	 */
	public RestException(RestErrorType error, String message, Throwable cause) {
		super(StringUtils.isNotBlank(message) ? message : error.name(), cause);
		this.error = error;
	}

	/**
	 * Getter for error attribute.
	 * @return the error
	 */
	public RestErrorType getError() {
		return error;
	}
}
