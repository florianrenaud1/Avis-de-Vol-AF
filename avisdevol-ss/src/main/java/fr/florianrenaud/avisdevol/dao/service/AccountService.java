package fr.florianrenaud.avisdevol.dao.service;

import fr.florianrenaud.avisdevol.business.resources.AccountResources;

/**
 * Service interface to manage user accounts.
 * Provides methods to find and create user accounts.
 */
public interface AccountService {

	/**
	 * Finds a user account by email.
	 * @param email the email of the user to find
	 * @return the AccountResources object representing the user, or null if not found
	 */
	AccountResources findUser(String email);

	/**
	 * Creates a new user account.
	 * @param account the AccountResources object containing user details to create
	 */
	void createUser(AccountResources account);
	

}
