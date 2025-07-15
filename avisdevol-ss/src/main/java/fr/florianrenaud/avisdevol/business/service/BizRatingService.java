package fr.florianrenaud.avisdevol.business.service;

import org.springframework.stereotype.Service;

import fr.florianrenaud.avisdevol.business.enums.RatingStatus;
import fr.florianrenaud.avisdevol.business.resources.RatingFiltersResource;
import fr.florianrenaud.avisdevol.business.resources.RatingResource;
import fr.florianrenaud.avisdevol.business.utils.Pagination;
import fr.florianrenaud.avisdevol.dao.exceptions.NotFoundException;

/**
 * Service interface for managing Ratings.
 * This service provides methods to retrieve Ratings based on various filters and pagination options.
 */
@Service
public interface BizRatingService {

	/**
	 * Gets pageable list of Rating based on filters.
	 * @param searchFilters Filter criteria
	 * @param page Page index
	 * @param size Number of elements
	 * @param col Sort column
	 * @param direction Sort direction
	 * @return pageable list of Rating
	 */
	Pagination<RatingResource> getRatingsByFilters(RatingFiltersResource searchFilters, int page, int size, String col, String direction);

	/**
	 * Creates a new Rating.
	 * @param ratingResource The RatingResource to create
	 * @throws NotFoundException if the Rating cannot be created due to missing dependencies
	 */
	void createRating(RatingResource ratingResource) throws NotFoundException;

	/**
	 * Gets a Rating by its ID.
	 * @param ratingId ID of the Rating to retrieve
	 * @return RatingResource
	 * @throws NotFoundException if the Rating is not found
	 */
	RatingResource getRatingById(Integer ratingId) throws NotFoundException;
	
	/**
	 * Updates the comment of a rating.
	 * @param ratingId the ID of the rating to update
	 * @param comment the new comment (replaces the existing comment)
	 * @return the updated RatingResource
	 * @throws NotFoundException if the rating is not found
	 */
	RatingResource updateRatingComment(Integer ratingId, String comment) throws NotFoundException;
	
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
	 * @return the updated RatingResource
	 * @throws NotFoundException if the rating is not found
	 */
	RatingResource updateRatingStatus(Integer ratingId, RatingStatus status) throws NotFoundException;
}
