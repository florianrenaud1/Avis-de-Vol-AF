package fr.florianrenaud.avisdevol.business.resources;

import java.time.LocalDate;

import com.fasterxml.jackson.annotation.JsonInclude;

import fr.florianrenaud.avisdevol.business.enums.RatingStatus;

/**
 * Resource that represents a rating.
 */
@JsonInclude(JsonInclude.Include.NON_NULL)
public class RatingResource {
	private Integer id;
	private String flightNumber;
	private LocalDate date;
	private LocalDate createdAt;
	private LocalDate updatedAt;
	private AirlineResource airline;
	private Integer rating;
	private String comments;
	private String answer;
	private RatingStatus status;

	/**
	 * Gets the rating ID.
	 * @return the rating ID
	 */
	public Integer getId() {
		return id;
	}

	/**
	 * Sets the rating ID.
	 * @param id the rating ID
	 */
	public void setId(Integer id) {
		this.id = id;
	}

	/**
	 * Gets the flight number.
	 * @return the flight number
	 */
	public String getFlightNumber() {
		return flightNumber;
	}

	/**
	 * Sets the flight number.
	 * @param flightNumber the flight number
	 */
	public void setFlightNumber(String flightNumber) {
		this.flightNumber = flightNumber;
	}

	/**
	 * Gets the flight date.
	 * @return the flight date
	 */
	public LocalDate getDate() {
		return date;
	}

	/**
	 * Sets the flight date.
	 * @param date the flight date
	 */
	public void setDate(LocalDate date) {
		this.date = date;
	}

	/**
	 * Gets the creation date.
	 * @return the creation date
	 */
	public LocalDate getCreatedAt() {
		return createdAt;
	}

	/**
	 * Sets the creation date.
	 * @param createdAt the creation date
	 */
	public void setCreatedAt(LocalDate createdAt) {
		this.createdAt = createdAt;
	}

	/**
	 * Gets the last update date.
	 * @return the last update date
	 */
	public LocalDate getUpdatedAt() {
		return updatedAt;
	}

	/**
	 * Sets the last update date.
	 * @param updatedAt the last update date
	 */
	public void setUpdatedAt(LocalDate updatedAt) {
		this.updatedAt = updatedAt;
	}

	/**
	 * Gets the airline resource.
	 * @return the airline resource
	 */
	public AirlineResource getAirline() {
		return airline;
	}

	/**
	 * Sets the airline resource.
	 * @param airline the airline resource
	 */
	public void setAirline(AirlineResource airline) {
		this.airline = airline;
	}

	/**
	 * Gets the rating value.
	 * @return the rating value
	 */
	public Integer getRating() {
		return rating;
	}

	/**
	 * Sets the rating value.
	 * @param rating the rating value
	 */
	public void setRating(Integer rating) {
		this.rating = rating;
	}

	/**
	 * Gets the comments.
	 * @return the comments
	 */
	public String getComments() {
		return comments;
	}

	/**
	 * Sets the comments.
	 * @param comments the comments
	 */
	public void setComments(String comments) {
		this.comments = comments;
	}

	/**
	 * Gets the answer.
	 * @return the answer
	 */
	public String getAnswer() {
		return answer;
	}

	/**
	 * Sets the answer.
	 * @param answer the answer
	 */
	public void setAnswer(String answer) {
		this.answer = answer;
	}

	/**
	 * Gets the rating status.
	 * @return the rating status
	 */
	public RatingStatus getStatus() {
		return status;
	}

	/**
	 * Sets the rating status.
	 * @param status the rating status
	 */
	public void setStatus(RatingStatus status) {
		this.status = status;
	}
	
}
