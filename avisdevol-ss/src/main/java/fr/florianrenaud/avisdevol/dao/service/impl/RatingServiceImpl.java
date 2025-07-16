package fr.florianrenaud.avisdevol.dao.service.impl;

import fr.florianrenaud.avisdevol.business.enums.RatingStatus;
import fr.florianrenaud.avisdevol.business.resources.RatingFiltersResource;
import fr.florianrenaud.avisdevol.dao.entity.RatingEntity;
import fr.florianrenaud.avisdevol.dao.exceptions.NotFoundException;
import fr.florianrenaud.avisdevol.dao.repository.AirlineRepository;
import fr.florianrenaud.avisdevol.dao.repository.RatingRepository;
import fr.florianrenaud.avisdevol.dao.service.RatingService;
import fr.florianrenaud.avisdevol.dao.specifications.RatingSearchSpecification;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import static fr.florianrenaud.avisdevol.dao.exceptions.InfrastructureErrorType.AIRLINE_NOT_FOUND;
import static fr.florianrenaud.avisdevol.dao.exceptions.InfrastructureErrorType.RATING_NOT_FOUND;

/**
 * Implementation of the RatingService interface.
 */
@Service
public class RatingServiceImpl implements RatingService {

	private static final Logger LOG = LoggerFactory.getLogger(RatingServiceImpl.class);

	private final RatingSearchSpecification ratingSearchSpecification;
	private final RatingRepository ratingRepository;
	private final AirlineRepository airlineRepository;

	/**
	 * Constructor for RatingServiceImpl.
	 * @param ratingSearchSpecification the RatingSearchSpecification to use
	 * @param ratingRepository the RatingRepository to use
	 * @param airlineRepository the AirlineRepository to use
	 */
	public RatingServiceImpl(RatingSearchSpecification ratingSearchSpecification, RatingRepository ratingRepository, AirlineRepository airlineRepository) {
		this.ratingSearchSpecification = ratingSearchSpecification;
		this.ratingRepository = ratingRepository;
		this.airlineRepository = airlineRepository;
	}

	/**
	 * {@inheritDoc}
	 */
	@Override
	public Page<RatingEntity> getRatingsByFilters(RatingFiltersResource searchFilters, Pageable pageable) {
		// Search rating by given filters
		LOG.info("Searching ratings with filters: {}", searchFilters);
		Specification<RatingEntity> specification = this.ratingSearchSpecification.getRatingSearch(searchFilters);
		return this.ratingRepository.findAll(specification, pageable);
	}

	/**
	 * {@inheritDoc}
	 */
	@Override
	public void createRating(RatingEntity ratingEntity) throws NotFoundException {
		// Save the rating entity
		LOG.info("Creating rating: {}", ratingEntity);
		this.airlineRepository.findById(ratingEntity.getAirline().getId()).orElseThrow(() -> new NotFoundException(AIRLINE_NOT_FOUND));
		this.ratingRepository.save(ratingEntity);
	}

	/**
	 * {@inheritDoc}
	 */
	@Override
	public RatingEntity getRatingById(Integer ratingId) throws NotFoundException {
		// Retrieve the rating by ID
		LOG.info("Retrieving rating by ID: {}", ratingId);
		return this.ratingRepository.findById(ratingId)
				.orElseThrow(() -> new NotFoundException(RATING_NOT_FOUND));
	}

	/**
	 * {@inheritDoc}
	 */
	@Override
	public RatingEntity updateRatingComment(Integer ratingId, String comment) throws NotFoundException {
		LOG.info("Updating comment for rating ID: {}", ratingId);
		RatingEntity ratingEntity = this.ratingRepository.findById(ratingId)
				.orElseThrow(() -> new NotFoundException(RATING_NOT_FOUND));
		
		ratingEntity.setComment(comment);
		
		return this.ratingRepository.save(ratingEntity);
	}

	/**
	 * {@inheritDoc}
	 */
	@Override
	public void addAnswerToRating(Integer ratingId, String answer) throws NotFoundException {
		LOG.info("Adding answer to rating ID: {}", ratingId);
		RatingEntity ratingEntity = this.ratingRepository.findById(ratingId)
				.orElseThrow(() -> new NotFoundException(RATING_NOT_FOUND));
		
		ratingEntity.setAnswer(answer);
		
		this.ratingRepository.save(ratingEntity);
	}

	/**
	 * {@inheritDoc}
	 */
	@Override
	public RatingEntity updateRatingStatus(Integer ratingId, RatingStatus status) throws NotFoundException {
		LOG.info("Updating status for rating ID: {} to status: {}", ratingId, status);
		RatingEntity ratingEntity = this.ratingRepository.findById(ratingId)
				.orElseThrow(() -> new NotFoundException(RATING_NOT_FOUND));
		
		ratingEntity.setStatus(status);
		
		return this.ratingRepository.save(ratingEntity);
	}
}
