package fr.florianrenaud.avisdevol.dao.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import fr.florianrenaud.avisdevol.dao.entity.AccountEntity;

@Repository
public interface AccountRepository extends JpaRepository<AccountEntity, Integer> {

	AccountEntity findOneByEmailIgnoreCaseContaining(String email);

}
