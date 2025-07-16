package fr.florianrenaud.avisdevol.dao.service.impl;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import fr.florianrenaud.avisdevol.business.mapper.AccountMapper;
import fr.florianrenaud.avisdevol.business.resources.AccountResources;
import fr.florianrenaud.avisdevol.dao.repository.AccountRepository;
import fr.florianrenaud.avisdevol.dao.service.AccountService;

@Service
public class AccountServiceImpl implements AccountService {
	
	@Autowired
	private AccountRepository accountRepository;
	
	@Autowired
	private AccountMapper accountMapper;
	
	public AccountResources findUser(String email) {
		return this.accountMapper.accountEntityToAccountResource(accountRepository.findOneByEmailIgnoreCaseContaining(email));
	}

	@Override
	public void createUser(AccountResources account) {
		accountRepository.save(this.accountMapper.accountResourceToAccountEntity(account));
	}

}
