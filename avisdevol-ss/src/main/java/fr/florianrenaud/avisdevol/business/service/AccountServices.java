package fr.florianrenaud.avisdevol.business.service;

import fr.florianrenaud.avisdevol.business.utils.AvisDeVolException;
import org.springframework.stereotype.Service;

import fr.florianrenaud.avisdevol.business.resources.AccountResources;
import fr.florianrenaud.avisdevol.business.resources.JwtResource;
import fr.florianrenaud.avisdevol.dao.exceptions.NotFoundException;

/**
 * Service interface for account management.
 */
public interface AccountServices {

    /**
     * Creates a new user account.
     *
     * @param user the account resources containing user details
     */
    void createUser(AccountResources user);

    /**
     * Retrieves a user account .
     * @param accountResources the account of the user
     * @return the account resources for the specified user
     * @throws NotFoundException if the user account is not found
     */
    JwtResource login(AccountResources accountResources) throws AvisDeVolException;
}
