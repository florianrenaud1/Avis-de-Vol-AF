package fr.florianrenaud.avisdevol.business.service.impl;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import fr.florianrenaud.avisdevol.business.enums.RatingStatus;
import fr.florianrenaud.avisdevol.business.mapper.RatingMapper;
import fr.florianrenaud.avisdevol.business.resources.RatingFiltersResource;
import fr.florianrenaud.avisdevol.business.resources.RatingResource;
import fr.florianrenaud.avisdevol.business.service.BizRatingService;
import fr.florianrenaud.avisdevol.business.utils.Pagination;
import fr.florianrenaud.avisdevol.dao.entity.RatingEntity;
import fr.florianrenaud.avisdevol.dao.exceptions.NotFoundException;
import fr.florianrenaud.avisdevol.dao.service.RatingService;
import fr.florianrenaud.avisdevol.utils.Constants;
import fr.florianrenaud.avisdevol.utils.Helpers;

/**
 * Implementation of the BizRatingService interface.
 */
@Service
public class BizRatingServiceImpl implements BizRatingService {

	private static final Logger LOG = LoggerFactory.getLogger(BizRatingServiceImpl.class);


	private final RatingService ratingService;
	private final RatingMapper ratingMapper;

	/**
	 * Constructor for BizRatingServiceImpl.
	 * @param ratingService the RatingService to use
	 * @param ratingMapper the RatingMapper to use
	 */
	public BizRatingServiceImpl(RatingService ratingService, RatingMapper ratingMapper) {
		this.ratingService = ratingService;
		this.ratingMapper = ratingMapper;
	}

	/**
	 * {@inheritDoc}
	 */
	@Override
	public Pagination<RatingResource> getRatingsByFilters(RatingFiltersResource searchFilters, int page, int size, String column, String direction) {
		Pageable pageable = Helpers.createPageable(page, size, column, direction,
				Constants.DEFAULT_SORT_COLUMN_RATING, Constants.DEFAULT_SECONDARY_SORT_COLUMN_RATING);
		// Search ratings by given filters
		LOG.info("Searching ratings with filters: {}", searchFilters);
		Page<RatingEntity> pagedRating = this.ratingService.getRatingsByFilters(searchFilters, pageable);
		// Return the resource list
		return this.ratingMapper.mapToListOfRatingResources(pagedRating);
	}

	/**
	 * {@inheritDoc}
	 */
	@Override
	public void createRating(RatingResource createRating) throws NotFoundException {
		// Convert RatingResource to RatingEntity
		RatingEntity ratingEntity = this.ratingMapper.ratingResourceToRatingEntity(createRating);
		// Set status to PUBLISHED for new ratings
		ratingEntity.setStatus(RatingStatus.PUBLISHED);
		// Save the rating entity
		LOG.info("Creating new rating: {}", ratingEntity);
		this.ratingService.createRating(ratingEntity);
	}

	/**
	 * {@inheritDoc}
	 */
	@Override
	public RatingResource getRatingById(Integer ratingId) throws NotFoundException {
		// Retrieve the rating entity by ID
		RatingEntity ratingEntity = this.ratingService.getRatingById(ratingId);
		// Convert RatingEntity to RatingResource
		LOG.info("Retrieving rating with ID: {}", ratingId);
		return this.ratingMapper.ratingEntityToRatingResource(ratingEntity);
	}

	/**
	 * {@inheritDoc}
	 */
	@Override
	public RatingResource updateRatingComment(Integer ratingId, String comment) throws NotFoundException {
		// Update the rating comment
		RatingEntity updatedRatingEntity = this.ratingService.updateRatingComment(ratingId, comment);
		// Convert the updated entity to resource and return
		LOG.info("Updating rating comment for ID: {}, new comment: {}", ratingId, comment);
		return this.ratingMapper.ratingEntityToRatingResource(updatedRatingEntity);
	}

	/**
	 * {@inheritDoc}
	 */
	@Override
	public void addAnswerToRating(Integer ratingId, String answer) throws NotFoundException {
		// Add answer to the rating
		LOG.info("Adding answer to rating with ID: {}, answer: {}", ratingId, answer);
		this.ratingService.addAnswerToRating(ratingId, answer);
	}

	/**
	 * {@inheritDoc}
	 */
	@Override
	public RatingResource updateRatingStatus(Integer ratingId, RatingStatus status) throws NotFoundException {
		// Update the rating status
		RatingEntity updatedRatingEntity = this.ratingService.updateRatingStatus(ratingId, status);
		// Convert the updated entity to resource and return
		LOG.info("Updating status of rating with ID: {} to status: {}", ratingId, status);
		return this.ratingMapper.ratingEntityToRatingResource(updatedRatingEntity);
	}

}
