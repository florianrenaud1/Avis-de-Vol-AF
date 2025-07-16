package fr.florianrenaud.avisdevol.business.mapper;

import org.mapstruct.Mapper;
import org.springframework.stereotype.Component;

import fr.florianrenaud.avisdevol.business.resources.AccountResources;
import fr.florianrenaud.avisdevol.dao.entity.AccountEntity;

/**
 * Mapper interface for converting between AccountEntity and AccountResources.
 */
@Mapper(componentModel = "spring")
@Component
public interface AccountMapper {
	
	/** * Converts an AccountEntity to an AccountResources.
	 * @param entity the AccountEntity to convert
	 * @return the converted AccountResources
	 */	
	AccountResources accountEntityToAccountResource(AccountEntity entity);
	    
	/**
	 * Converts an AccountResources to an AccountEntity.
	 * @param entity the AccountResources to convert
	 */
	    AccountEntity accountResourceToAccountEntity(AccountResources entity);


}
