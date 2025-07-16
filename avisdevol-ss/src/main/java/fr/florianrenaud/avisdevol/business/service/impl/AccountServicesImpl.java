package fr.florianrenaud.avisdevol.business.service.impl;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.argon2.Argon2PasswordEncoder;
import org.springframework.stereotype.Service;

import fr.florianrenaud.avisdevol.business.resources.AccountResources;
import fr.florianrenaud.avisdevol.business.resources.JwtRessource;
import fr.florianrenaud.avisdevol.business.resources.Role;
import fr.florianrenaud.avisdevol.business.service.AccountServices;
import fr.florianrenaud.avisdevol.config.JwtService;
import fr.florianrenaud.avisdevol.dao.exceptions.InfrastructureErrorType;
import fr.florianrenaud.avisdevol.dao.exceptions.NotFoundException;
import fr.florianrenaud.avisdevol.dao.service.AccountService;


@Service
public class AccountServicesImpl implements AccountServices {
	
	@Autowired
	private AccountService accountService;	
	
    @Autowired
    private JwtService jwtService;
	
    Argon2PasswordEncoder encoder = new Argon2PasswordEncoder(32, 64, 1, 15 * 1024, 2);

	
	@Override
    public void createUser(AccountResources account) {
		account.setPassword(encoder.encode(account.getPassword()));
		account.setRole(Role.USER);
		this.accountService.createUser(account);
        
    }
    
	@Override
    public JwtRessource login(AccountResources account) throws NotFoundException {
        AccountResources accountResource = accountService.findUser(account.getEmail());
        if (accountResource == null) {
	        throw new NotFoundException(InfrastructureErrorType.USER_NOT_FOUND);
	    }
        
        var validPassword = encoder.matches(account.getPassword(), accountResource.getPassword());
	    if (!validPassword) {
	        throw new RuntimeException("Invalid credentials");
	    }
	    
	    return new JwtRessource(jwtService.generateToken(accountResource));
        
    }
}
