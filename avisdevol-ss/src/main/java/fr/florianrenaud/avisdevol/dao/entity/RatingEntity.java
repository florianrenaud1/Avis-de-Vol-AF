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

/**
 * Entity representing a rating.
 * Contains details about the rating, including flight information, comments, and status.
 */
@Entity
@Table(name = "RATING")
@SequenceGenerator(name = "SEQ_RATING", sequenceName = "SEQ_RATING", allocationSize = 1)
public class RatingEntity {

	/** id */
	@Id
	@GeneratedValue(strategy = GenerationType.AUTO, generator = "SEQ_RATING")
	private Integer id;

	/** flight number */
	@Column(name = "FLIGHT_NUMBER", nullable = false)
	private String flightNumber;
	
	/** date of the rating */
	@Column(name = "DATE", nullable = false)
	private LocalDate date;

	/** answer to the rating */
	@Column(name = "CREATION_DATE", nullable = false)
	@CreationTimestamp
	private LocalDate createdAt;

	/** rating value */
	@Column(name = "RATING", nullable = false)
	private Integer rating;

	/** comment on the rating */
	@Column(name = "COMMENT")
	private String comment;

	/** date de Fin */
	@Column(name = "LAST_UPDATE_DATE")
	@UpdateTimestamp
	private LocalDate updatedAt;

	/** airline associated with the rating */
	@ManyToOne(fetch = FetchType.LAZY, optional = true)
	@JoinColumn(name = "AIRLINE_ID", nullable = false)
	private AirlineEntity airline;
	
	/** answer to the rating */
	@Column(name = "ANSWER")
	private String answer;
	
	/** status of the rating */
	@Column(name = "STATUS", nullable = false)
	@Enumerated(EnumType.STRING)
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
	 * @param id the rating ID to set
	 */
	public void setId(Integer id) {
		this.id = id;
	}

	/**
	 * Gets the date of the rating.
	 * @return the rating date
	 */
	public LocalDate getDate() {
		return date;
	}

	/**
	 * Sets the date of the rating.
	 * @param date the rating date to set
	 */
	public void setDate(LocalDate date) {
		this.date = date;
	}

	/**
	 * Gets the answer to the rating.
	 * @return the answer to the rating
	 */
	public String getAnswer() {
		return answer;
	}

	/**
	 * Sets the answer to the rating.
	 * @param answer the answer to set
	 */
	public void setAnswer(String answer) {
		this.answer = answer;
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
	 * @param flightNumber the flight number to set
	 */
	public void setFlightNumber(String flightNumber) {
		this.flightNumber = flightNumber;
	}

	/**
	 * Gets the rating value.
	 * @return the rating value (1-5)
	 */
	public Integer getRating() {
		return rating;
	}

	/**
	 * Sets the rating value.
	 * @param rating the rating value to set (1-5)
	 */
	public void setRating(Integer rating) {
		this.rating = rating;
	}

	/**
	 * Gets the comment on the rating.
	 * @return the comment
	 */
	public String getComment() {
		return comment;
	}

	/**
	 * Sets the comment on the rating.
	 * @param comment the comment to set
	 */
	public void setComment(String comment) {
		this.comment = comment;
	}

	/**
	 * Gets the creation date of the rating.
	 * @return the creation date
	 */
	public LocalDate getCreatedAt() {
		return createdAt;
	}

	/**
	 * Sets the creation date of the rating.
	 * @param createdAt the creation date to set
	 */
	public void setCreatedAt(LocalDate createdAt) {
		this.createdAt = createdAt;
	}

	/**
	 * Gets the last update date of the rating.
	 * @return the last update date
	 */
	public LocalDate getUpdatedAt() {
		return updatedAt;
	}

	/**
	 * Sets the last update date of the rating.
	 * @param updatedAt the last update date to set
	 */
	public void setUpdatedAt(LocalDate updatedAt) {
		this.updatedAt = updatedAt;
	}

	/**
	 * Gets the airline associated with this rating.
	 * @return the airline entity
	 */
	public AirlineEntity getAirline() {
		return airline;
	}

	/**
	 * Sets the airline associated with this rating.
	 * @param airline the airline entity to set
	 */
	public void setAirline(AirlineEntity airline) {
		this.airline = airline;
	}

	/**
	 * Gets the status of the rating.
	 * @return the rating status
	 */
	public RatingStatus getStatus() {
		return status;
	}

	/**
	 * Sets the status of the rating.
	 * @param status the rating status to set
	 */
	public void setStatus(RatingStatus status) {
		this.status = status;
	}
}
