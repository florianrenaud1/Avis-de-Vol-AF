package fr.florianrenaud.avisdevol.dao.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.SequenceGenerator;
import jakarta.persistence.Table;

/**
 * Entity representing an airline.
 */
@Entity
@Table(name = "AIRLINE")
@SequenceGenerator(name = "SEQ_AIRLINE", sequenceName = "SEQ_AIRLINE", allocationSize = 1)
public class AirlineEntity {

	/** id */
	@Id
	@GeneratedValue(strategy = GenerationType.AUTO, generator = "SEQ_AIRLINE")
	private Long id;

	@Column(name = "NAME", nullable = false, length = 100)
	private String name;

	@Column(name = "IATA_CODE", nullable = false, length = 3)
	private String iataCode;

	@Column(name = "ICAO_CODE", nullable = false, length = 4)
	private String icaoCode;

	@Column(name = "COUNTRY", nullable = false, length = 100)
	private String country;

	@Column(name = "ACTIVE", nullable = false)
	private Boolean active;

	// Getters and Setters
	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public String getIataCode() {
		return iataCode;
	}

	public void setIataCode(String iataCode) {
		this.iataCode = iataCode;
	}

	public String getIcaoCode() {
		return icaoCode;
	}

	public void setIcaoCode(String icaoCode) {
		this.icaoCode = icaoCode;
	}

	public String getCountry() {
		return country;
	}

	public void setCountry(String country) {
		this.country = country;
	}

	public Boolean getActive() {
		return active;
	}

	public void setActive(Boolean active) {
		this.active = active;
	}
}
