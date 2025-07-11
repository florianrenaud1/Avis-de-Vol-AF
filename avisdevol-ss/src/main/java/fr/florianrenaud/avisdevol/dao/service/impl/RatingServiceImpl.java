package fr.florianrenaud.avisdevol.dao.service.impl;

import fr.florianrenaud.avisdevol.business.resources.RatingFiltersResource;
import fr.florianrenaud.avisdevol.dao.entity.RatingEntity;
import fr.florianrenaud.avisdevol.dao.exceptions.NotFoundException;
import fr.florianrenaud.avisdevol.dao.repository.AirlineRepository;
import fr.florianrenaud.avisdevol.dao.repository.RatingRepository;
import fr.florianrenaud.avisdevol.dao.service.RatingService;
import fr.florianrenaud.avisdevol.dao.specifications.RatingSearchSpecification;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import static fr.florianrenaud.avisdevol.dao.exceptions.InfrastructureErrorType.AIRLINE_NOT_FOUND;
import static fr.florianrenaud.avisdevol.dao.exceptions.InfrastructureErrorType.RATING_NOT_FOUND;

@Service
public class RatingServiceImpl implements RatingService {

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

	@Override
	public Page<RatingEntity> getRatingsByFilters(RatingFiltersResource searchFilters, Pageable pageable) {
		// Search rating by given filters
		Specification<RatingEntity> specification = this.ratingSearchSpecification.getRatingSearch(searchFilters);
		return this.ratingRepository.findAll(specification, pageable);
	}

	@Override
	public void createRating(RatingEntity ratingEntity) throws NotFoundException {
		// Save the rating entity
		this.airlineRepository.findById(ratingEntity.getAirline().getId()).orElseThrow(() -> new NotFoundException(AIRLINE_NOT_FOUND));
		this.ratingRepository.save(ratingEntity);
	}

	@Override
	public RatingEntity getRatingById(Integer ratingId) throws NotFoundException {
		// Retrieve the rating by ID
		return this.ratingRepository.findById(ratingId)
				.orElseThrow(() -> new NotFoundException(RATING_NOT_FOUND));
	}

	@Override
	public RatingEntity updateRatingComment(Integer ratingId, String comment) throws NotFoundException {
		// Retrieve the rating by ID
		RatingEntity ratingEntity = this.ratingRepository.findById(ratingId)
				.orElseThrow(() -> new NotFoundException(RATING_NOT_FOUND));
		
		// Update the comment (replaces the existing comment)
		ratingEntity.setComment(comment);
		
		// Save and return the updated entity
		return this.ratingRepository.save(ratingEntity);
	}

	@Override
	public void addAnswerToRating(Integer ratingId, String answer) throws NotFoundException {
		// Retrieve the rating by ID
		RatingEntity ratingEntity = this.ratingRepository.findById(ratingId)
				.orElseThrow(() -> new NotFoundException(RATING_NOT_FOUND));
		
		// Update the answer
		ratingEntity.setAnswer(answer);
		
		// Save the updated entity
		this.ratingRepository.save(ratingEntity);
	}

	@Override
	public RatingEntity updateRatingStatus(Integer ratingId, fr.florianrenaud.avisdevol.business.enums.RatingStatus status) throws NotFoundException {
		// Retrieve the rating by ID
		RatingEntity ratingEntity = this.ratingRepository.findById(ratingId)
				.orElseThrow(() -> new NotFoundException(RATING_NOT_FOUND));
		
		// Update the status
		ratingEntity.setStatus(status);
		
		// Save and return the updated entity
		return this.ratingRepository.save(ratingEntity);
	}
}
