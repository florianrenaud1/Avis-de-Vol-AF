package fr.florianrenaud.avisdevol.business.service.impl;

import fr.florianrenaud.avisdevol.business.utils.AvisDeVolException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.argon2.Argon2PasswordEncoder;
import org.springframework.stereotype.Service;

import fr.florianrenaud.avisdevol.business.resources.AccountResources;
import fr.florianrenaud.avisdevol.business.resources.JwtResource;
import fr.florianrenaud.avisdevol.business.enums.Role;
import fr.florianrenaud.avisdevol.business.service.AccountServices;
import fr.florianrenaud.avisdevol.dao.exceptions.InfrastructureErrorType;
import fr.florianrenaud.avisdevol.dao.exceptions.NotFoundException;
import fr.florianrenaud.avisdevol.dao.service.AccountService;

/**
 * Implementation of the AccountServices interface.
 */
@Service
public class AccountServicesImpl implements AccountServices {

	private static final Logger LOG = LoggerFactory.getLogger(AccountServicesImpl.class);

	private final AccountService accountService;
	private final JwtServiceImpl jwtServiceImpl;

	public AccountServicesImpl(AccountService accountService, JwtServiceImpl jwtServiceImpl) {
		this.accountService = accountService;
		this.jwtServiceImpl = jwtServiceImpl;
	}

	// Using Argon2PasswordEncoder
    Argon2PasswordEncoder encoder = new Argon2PasswordEncoder(32, 64, 1, 15 * 1024, 2);


	/**
	 * {@inheritDoc}
	 */
	@Override
    public void createUser(AccountResources account) {
		LOG.info("Creating user");
		account.setPassword(encoder.encode(account.getPassword()));
		account.setRole(Role.USER);
		this.accountService.createUser(account);
        
    }

	/**
	 * {@inheritDoc}
	 */
	@Override
    public JwtResource login(AccountResources account) throws AvisDeVolException {
		LOG.info("Logging in user");
        AccountResources accountResource = accountService.findUser(account.getEmail());
        if (accountResource == null) {
	        throw new NotFoundException(InfrastructureErrorType.USER_NOT_FOUND);
	    }
        
        var validPassword = encoder.matches(account.getPassword(), accountResource.getPassword());
	    if (!validPassword) {
				        LOG.error("Invalid credentials for user");
	        throw new AvisDeVolException("Invalid credentials");
	    }
	    
	    return new JwtResource(jwtServiceImpl.generateToken(accountResource));
        
    }
}
