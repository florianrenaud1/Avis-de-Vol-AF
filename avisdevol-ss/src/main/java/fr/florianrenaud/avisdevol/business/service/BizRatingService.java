package fr.florianrenaud.avisdevol.business.service;

import org.springframework.stereotype.Service;

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

	void createRating(RatingResource ratingResource) throws NotFoundException;

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
	RatingResource updateRatingStatus(Integer ratingId, fr.florianrenaud.avisdevol.business.enums.RatingStatus status) throws NotFoundException;
}
