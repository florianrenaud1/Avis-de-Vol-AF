package fr.florianrenaud.avisdevol.dao.service;

import java.util.List;
import java.util.Optional;

import fr.florianrenaud.avisdevol.dao.entity.AirlineEntity;

/**
 * Service interface for managing airlines.
 */
public interface AirlineService {
	
	/**
	 * Retrieves a list of airlines where the name contains the specified filters.
	 * @param filters the name filters to search for
	 * @return a list of AirlineEntity objects matching the filters
	 */
	List<AirlineEntity> getAirlinesWhereNameContains(String filters);
	
	/**
	 * Retrieves an airline by its name, ignoring case.
	 * @param name the name of the airline to search for
	 * @return an Optional containing the AirlineEntity if found, or empty if not found
	 */
	Optional<AirlineEntity> getAirlineByName(String name);
	
}
