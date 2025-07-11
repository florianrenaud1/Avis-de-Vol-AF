package fr.florianrenaud.avisdevol.dao.exceptions;

import fr.florianrenaud.avisdevol.business.utils.AvisDeVolException;
import org.apache.commons.lang3.StringUtils;

/**
 * Manage exceptions for the infrastructure layer
 */
public class InfrastructureException extends AvisDeVolException {

	/** Error details to be sent . */
	private final InfrastructureErrorType error;

	/**
	 * Constructs a new exception with the specified detail message.
	 * @param error the error type
	 */
	public InfrastructureException(InfrastructureErrorType error) {
		this(error, null);
	}

	/**
	 * Constructs a new exception with the specified detail message.
	 * @param error the error type
	 * @param message the detail message (optional). The detail message is saved for later retrieval by the {@link #getMessage()} method.
	 */
	public InfrastructureException(InfrastructureErrorType error, String message) {
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
	public InfrastructureException(InfrastructureErrorType error, String message, Throwable cause) {
		super(StringUtils.isNotBlank(message) ? message : error.name(), cause);
		this.error = error;
	}

	/**
	 * Getter for error attribute.
	 * @return the error
	 */
	public InfrastructureErrorType getError() {
		return error;
	}
}
