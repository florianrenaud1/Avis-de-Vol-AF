package fr.florianrenaud.avisdevol.business.utils;

import java.io.Serial;

/**
 * Common exception class inherited by different exceptions in different layers of the project.
 */
public class AvisDeVolException extends Exception {

	/** Serial UID. */
	@Serial
	private static final long serialVersionUID = -3354404202453600034L;

	/**
	 * Constructs a new exception with the specified detail message.
	 * @param message the detail message. The detail message is saved for later retrieval by the {@link #getMessage()} method.
	 */
	public AvisDeVolException(String message) {
		super(message);
	}

	/**
	 * Constructs a new exception with the specified detail message and cause.
	 * @param message the detail message (which is saved for later retrieval by the {@link #getMessage()} method).
	 * @param cause the cause (which is saved for later retrieval by the {@link #getCause()} method). (A <tt>null</tt> value is permitted, and indicates
	 *            that the cause is nonexistent or unknown.)
	 */
	public AvisDeVolException(String message, Throwable cause) {
		super(message, cause);
	}

	/**
	 * Constructs a new exception with the specified cause and a detail message.
	 * @param cause the cause (which is saved for later retrieval by the {@link #getCause()} method). (A <tt>null</tt> value is permitted, and indicates
	 *            that the cause is nonexistent or unknown.)
	 */
	public AvisDeVolException(Throwable cause) {
		super(cause);
	}
}
