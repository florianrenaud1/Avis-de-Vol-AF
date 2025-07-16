package fr.florianrenaud.avisdevol.business.resources;

import java.time.LocalDate;

import com.fasterxml.jackson.annotation.JsonInclude;

import fr.florianrenaud.avisdevol.business.enums.RatingStatus;

/**
 * Resource that contains filters for ratings.
 */
@JsonInclude(JsonInclude.Include.NON_NULL)
public class RatingFiltersResource {

	private String airline;
	private String flightNumber;
	private LocalDate startDate;
	private LocalDate endDate;
	private Boolean answered;
	private RatingStatus status;


	public String getAirline() {
		return airline;
	}

	/**
	 * Sets the airline filter.
	 * @param airline the airline to set
	 */
	public void setAirline(String airline) {
		this.airline = airline;
	}

	/**
	 * Gets the flight number filter.
	 * @return the flight number
	 */
	public String getFlightNumber() {
		return flightNumber;
	}

	/**
	 * Sets the flight number filter.
	 * @param flightNumber the flight number to set
	 */
	public void setFlightNumber(String flightNumber) {
		this.flightNumber = flightNumber;
	}

	/**
	 * Gets the start date filter.
	 * @return the start date
	 */
	public LocalDate getStartDate() {
		return startDate;
	}

	/**
	 * Sets the start date filter.
	 * @param startDate the start date to set
	 */
	public void setStartDate(LocalDate startDate) {
		this.startDate = startDate;
	}

	/**
	 * Gets the end date filter.
	 * @return the end date
	 */
	public LocalDate getEndDate() {
		return endDate;
	}

	/**
	 * Sets the end date filter.
	 * @param endDate the end date to set
	 */
	public void setEndDate(LocalDate endDate) {
		this.endDate = endDate;
	}

	/**
	 * Gets the answered filter.
	 * @return true if answered, false otherwise
	 */
	public Boolean getAnswered() {
		return answered;
	}

	/**
	 * Sets the answered filter.
	 * @param answered true if answered, false otherwise
	 */
	public void setAnswered(Boolean answered) {
		this.answered = answered;
	}

	/**
	 * Gets the status filter.
	 * @return the status
	 */
	public RatingStatus getStatus() {
		return status;
	}

	/**
	 * Sets the status filter.
	 * @param status the status to set
	 */
	public void setStatus(RatingStatus status) {
		this.status = status;
	}
}
