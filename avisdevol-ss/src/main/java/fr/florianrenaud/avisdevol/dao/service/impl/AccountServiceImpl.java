package fr.florianrenaud.avisdevol.dao.service.impl;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import fr.florianrenaud.avisdevol.business.mapper.AccountMapper;
import fr.florianrenaud.avisdevol.business.resources.AccountResources;
import fr.florianrenaud.avisdevol.dao.repository.AccountRepository;
import fr.florianrenaud.avisdevol.dao.service.AccountService;

/**
 * Service implementation for managing user accounts.
 */
@Service
public class AccountServiceImpl implements AccountService {
	
	private final AccountRepository accountRepository;
	private final AccountMapper accountMapper;

	/**
	 * Constructor for AccountServiceImpl.
	 * @param accountRepository the repository for account operations
	 * @param accountMapper the mapper for converting between entity and resource
	 */
	public AccountServiceImpl(AccountRepository accountRepository, AccountMapper accountMapper) {
		this.accountRepository = accountRepository;
		this.accountMapper = accountMapper;
	}

	/**
	 * {@inheritDoc}
	 */
	@Override
	public AccountResources findUser(String email) {
		return this.accountMapper.accountEntityToAccountResource(accountRepository.findOneByEmailIgnoreCaseContaining(email));
	}

	/**
	 * {@inheritDoc}
	 */
	@Override
	public void createUser(AccountResources account) {
		accountRepository.save(this.accountMapper.accountResourceToAccountEntity(account));
	}

}
