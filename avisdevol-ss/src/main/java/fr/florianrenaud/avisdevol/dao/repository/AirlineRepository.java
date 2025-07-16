package fr.florianrenaud.avisdevol.dao.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import fr.florianrenaud.avisdevol.dao.entity.AirlineEntity;

/**
 * Repository interface for managing AirlineEntity objects.
 */
@Repository
public interface AirlineRepository extends JpaRepository<AirlineEntity, Long>, JpaSpecificationExecutor<AirlineEntity> {
	
	/**
	 * Finds the top 5 airlines by name containing the specified string, ignoring case.
	 * @param name the name to search for
	 * @return a list of AirlineEntity objects
	 */
	@Query("SELECT a FROM AirlineEntity a WHERE :name IS NOT NULL AND :name != '' AND LOWER(a.name) LIKE LOWER(CONCAT('%', :name, '%')) ORDER BY a.name LIMIT 5")
	List<AirlineEntity> findTop5ByNameContainingIgnoreCase(@Param("name") String name);

	/**
	 * Checks if an airline with the specified name exists, ignoring case.
	 * @param name the name of the airline to check
	 * @return an AilineEntity if it exists, otherwise an empty Optional
	 */
	Optional<AirlineEntity> findByNameIgnoreCase(String name);

}
