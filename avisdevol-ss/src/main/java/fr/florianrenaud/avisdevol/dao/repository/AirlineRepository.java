package fr.florianrenaud.avisdevol.dao.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import fr.florianrenaud.avisdevol.dao.entity.AirlineEntity;

@Repository
public interface AirlineRepository  extends JpaRepository<AirlineEntity, Long>, JpaSpecificationExecutor<AirlineEntity> {
	
	List<AirlineEntity> findTop5ByNameContainingIgnoreCase(String name);
		
	Optional<AirlineEntity> findByNameIgnoreCase(String name);

}
