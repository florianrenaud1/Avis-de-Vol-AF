package fr.florianrenaud.avisdevol.dao.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import fr.florianrenaud.avisdevol.dao.entity.AccountEntity;

/**
 * Repository interface for managing AccountEntity instances.
 * Provides methods to find accounts by email.
 */
@Repository
public interface AccountRepository extends JpaRepository<AccountEntity, Integer> {

	/**
	 * Finds the first AccountEntity by email, ignoring case.
	 * @param email the email to search for
	 * @return the first AccountEntity with the specified email, or null if none found
	 */
	AccountEntity findOneByEmailIgnoreCaseContaining(String email);

}
