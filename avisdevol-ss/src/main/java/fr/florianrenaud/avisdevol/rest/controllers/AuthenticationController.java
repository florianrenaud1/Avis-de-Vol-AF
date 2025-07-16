package fr.florianrenaud.avisdevol.rest.controllers;

import fr.florianrenaud.avisdevol.business.utils.AvisDeVolException;
import java.io.IOException;
import java.net.URISyntaxException;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import fr.florianrenaud.avisdevol.business.resources.AccountResources;
import fr.florianrenaud.avisdevol.business.resources.JwtResource;
import fr.florianrenaud.avisdevol.business.service.AccountServices;
import fr.florianrenaud.avisdevol.dao.exceptions.NotFoundException;

/**
 * Controller for handling authentication requests.
 * Provides endpoints for user registration and login.
 */
@RestController
@CrossOrigin(origins = "http://localhost:4200")
@RequestMapping("/rest/auth")
public class AuthenticationController {

	private static final Logger LOG = LoggerFactory.getLogger(AuthenticationController.class);

	private final AccountServices accountServices;

	/**
	 * Constructor.
	 * @param accountServices the account services
	 */
	public AuthenticationController(AccountServices accountServices) {
		this.accountServices = accountServices;
	}

    @PostMapping(value = "/register")
	public void register(@RequestBody AccountResources account) {
		LOG.info("Registering user: {}", account.getUsername());
    	this.accountServices.createUser(account);

	}

	@PostMapping(value = "/login")
	public JwtResource login(@RequestBody AccountResources requestAccount) throws AvisDeVolException {
		LOG.info("Logging in user: {}", requestAccount.getUsername());
	    return this.accountServices.login(requestAccount);
	}
   
}
