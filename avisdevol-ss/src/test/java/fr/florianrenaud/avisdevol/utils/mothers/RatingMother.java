package fr.florianrenaud.avisdevol.utils.mothers;

import java.time.LocalDate;
import java.util.Arrays;
import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;

import fr.florianrenaud.avisdevol.business.enums.RatingStatus;
import fr.florianrenaud.avisdevol.business.resources.AirlineResource;
import fr.florianrenaud.avisdevol.business.resources.RatingFiltersResource;
import fr.florianrenaud.avisdevol.business.resources.RatingResource;
import fr.florianrenaud.avisdevol.business.utils.Pagination;
import fr.florianrenaud.avisdevol.dao.entity.AirlineEntity;
import fr.florianrenaud.avisdevol.dao.entity.RatingEntity;

/**
 * Mother class for creating test data for Rating objects.
 * Provides factory methods to create consistent test data.
 */
public class RatingMother {

    /**
     * Creates a sample RatingEntity with default values.
     */
    public static RatingEntity createRatingEntity() {
        return createRatingEntity(1, "AF123", LocalDate.now(), 5, "Excellent service", RatingStatus.PUBLISHED);
    }

    /**
     * Creates a RatingEntity with specific values.
     */
    public static RatingEntity createRatingEntity(Integer id, String flightNumber, LocalDate date, Integer rating, String comments, RatingStatus status) {
        RatingEntity entity = new RatingEntity();
        entity.setId(id);
        entity.setFlightNumber(flightNumber);
        entity.setDate(date);
        entity.setRating(rating);
        entity.setComment(comments);
        entity.setStatus(status);
        entity.setCreatedAt(LocalDate.now());
        entity.setUpdatedAt(LocalDate.now());
        
        // Add airline
        AirlineEntity airline = AirlineMother.createAirFranceEntity();
        entity.setAirline(airline);
        
        return entity;
    }

    /**
     * Creates a sample RatingResource with default values.
     */
    public static RatingResource createRatingResource() {
        return createRatingResource(1, "AF123", LocalDate.now(), 5, "Excellent service", RatingStatus.PUBLISHED);
    }

    /**
     * Creates a RatingResource with specific values.
     */
    public static RatingResource createRatingResource(Integer id, String flightNumber, LocalDate date, Integer rating, String comments, RatingStatus status) {
        RatingResource resource = new RatingResource();
        resource.setId(id);
        resource.setFlightNumber(flightNumber);
        resource.setDate(date);
        resource.setRating(rating);
        resource.setComments(comments);
        resource.setStatus(status);
        resource.setCreatedAt(LocalDate.now());
        resource.setUpdatedAt(LocalDate.now());
        
        // Add airline
        AirlineResource airline = AirlineMother.createAirFranceResource();
        resource.setAirline(airline);
        
        return resource;
    }

    /**
     * Creates a positive rating entity.
     */
    public static RatingEntity createPositiveRatingEntity() {
        return createRatingEntity(1, "AF123", LocalDate.now(), 5, "Excellent service, very satisfied!", RatingStatus.PUBLISHED);
    }

    /**
     * Creates a negative rating entity.
     */
    public static RatingEntity createNegativeRatingEntity() {
        return createRatingEntity(2, "AF456", LocalDate.now().minusDays(1), 2, "Poor service, very disappointed", RatingStatus.PUBLISHED);
    }

    /**
     * Creates a processed rating entity.
     */
    public static RatingEntity createProcessedRatingEntity() {
        return createRatingEntity(3, "AF789", LocalDate.now().minusDays(2), 4, "Good overall experience", RatingStatus.PROCESSED);
    }

    /**
     * Creates a rejected rating entity.
     */
    public static RatingEntity createRejectedRatingEntity() {
        return createRatingEntity(4, "AF999", LocalDate.now().minusDays(3), 1, "Inappropriate content", RatingStatus.REJECTED);
    }

    /**
     * Creates a rating entity with answer.
     */
    public static RatingEntity createRatingEntityWithAnswer() {
        RatingEntity entity = createRatingEntity(5, "AF555", LocalDate.now(), 4, "Good service but could be better", RatingStatus.PUBLISHED);
        entity.setAnswer("Thank you for your feedback. We will improve our service.");
        return entity;
    }

    /**
     * Creates corresponding positive rating resource.
     */
    public static RatingResource createPositiveRatingResource() {
        return createRatingResource(1, "AF123", LocalDate.now(), 5, "Excellent service, very satisfied!", RatingStatus.PUBLISHED);
    }

    /**
     * Creates corresponding negative rating resource.
     */
    public static RatingResource createNegativeRatingResource() {
        return createRatingResource(2, "AF456", LocalDate.now().minusDays(1), 2, "Poor service, very disappointed", RatingStatus.PUBLISHED);
    }

    /**
     * Creates corresponding processed rating resource.
     */
    public static RatingResource createProcessedRatingResource() {
        return createRatingResource(3, "AF789", LocalDate.now().minusDays(2), 4, "Good overall experience", RatingStatus.PROCESSED);
    }

    /**
     * Creates corresponding rejected rating resource.
     */
    public static RatingResource createRejectedRatingResource() {
        return createRatingResource(4, "AF999", LocalDate.now().minusDays(3), 1, "Inappropriate content", RatingStatus.REJECTED);
    }

    /**
     * Creates a rating resource with answer.
     */
    public static RatingResource createRatingResourceWithAnswer() {
        RatingResource resource = createRatingResource(5, "AF555", LocalDate.now(), 4, "Good service but could be better", RatingStatus.PUBLISHED);
        resource.setAnswer("Thank you for your feedback. We will improve our service.");
        return resource;
    }

    /**
     * Creates a new rating resource for creation (without ID).
     */
    public static RatingResource createNewRatingResource() {
        RatingResource resource = createRatingResource(null, "AF111", LocalDate.now(), 4, "New rating comment", null);
        resource.setCreatedAt(null);
        resource.setUpdatedAt(null);
        return resource;
    }

    /**
     * Creates a RatingFiltersResource for search.
     */
    public static RatingFiltersResource createRatingFilters() {
        RatingFiltersResource filters = new RatingFiltersResource();
        return filters;
    }

    /**
     * Creates a RatingFiltersResource with specific airline filter.
     */
    public static RatingFiltersResource createRatingFiltersWithAirline(String airline) {
        RatingFiltersResource filters = new RatingFiltersResource();
        filters.setAirline(airline);
        return filters;
    }

    /**
     * Creates a Page of RatingEntity for pagination tests.
     */
    public static Page<RatingEntity> createPageOfRatingEntities() {
        List<RatingEntity> ratings = Arrays.asList(
            createPositiveRatingEntity(),
            createNegativeRatingEntity(),
            createProcessedRatingEntity()
        );
        Pageable pageable = PageRequest.of(0, 20);
        return new PageImpl<>(ratings, pageable, ratings.size());
    }

    /**
     * Creates an empty Page of RatingEntity.
     */
    public static Page<RatingEntity> createEmptyPageOfRatingEntities() {
        Pageable pageable = PageRequest.of(0, 20);
        return new PageImpl<>(Arrays.asList(), pageable, 0);
    }

    /**
     * Creates a RatingFiltersResource for search.
     */
    public static RatingFiltersResource createRatingFiltersResource() {
        return createRatingFilters();
    }

    /**
     * Creates a Pagination of RatingResource.
     */
    public static Pagination<RatingResource> createRatingPagination() {
        List<RatingResource> content = Arrays.asList(
            createPositiveRatingResource(),
            createNegativeRatingResource(),
            createProcessedRatingResource()
        );
        fr.florianrenaud.avisdevol.business.utils.Pageable pageable = 
            new fr.florianrenaud.avisdevol.business.utils.Pageable(0, 20);
        return new Pagination<>(content, 3, pageable);
    }
}
