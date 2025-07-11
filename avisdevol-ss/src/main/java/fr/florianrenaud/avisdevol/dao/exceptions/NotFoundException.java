package fr.florianrenaud.avisdevol.dao.exceptions;

import java.io.Serial;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

/**
 * Exception to handle case where entity is not found
 */
@ResponseStatus(code = HttpStatus.NOT_FOUND)
public class NotFoundException extends InfrastructureException {
	@Serial
	private static final long serialVersionUID = -9211513295855963844L;

	/**
	 * Constructs a new exception with the specified detail message.
	 * @param error the error type
	 */
	public NotFoundException(InfrastructureErrorType error) {
		super(error);
	}
}
