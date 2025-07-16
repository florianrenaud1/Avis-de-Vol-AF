package fr.florianrenaud.avisdevol.rest.controllers;

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
import fr.florianrenaud.avisdevol.business.resources.JwtRessource;
import fr.florianrenaud.avisdevol.business.service.AccountServices;
import fr.florianrenaud.avisdevol.dao.exceptions.NotFoundException;

@RestController
@CrossOrigin(origins = "http://localhost:4200")
@RequestMapping("/rest/auth")
public class AuthenticationController {

    private static final Logger logger = LoggerFactory.getLogger(AuthenticationController.class);

    @Autowired
    AccountServices accountServices;

    @PostMapping(value = "/register")
	public void register(@RequestBody AccountResources account) throws URISyntaxException, IOException {
    	this.accountServices.createUser(account);

	}

	@PostMapping(value = "/login")
	public JwtRessource login(@RequestBody AccountResources requestAccount) throws URISyntaxException, IOException, NotFoundException {
	    return this.accountServices.login(requestAccount);
	}
   
}
