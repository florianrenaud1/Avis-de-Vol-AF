package fr.florianrenaud.avisdevol.business.service;

import fr.florianrenaud.avisdevol.business.resources.AccountResources;
import java.util.Date;
import org.springframework.security.core.userdetails.UserDetails;

/**
 * Service interface for handling JWT (JSON Web Token) operations.
 * This service is responsible for generating, validating, and extracting information from JWT tokens.
 */
public interface JwtService {

	/**
	 * Generates a JWT token for the given user ID.
	 *
	 * @param user the account of the user
	 * @return the generated JWT token
	 */
	String generateToken(AccountResources user);

	/**
	 * Validates the given JWT token.
	 *
	 * @param token the JWT token to validate
	 * @return true if the token is valid, false otherwise
	 */
	boolean validateToken(String token);

	/**
	 * Extracts the user ID from the given JWT token.
	 *
	 * @param token the JWT token
	 * @return the user ID extracted from the token
	 */
	String extractUsername(String token);

	/**
	 * Extracts the expiration date from the given JWT token.
	 * @param token the JWT token
	 * @return the expiration date of the token
	 */
	boolean isTokenValid(String token, UserDetails userDetails);

}
