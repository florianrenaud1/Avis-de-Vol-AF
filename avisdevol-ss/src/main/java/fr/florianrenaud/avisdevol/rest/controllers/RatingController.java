package fr.florianrenaud.avisdevol.rest.controllers;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.MediaType;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import fr.florianrenaud.avisdevol.business.enums.RatingStatus;
import fr.florianrenaud.avisdevol.business.resources.RatingFiltersResource;
import fr.florianrenaud.avisdevol.business.resources.RatingResource;
import fr.florianrenaud.avisdevol.business.service.BizRatingService;
import fr.florianrenaud.avisdevol.business.utils.Pagination;
import fr.florianrenaud.avisdevol.dao.exceptions.NotFoundException;
import fr.florianrenaud.avisdevol.rest.exceptions.RestErrorType;
import fr.florianrenaud.avisdevol.rest.exceptions.RestException;
import fr.florianrenaud.avisdevol.rest.validators.RatingValidator;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.tags.Tag;

/**
 * Controller for managing ratings.
 * Provides endpoints for creating, retrieving, and updating ratings.
 */
@RestController
@CrossOrigin(originPatterns = "http://localhost:4200", allowCredentials = "true")
@Tag(name = "Rating", description = "Rating endpoints")
@RequestMapping("/rest/rating")
public class RatingController {

	private final BizRatingService bizRatingService;

	private static final Logger LOG = LoggerFactory.getLogger(RatingController.class);

	/**
	 * Constructor for RatingController.
	 * @param bizRatingService the BizRatingService to use
	 */
	public RatingController(BizRatingService bizRatingService) {
		this.bizRatingService = bizRatingService;
	}

	/**
	 * Retrieves a pageable list of ratings based on filters.
	 * @param filters Filter criteria
	 * @param page Page index
	 * @param size Number of elements
	 * @param sortColumn Sort column
	 * @param sortDirection Sort direction
	 * @return pageable list of RatingResource
	 */
	@Operation(summary = "Search rating")
	@PostMapping(value = "/search", produces = MediaType.APPLICATION_JSON_VALUE)
	public Pagination<RatingResource> search(
			@RequestBody(required = false) @Schema(defaultValue = "{}") RatingFiltersResource filters,
			@RequestParam(defaultValue = "0") int page,
			@RequestParam(defaultValue = "20") int size,
			@RequestParam(value = "col", defaultValue = "rating") String sortColumn,
			@RequestParam(value = "direction", defaultValue = "asc") String sortDirection) {
		if (filters == null) {
			filters = new RatingFiltersResource();
		}
		// Force responsible as current connected user
		LOG.info("Searching ratings with filters: {}, page: {}, size: {}, sortColumn: {}, sortDirection: {}",
				filters, page, size, sortColumn, sortDirection);
		return this.bizRatingService.getRatingsByFilters(filters, page, size, sortColumn, sortDirection);
	}

	/**
	 * Create a new Rating.
	 * @param createRating the RatingResource to create
	 * @throws RestException raised if the Rating cannot be created due to validation errors
	 * @throws NotFoundException raised if the Rating cannot be created due to missing dependencies
	 */
	@PreAuthorize("hasRole('ADMIN') or hasRole('MODERATOR') or hasRole('USER')")
	@Operation(summary = "Create a new Rating.")
	@PostMapping(value = "/add", produces = MediaType.APPLICATION_JSON_VALUE)
	public void createRating(@RequestBody RatingResource createRating) throws RestException, NotFoundException {
		LOG.info("Creating new rating: {}", createRating);
		RatingValidator.validateRatingResource(createRating);
		this.bizRatingService.createRating(createRating);
	}

	/**
	 * Get a Rating by its ID.
	 * @param ratingId ID of the Rating to retrieve
	 * @return retrieved Rating
	 * @throws NotFoundException raised if the Rating is not found
	 */
	@PreAuthorize("hasRole('ADMIN') or hasRole('MODERATOR') or hasRole('USER')")
	@Operation(summary = "Retrieve information of a Rating.")
	@GetMapping(value = "/{ratingId}", produces = MediaType.APPLICATION_JSON_VALUE)
	public RatingResource getRating(@PathVariable("ratingId") Integer ratingId) throws NotFoundException {
		LOG.info("Retrieving rating with ID: {}", ratingId);
		return this.bizRatingService.getRatingById(ratingId);
	}

	/**
	 * Add an answer to a Rating.
	 * @param ratingId ID of the Rating to update with an answer
	 * @param answer the answer text to add
	 * @throws NotFoundException raised if the Rating is not found
	 */
	@PreAuthorize("hasRole('ADMIN') or hasRole('MODERATOR')")
	@Operation(summary = "Add an answer to a Rating.")
	@PutMapping(value = "/answer/{ratingId}", produces = MediaType.APPLICATION_JSON_VALUE)
	public void addAnswer(@PathVariable("ratingId") Integer ratingId, @RequestBody String answer) throws NotFoundException {
		this.bizRatingService.addAnswerToRating(ratingId, answer != null ? answer.trim() : null);
	}

	/**
	 * Update the status of a Rating.
	 * @param ratingId ID of the Rating to update
	 * @param status the new status to set as a string
	 * @return the updated Rating
	 * @throws NotFoundException raised if the Rating is not found
	 * @throws RestException raised if the status value is invalid
	 */
	@PreAuthorize("hasRole('ADMIN') or hasRole('MODERATOR')")
	@Operation(summary = "Update the status of a Rating.")
	@PutMapping(value = "/status/{ratingId}", produces = MediaType.APPLICATION_JSON_VALUE)
	public RatingResource updateStatus(@PathVariable("ratingId") Integer ratingId, @RequestBody String status) throws NotFoundException, RestException {
		try {
			LOG.info("Updating status of rating with ID: {} to status: {}", ratingId, status);
			RatingStatus ratingStatus = RatingStatus.valueOf(status.trim().toUpperCase());
			return this.bizRatingService.updateRatingStatus(ratingId, ratingStatus);
		} catch (IllegalArgumentException e) {
			throw new RestException(RestErrorType.UNPROCESSABLE_ENTITY);
		}
	}
}
