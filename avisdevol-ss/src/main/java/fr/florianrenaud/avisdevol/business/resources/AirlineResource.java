package fr.florianrenaud.avisdevol.business.resources;

import com.fasterxml.jackson.annotation.JsonInclude;

/**
 * Resource that represents an airline.
 */
@JsonInclude(JsonInclude.Include.NON_NULL)
public class AirlineResource {
	private String id;
	private String name;
	private String iataCode;
	private String icaoCode;
	private String country;
	private Boolean active;

	// Getters and Setters
	public String getId() {
		return id;
	}

	public void setId(String id) {
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
