package fr.florianrenaud.avisdevol.business.service.impl;

import java.util.List;

import org.springframework.stereotype.Service;

import fr.florianrenaud.avisdevol.business.mapper.AirlineMapper;
import fr.florianrenaud.avisdevol.business.resources.AirlineResource;
import fr.florianrenaud.avisdevol.business.service.BizAirlineService;
import fr.florianrenaud.avisdevol.dao.entity.AirlineEntity;
import fr.florianrenaud.avisdevol.dao.service.AirlineService;

/**
 * Implementation of the BizAirlineService interface.
 */
@Service
public class BizAirlineServiceImpl implements BizAirlineService {
	
	private final AirlineService airlineService;
	private final AirlineMapper airlineMapper;
	
	/**
	 * Constructor for BizAirlineServiceImpl.
	 * @param airlineService the AirlineService to use
	 * @param airlineMapper the AirlineMapper to use
	 */
	public BizAirlineServiceImpl(AirlineService airlineService, AirlineMapper airlineMapper) {
		this.airlineService = airlineService;
		this.airlineMapper = airlineMapper;
	}
	
	/**
	 * {@inheritDoc}
	 */
	@Override
	public List<AirlineResource> getAirlinesByName(String name) {
		List<AirlineEntity> airlinesEntities = this.airlineService.getAirlinesWhereNameContains(name);
		return this.airlineMapper.airlineEntitiesToAirlineResources(airlinesEntities);
	}
}
