package fr.florianrenaud.avisdevol.business.service;

import java.util.List;

import fr.florianrenaud.avisdevol.business.resources.AirlineResource;

/**
 * Service interface for managing airlines.
 */
public interface BizAirlineService {

	/**
	 * Retrieves a list of airlines by their name.
	 */
	List<AirlineResource> getAirlinesByName(String name);
}
