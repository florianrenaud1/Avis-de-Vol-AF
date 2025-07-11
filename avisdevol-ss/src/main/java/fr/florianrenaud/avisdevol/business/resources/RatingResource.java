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

	// Getters and Setters
	public Integer getId() {
		return id;
	}

	public void setId(Integer id) {
		this.id = id;
	}

	public String getFlightNumber() {
		return flightNumber;
	}

	public void setFlightNumber(String flightNumber) {
		this.flightNumber = flightNumber;
	}

	public LocalDate getDate() {
		return date;
	}

	public void setDate(LocalDate date) {
		this.date = date;
	}

	public LocalDate getCreatedAt() {
		return createdAt;
	}

	public void setCreatedAt(LocalDate createdAt) {
		this.createdAt = createdAt;
	}

	public LocalDate getUpdatedAt() {
		return updatedAt;
	}

	public void setUpdatedAt(LocalDate updatedAt) {
		this.updatedAt = updatedAt;
	}

	public AirlineResource getAirline() {
		return airline;
	}

	public void setAirline(AirlineResource airline) {
		this.airline = airline;
	}

	public Integer getRating() {
		return rating;
	}

	public void setRating(Integer rating) {
		this.rating = rating;
	}

	public String getComments() {
		return comments;
	}

	public void setComments(String comments) {
		this.comments = comments;
	}

	public String getAnswer() {
		return answer;
	}

	public void setAnswer(String answer) {
		this.answer = answer;
	}

	public RatingStatus getStatus() {
		return status;
	}

	public void setStatus(RatingStatus status) {
		this.status = status;
	}
	
}
