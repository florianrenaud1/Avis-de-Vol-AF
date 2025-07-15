package fr.florianrenaud.avisdevol.dao.repository;

import fr.florianrenaud.avisdevol.dao.entity.RatingEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

/**
 * Repository interface for managing RatingEntity objects.
 */
@Repository
public interface RatingRepository extends JpaRepository<RatingEntity, Integer>, JpaSpecificationExecutor<RatingEntity> {

}
