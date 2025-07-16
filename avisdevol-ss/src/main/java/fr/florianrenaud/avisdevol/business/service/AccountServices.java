package fr.florianrenaud.avisdevol.business.service;

import org.springframework.stereotype.Service;

import fr.florianrenaud.avisdevol.business.resources.AccountResources;
import fr.florianrenaud.avisdevol.business.resources.JwtRessource;
import fr.florianrenaud.avisdevol.dao.exceptions.NotFoundException;



@Service
public interface AccountServices {
	
    public void createUser(AccountResources user);

    public JwtRessource login(AccountResources accountResources) throws NotFoundException;
}
