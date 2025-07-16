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

	/**
	 * Returns the id of the airline.
	 * @return the id of the airline
	 */
	public Long getId() {
		return id;
	}

	/**
	 * Sets the id of the airline.
	 * @param id the id to set
	 */
	public void setId(Long id) {
		this.id = id;
	}

	/**
	 * Returns the name of the airline.
	 * @return the name of the airline
	 */
	public String getName() {
		return name;
	}

	/**
	 * Sets the name of the airline.
	 * @param name the name to set
	 */
	public void setName(String name) {
		this.name = name;
	}

	/**
	 * Returns the IATA code of the airline.
	 * @return the IATA code of the airline
	 */
	public String getIataCode() {
		return iataCode;
	}

	/**
	 * Sets the IATA code of the airline.
	 * @param iataCode the IATA code to set
	 */
	public void setIataCode(String iataCode) {
		this.iataCode = iataCode;
	}

	/**
	 * Returns the ICAO code of the airline.
	 * @return the ICAO code of the airline
	 */
	public String getIcaoCode() {
		return icaoCode;
	}

	/**
	 * Sets the ICAO code of the airline.
	 * @param icaoCode the ICAO code to set
	 */
	public void setIcaoCode(String icaoCode) {
		this.icaoCode = icaoCode;
	}

	/**
	 * Returns the country of the airline.
	 * @return the country of the airline
	 */
	public String getCountry() {
		return country;
	}

	/**
	 * Sets the country of the airline.
	 * @param country the country to set
	 */
	public void setCountry(String country) {
		this.country = country;
	}

	/**
	 * Returns whether the airline is active.
	 * @return true if the airline is active, false otherwise
	 */
	public Boolean getActive() {
		return active;
	}

	/**
	 * Sets whether the airline is active.
	 * @param active true if the airline is active, false otherwise
	 */
	public void setActive(Boolean active) {
		this.active = active;
	}
}
