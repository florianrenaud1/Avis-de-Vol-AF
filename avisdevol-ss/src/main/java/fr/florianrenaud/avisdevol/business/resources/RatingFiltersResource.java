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

	public void setAirline(String airline) {
		this.airline = airline;
	}

	public String getFlightNumber() {
		return flightNumber;
	}

	public void setFlightNumber(String flightNumber) {
		this.flightNumber = flightNumber;
	}

	public LocalDate getStartDate() {
		return startDate;
	}

	public void setStartDate(LocalDate startDate) {
		this.startDate = startDate;
	}

	public LocalDate getEndDate() {
		return endDate;
	}

	public void setEndDate(LocalDate endDate) {
		this.endDate = endDate;
	}

	public Boolean getAnswered() {
		return answered;
	}

	public void setAnswered(Boolean answered) {
		this.answered = answered;
	}

	public RatingStatus getStatus() {
		return status;
	}

	public void setStatus(RatingStatus status) {
		this.status = status;
	}
}
