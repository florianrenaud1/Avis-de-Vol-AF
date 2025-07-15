package fr.florianrenaud.avisdevol.dao.service;

import fr.florianrenaud.avisdevol.business.resources.RatingFiltersResource;
import fr.florianrenaud.avisdevol.dao.entity.RatingEntity;
import fr.florianrenaud.avisdevol.dao.exceptions.NotFoundException;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

/**
 * Service interface for managing ratings.
 */
public interface RatingService {

	/**
	 * Gets pageable list of Rating based on filters.
	 * @param searchFilters Filter criteria
	 * @param pageable Pageable object containing pagination and sorting information
	 */
	Page<RatingEntity> getRatingsByFilters(RatingFiltersResource searchFilters, Pageable pageable);

	/**
	 * Creates a new Rating.
	 * @param ratingEntity the RatingEntity to create
	 * @throws NotFoundException if the Rating cannot be created due to missing dependencies
	 */
	void createRating(RatingEntity ratingEntity) throws NotFoundException;

	/**
	 * Gets a Rating by its ID.
	 * @param ratingId ID of the Rating to retrieve
	 * @return RatingEntity
	 * @throws NotFoundException if the Rating is not found
	 */
	RatingEntity getRatingById(Integer ratingId) throws NotFoundException;
	
	/**
	 * Updates the comment of a rating.
	 * @param ratingId the ID of the rating to update
	 * @param comment the new comment (replaces the existing comment)
	 * @return the updated RatingEntity
	 * @throws NotFoundException if the rating is not found
	 */
	RatingEntity updateRatingComment(Integer ratingId, String comment) throws NotFoundException;
	
	/**
	 * Adds an answer to a rating.
	 * @param ratingId the ID of the rating to update
	 * @param answer the answer text to add
	 * @throws NotFoundException if the rating is not found
	 */
	void addAnswerToRating(Integer ratingId, String answer) throws NotFoundException;
	
	/**
	 * Updates the status of a rating.
	 * @param ratingId the ID of the rating to update
	 * @param status the new status to set
	 * @return the updated RatingEntity
	 * @throws NotFoundException if the rating is not found
	 */
	RatingEntity updateRatingStatus(Integer ratingId, fr.florianrenaud.avisdevol.business.enums.RatingStatus status) throws NotFoundException;
}
