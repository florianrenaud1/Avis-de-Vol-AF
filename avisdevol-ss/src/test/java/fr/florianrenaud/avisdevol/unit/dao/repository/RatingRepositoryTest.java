package fr.florianrenaud.avisdevol.unit.dao.repository;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertTrue;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.boot.test.autoconfigure.orm.jpa.TestEntityManager;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.test.context.ActiveProfiles;

import fr.florianrenaud.avisdevol.business.enums.RatingStatus;
import fr.florianrenaud.avisdevol.dao.entity.AirlineEntity;
import fr.florianrenaud.avisdevol.dao.entity.RatingEntity;
import fr.florianrenaud.avisdevol.dao.repository.RatingRepository;
import fr.florianrenaud.avisdevol.utils.mothers.AirlineMother;
import fr.florianrenaud.avisdevol.utils.mothers.RatingMother;

@DataJpaTest
@ActiveProfiles("test")
class RatingRepositoryTest {

    @Autowired
    private TestEntityManager entityManager;

    @Autowired
    private RatingRepository ratingRepository;

    private AirlineEntity airFrance;
    private AirlineEntity lufthansa;
    private RatingEntity positiveRating;
    private RatingEntity negativeRating;
    private RatingEntity processedRating;
    private RatingEntity rejectedRating;

    @BeforeEach
    void setUp() {
        // Prepare airlines
        airFrance = AirlineMother.createAirFranceEntity();
        lufthansa = AirlineMother.createLufthansaEntity();
        airFrance.setId(null);
        lufthansa.setId(null);
        
        entityManager.persistAndFlush(airFrance);
        entityManager.persistAndFlush(lufthansa);

        // Prepare ratings using Mother pattern
        positiveRating = RatingMother.createPositiveRatingEntity();
        negativeRating = RatingMother.createNegativeRatingEntity();
        processedRating = RatingMother.createProcessedRatingEntity();
        rejectedRating = RatingMother.createRejectedRatingEntity();

        // Reset IDs for persistence and set airlines
        positiveRating.setId(null);
        positiveRating.setAirline(airFrance);
        
        negativeRating.setId(null);
        negativeRating.setAirline(airFrance);
        
        processedRating.setId(null);
        processedRating.setAirline(lufthansa);
        
        rejectedRating.setId(null);
        rejectedRating.setAirline(lufthansa);

        // Persist test data
        entityManager.persistAndFlush(positiveRating);
        entityManager.persistAndFlush(negativeRating);
        entityManager.persistAndFlush(processedRating);
        entityManager.persistAndFlush(rejectedRating);
    }

    @Test
    void testFindAll_ShouldReturnAllRatings() {
        // When
        List<RatingEntity> result = ratingRepository.findAll();

        // Then
        assertNotNull(result);
        assertEquals(4, result.size());
    }

    @Test
    void testFindAllWithPageable_ShouldReturnPagedResults() {
        // Given
        Pageable pageable = PageRequest.of(0, 2);

        // When
        Page<RatingEntity> result = ratingRepository.findAll(pageable);

        // Then
        assertNotNull(result);
        assertEquals(2, result.getContent().size());
        assertEquals(4, result.getTotalElements());
        assertEquals(2, result.getTotalPages());
        assertTrue(result.hasNext());
    }

    @Test
    void testFindAllWithPageableAndSort_ShouldReturnSortedResults() {
        // Given
        Pageable pageable = PageRequest.of(0, 10, Sort.by(Sort.Direction.DESC, "rating"));

        // When
        Page<RatingEntity> result = ratingRepository.findAll(pageable);

        // Then
        assertNotNull(result);
        assertEquals(4, result.getContent().size());
        
        // Check that results are sorted by rating descending
        List<RatingEntity> content = result.getContent();
        for (int i = 0; i < content.size() - 1; i++) {
            assertTrue(content.get(i).getRating() >= content.get(i + 1).getRating());
        }
    }

    @Test
    void testFindById_WithExistingId_ShouldReturnRating() {
        // Given
        Integer ratingId = positiveRating.getId();

        // When
        Optional<RatingEntity> result = ratingRepository.findById(ratingId);

        // Then
        assertTrue(result.isPresent());
        assertEquals(positiveRating.getComment(), result.get().getComment());
        assertEquals(positiveRating.getRating(), result.get().getRating());
        assertEquals(positiveRating.getStatus(), result.get().getStatus());
    }

    @Test
    void testFindById_WithNonExistentId_ShouldReturnEmpty() {
        // When
        Optional<RatingEntity> result = ratingRepository.findById(99999);

        // Then
        assertFalse(result.isPresent());
    }

    @Test
    void testSave_WithNewRating_ShouldPersistRating() {
        // Given
        RatingEntity newRating = RatingMother.createRatingEntity();
        newRating.setId(null);
        newRating.setAirline(airFrance);
        newRating.setFlightNumber("AF456");
        newRating.setComment("Great flight experience");

        // When
        RatingEntity savedRating = ratingRepository.save(newRating);

        // Then
        assertNotNull(savedRating.getId());
        assertEquals("AF456", savedRating.getFlightNumber());
        assertEquals("Great flight experience", savedRating.getComment());
        assertEquals(airFrance.getId(), savedRating.getAirline().getId());
    }

    @Test
    void testSaveAndFlush_WithNewRating_ShouldImmediatelyPersist() {
        // Given
        RatingEntity newRating = RatingMother.createRatingEntity();
        newRating.setId(null);
        newRating.setAirline(lufthansa);
        newRating.setComment("Immediate persistence test");

        // When
        RatingEntity savedRating = ratingRepository.saveAndFlush(newRating);

        // Then
        assertNotNull(savedRating.getId());
        
        // Verify it's immediately available
        Optional<RatingEntity> found = ratingRepository.findById(savedRating.getId());
        assertTrue(found.isPresent());
        assertEquals("Immediate persistence test", found.get().getComment());
    }

    @Test
    void testUpdate_WithExistingRating_ShouldUpdateRating() {
        // Given
        RatingEntity toUpdate = positiveRating;
        String newComment = "Updated comment";
        String newAnswer = "Thank you for your feedback";

        // When
        toUpdate.setComment(newComment);
        toUpdate.setAnswer(newAnswer);
        RatingEntity updatedRating = ratingRepository.saveAndFlush(toUpdate);

        // Then
        assertNotNull(updatedRating);
        assertEquals(newComment, updatedRating.getComment());
        assertEquals(newAnswer, updatedRating.getAnswer());
        assertEquals(toUpdate.getId(), updatedRating.getId());

        // Verify the change is persisted
        Optional<RatingEntity> found = ratingRepository.findById(toUpdate.getId());
        assertTrue(found.isPresent());
        assertEquals(newComment, found.get().getComment());
        assertEquals(newAnswer, found.get().getAnswer());
    }

    @Test
    void testUpdateStatus_ShouldUpdateCorrectly() {
        // Given
        RatingEntity toUpdate = processedRating;
        RatingStatus newStatus = RatingStatus.PUBLISHED;

        // When
        toUpdate.setStatus(newStatus);
        RatingEntity updatedRating = ratingRepository.saveAndFlush(toUpdate);

        // Then
        assertEquals(newStatus, updatedRating.getStatus());
        
        // Verify persistence
        Optional<RatingEntity> found = ratingRepository.findById(toUpdate.getId());
        assertTrue(found.isPresent());
        assertEquals(newStatus, found.get().getStatus());
    }

    @Test
    void testDeleteById_WithExistingId_ShouldRemoveRating() {
        // Given
        Integer ratingId = positiveRating.getId();
        assertTrue(ratingRepository.findById(ratingId).isPresent());

        // When
        ratingRepository.deleteById(ratingId);
        ratingRepository.flush();

        // Then
        assertFalse(ratingRepository.findById(ratingId).isPresent());
        assertEquals(3, ratingRepository.count()); // Should have 3 remaining
    }

    @Test
    void testCount_ShouldReturnCorrectCount() {
        // When
        long count = ratingRepository.count();

        // Then
        assertEquals(4L, count);
    }

    @Test
    void testExistById_WithExistingId_ShouldReturnTrue() {
        // Given
        Integer ratingId = positiveRating.getId();

        // When
        boolean exists = ratingRepository.existsById(ratingId);

        // Then
        assertTrue(exists);
    }

    @Test
    void testExistById_WithNonExistentId_ShouldReturnFalse() {
        // When
        boolean exists = ratingRepository.existsById(99999);

        // Then
        assertFalse(exists);
    }

    @Test
    void testFindAllWithSpecification_ShouldFilterResults() {
        // Given - Create a simple specification that filters by airline
        Specification<RatingEntity> spec = (root, query, criteriaBuilder) -> 
            criteriaBuilder.equal(root.get("airline").get("id"), airFrance.getId());

        // When
        List<RatingEntity> result = ratingRepository.findAll(spec);

        // Then
        assertNotNull(result);
        assertEquals(2, result.size()); // positiveRating and negativeRating for Air France
        assertTrue(result.stream().allMatch(rating -> rating.getAirline().getId().equals(airFrance.getId())));
    }

    @Test
    void testFindAllWithSpecificationAndPageable_ShouldReturnPagedFilteredResults() {
        // Given
        Specification<RatingEntity> spec = (root, query, criteriaBuilder) -> 
            criteriaBuilder.equal(root.get("airline").get("id"), lufthansa.getId());
        Pageable pageable = PageRequest.of(0, 10);

        // When
        Page<RatingEntity> result = ratingRepository.findAll(spec, pageable);

        // Then
        assertNotNull(result);
        assertEquals(2, result.getContent().size()); // processedRating and rejectedRating for Lufthansa
        assertEquals(2, result.getTotalElements());
        assertTrue(result.getContent().stream().allMatch(rating -> rating.getAirline().getId().equals(lufthansa.getId())));
    }

    @Test
    void testFindAllWithSpecificationAndSort_ShouldReturnSortedFilteredResults() {
        // Given
        Specification<RatingEntity> spec = (root, query, criteriaBuilder) -> 
            criteriaBuilder.greaterThan(root.get("rating"), 2); // Ratings > 2
        Sort sort = Sort.by(Sort.Direction.ASC, "rating");

        // When
        List<RatingEntity> result = ratingRepository.findAll(spec, sort);

        // Then
        assertNotNull(result);
        assertTrue(result.size() >= 1); // At least positive rating
        assertTrue(result.stream().allMatch(rating -> rating.getRating() > 2));
        
        // Check sorting
        for (int i = 0; i < result.size() - 1; i++) {
            assertTrue(result.get(i).getRating() <= result.get(i + 1).getRating());
        }
    }

    @Test
    void testSaveMultipleRatings_ShouldPersistAll() {
        // Given
        RatingEntity rating1 = RatingMother.createRatingEntity(null, "AF999", LocalDate.now(), 4, "Good flight", RatingStatus.PUBLISHED);
        RatingEntity rating2 = RatingMother.createRatingEntity(null, "LH999", LocalDate.now(), 3, "Average flight", RatingStatus.PROCESSED);
        
        rating1.setAirline(airFrance);
        rating2.setAirline(lufthansa);
        
        List<RatingEntity> ratingsToSave = List.of(rating1, rating2);

        // When
        List<RatingEntity> savedRatings = ratingRepository.saveAll(ratingsToSave);

        // Then
        assertEquals(2, savedRatings.size());
        assertTrue(savedRatings.stream().allMatch(rating -> rating.getId() != null));
        
        // Verify total count increased
        assertEquals(6L, ratingRepository.count()); // 4 original + 2 new
    }

    @Test
    void testRatingWithAirlineRelationship_ShouldMaintainConsistency() {
        // Given
        RatingEntity newRating = RatingMother.createRatingEntity();
        newRating.setId(null);
        newRating.setAirline(airFrance);
        newRating.setComment("Testing airline relationship");

        // When
        RatingEntity savedRating = ratingRepository.saveAndFlush(newRating);

        // Then
        assertNotNull(savedRating.getAirline());
        assertEquals(airFrance.getId(), savedRating.getAirline().getId());
        assertEquals("Air France", savedRating.getAirline().getName());
        
        // Verify the relationship is properly loaded
        Optional<RatingEntity> found = ratingRepository.findById(savedRating.getId());
        assertTrue(found.isPresent());
        assertNotNull(found.get().getAirline());
        assertEquals("Air France", found.get().getAirline().getName());
    }

    @Test
    void testDeleteAll_ShouldRemoveAllRatings() {
        // Given
        assertEquals(4L, ratingRepository.count());

        // When
        ratingRepository.deleteAll();
        ratingRepository.flush();

        // Then
        assertEquals(0L, ratingRepository.count());
        assertTrue(ratingRepository.findAll().isEmpty());
    }

    @Test
    void testTransactionalBehavior_ShouldMaintainDataIntegrity() {
        // Given
        long initialCount = ratingRepository.count();
        RatingEntity newRating = RatingMother.createRatingEntity();
        newRating.setId(null);
        newRating.setAirline(airFrance);

        // When
        RatingEntity savedRating = ratingRepository.save(newRating);
        
        // Verify count increased before flush
        assertEquals(initialCount + 1, ratingRepository.count());
        
        // Delete and verify
        ratingRepository.delete(savedRating);
        
        // Then
        assertEquals(initialCount, ratingRepository.count());
    }

    @Test
    void testComplexSpecification_ShouldFilterCorrectly() {
        // Given - Create a complex specification
        Specification<RatingEntity> spec = (root, query, criteriaBuilder) -> {
            return criteriaBuilder.and(
                criteriaBuilder.equal(root.get("status"), RatingStatus.PUBLISHED),
                criteriaBuilder.greaterThanOrEqualTo(root.get("rating"), 4)
            );
        };

        // When
        List<RatingEntity> result = ratingRepository.findAll(spec);

        // Then
        assertNotNull(result);
        assertTrue(result.stream().allMatch(rating -> 
            rating.getStatus() == RatingStatus.PUBLISHED && rating.getRating() >= 4));
    }
}
