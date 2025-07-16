package fr.florianrenaud.avisdevol.dao.service;

import fr.florianrenaud.avisdevol.business.resources.AccountResources;

public interface AccountService {
	
	public AccountResources findUser(String email);
	
	public void createUser(AccountResources account);
	

}
