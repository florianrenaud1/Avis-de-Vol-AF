package fr.florianrenaud.avisdevol.dao.entity;

import java.time.LocalDate;

import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import fr.florianrenaud.avisdevol.business.enums.RatingStatus;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.SequenceGenerator;
import jakarta.persistence.Table;

@Entity
@Table(name = "RATING")
@SequenceGenerator(name = "SEQ_RATING", sequenceName = "SEQ_RATING", allocationSize = 1)
public class RatingEntity {

	/** id */
	@Id
	@GeneratedValue(strategy = GenerationType.AUTO, generator = "SEQ_RATING")
	private Integer id;

	@Column(name = "FLIGHT_NUMBER", nullable = false)
	private String flightNumber;
	
	@Column(name = "DATE", nullable = false)
	private LocalDate date;

	@Column(name = "CREATION_DATE", nullable = false)
	@CreationTimestamp
	private LocalDate createdAt;

	@Column(name = "RATING", nullable = false)
	private Integer rating;

	@Column(name = "COMMENT")
	private String comment;

	/** date de Fin */
	@Column(name = "LAST_UPDATE_DATE")
	@UpdateTimestamp
	private LocalDate updatedAt;

	@ManyToOne(fetch = FetchType.LAZY, optional = true)
	@JoinColumn(name = "AIRLINE_ID", nullable = false)
	private AirlineEntity airline;
	
	@Column(name = "ANSWER")
	private String answer;
	
	@Column(name = "STATUS", nullable = false)
	@Enumerated(EnumType.STRING)
	private RatingStatus status;

	// Getters and Setters
	public Integer getId() {
		return id;
	}

	public void setId(Integer id) {
		this.id = id;
	}

	public LocalDate getDate() {
		return date;
	}

	public void setDate(LocalDate date) {
		this.date = date;
	}

	public String getAnswer() {
		return answer;
	}

	public void setAnswer(String answer) {
		this.answer = answer;
	}

	public String getFlightNumber() {
		return flightNumber;
	}

	public void setFlightNumber(String flightNumber) {
		this.flightNumber = flightNumber;
	}

	public Integer getRating() {
		return rating;
	}

	public void setRating(Integer rating) {
		this.rating = rating;
	}

	public String getComment() {
		return comment;
	}

	public void setComment(String comment) {
		this.comment = comment;
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

	public AirlineEntity getAirline() {
		return airline;
	}

	public void setAirline(AirlineEntity airline) {
		this.airline = airline;
	}

	public RatingStatus getStatus() {
		return status;
	}

	public void setStatus(RatingStatus status) {
		this.status = status;
	}
}
