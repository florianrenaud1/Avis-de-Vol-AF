package fr.florianrenaud.avisdevol.dao.service.impl;

import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;

import fr.florianrenaud.avisdevol.dao.entity.AirlineEntity;
import fr.florianrenaud.avisdevol.dao.repository.AirlineRepository;
import fr.florianrenaud.avisdevol.dao.service.AirlineService;

/**
 * Implementation of the AirlineService interface.
 */
@Service
public class AirlineServiceImpl implements AirlineService {
	
	private final AirlineRepository airlineRepository;
	
	/**
	 * Constructor for AirlineServiceImpl.
	 * @param airlineRepository the AirlineRepository to use
	 */
	public AirlineServiceImpl(AirlineRepository airlineRepository) {
		this.airlineRepository = airlineRepository;
	}

	/**
	 * {@inheritDoc}
	 */
	@Override
	public List<AirlineEntity> getAirlinesWhereNameContains(String name) {
		return this.airlineRepository.findTop5ByNameContainingIgnoreCase(name);
	}
	
	/**
	 * {@inheritDoc}
	 */
	@Override
	public Optional<AirlineEntity> getAirlineByName(String name) {
		return this.airlineRepository.findByNameIgnoreCase(name);
	}

}
